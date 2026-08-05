import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabaseServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { snap } from '@/lib/midtrans';

interface ProductInfo {
  price: number;
  discount: number;
  name: string;
}

interface VariantWithProduct {
  id: string;
  stock: number;
  sku: string;
  color: string;
  size: string;
  products: ProductInfo | ProductInfo[] | null;
}

// Helper to handle both object and array results from Supabase joins
function getProductInfo(products: ProductInfo | ProductInfo[] | null): ProductInfo | null {
  if (!products) return null;
  if (Array.isArray(products)) {
    return products[0];
  }
  return products;
}

interface CheckoutItem {
  variantId: string;
  quantity: number;
  name?: string;
  variantLabel?: string;
  price?: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { addressId, courier, items } = body;

    // Presence and format validation for addressId and courier
    if (!addressId || typeof addressId !== 'string' || addressId.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Invalid payload: addressId must be a non-empty string' },
        { status: 400 }
      );
    }

    if (!courier || typeof courier !== 'string' || courier.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Invalid payload: courier must be a non-empty string' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload: items must be a non-empty array' },
        { status: 400 }
      );
    }

    // Validate each item in the payload structure
    for (const item of items as CheckoutItem[]) {
      if (!item.variantId || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return NextResponse.json(
          { success: false, message: 'Invalid payload: each item must have a valid variantId and quantity > 0' },
          { status: 400 }
        );
      }
    }

    const supabase = await supabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, message: 'Unauthenticated' }, { status: 401 });
    }

    // Aggregate items by variantId to prevent stock bypasses via duplicate entries
    const aggregatedMap = new Map<string, number>();
    for (const item of items as CheckoutItem[]) {
      const currentQty = aggregatedMap.get(item.variantId) || 0;
      aggregatedMap.set(item.variantId, currentQty + item.quantity);
    }

    // Securely query variant details, including the nested product prices/discounts
    const variantIds = Array.from(aggregatedMap.keys());
    const { data: variants, error: variantsErr } = await supabase
      .from('product_variants')
      .select('id, stock, sku, color, size, products ( price, discount, name )')
      .in('id', variantIds);

    if (variantsErr || !variants) {
      return NextResponse.json(
        { success: false, message: variantsErr?.message || 'Failed to fetch variants' },
        { status: 400 }
      );
    }

    const variantMap = new Map<string, VariantWithProduct>();
    for (const v of variants) {
      variantMap.set(v.id, v);
    }

    // Validate stock levels using the aggregated quantities
    for (const [variantId, qty] of aggregatedMap.entries()) {
      const variant = variantMap.get(variantId);
      if (!variant) {
        return NextResponse.json(
          { success: false, message: `Variant ${variantId} not found` },
          { status: 400 }
        );
      }
      if (variant.stock < qty) {
        return NextResponse.json(
          { success: false, message: `Insufficient stock for SKU ${variant.sku}` },
          { status: 400 }
        );
      }
    }

    // Securely calculate pricing and prepare order items on the server side
    let grossAmount = 0;
    const secureItems = [];

    for (const item of items as CheckoutItem[]) {
      const variant = variantMap.get(item.variantId);
      if (!variant) {
        return NextResponse.json(
          { success: false, message: `Variant ${item.variantId} not found` },
          { status: 400 }
        );
      }
      const prod = getProductInfo(variant.products);

      if (!prod) {
        return NextResponse.json(
          { success: false, message: `Product details not found for variant ${item.variantId}` },
          { status: 400 }
        );
      }

      const originalPrice = Number(prod.price);
      const discountPercent = Number(prod.discount || 0);
      const securePrice = originalPrice * (1 - discountPercent / 100);
      const subtotal = securePrice * item.quantity;
      grossAmount += subtotal;

      secureItems.push({
        product_variant_id: item.variantId,
        product_name: prod.name,
        variant_label: `${variant.color} / ${variant.size}`,
        price: securePrice,
        quantity: item.quantity,
        subtotal,
      });
    }

    // Generate a collision-resistant order number
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `PLT-${Date.now()}-${randomSuffix}`;

    // Decrement variant stock levels via atomic RPC using admin client
    for (const [variantId, qty] of aggregatedMap.entries()) {
      const { error: stockErr } = await supabaseAdmin.rpc('adjust_variant_stock', {
        variant_id: variantId,
        qty: -qty,
      });
      if (stockErr) {
        // Rollback any stock decrement we've already done in this loop
        for (const [rollbackId, rollbackQty] of aggregatedMap.entries()) {
          if (rollbackId === variantId) break;
          await supabaseAdmin.rpc('adjust_variant_stock', {
            variant_id: rollbackId,
            qty: rollbackQty,
          });
        }
        return NextResponse.json(
          { success: false, message: stockErr.message || 'Failed to update stock' },
          { status: 400 }
        );
      }
    }

    const restoreStock = async () => {
      for (const [variantId, qty] of aggregatedMap.entries()) {
        await supabaseAdmin.rpc('adjust_variant_stock', {
          variant_id: variantId,
          qty,
        });
      }
    };

    // 2. Insert into orders table in DB
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        status: 'pending',
        payment_status: 'pending',
        subtotal: grossAmount,
        discount_amount: 0,
        shipping_cost: 0, // Mocked for simplicity
        total: grossAmount,
        shipping_address: { address_id: addressId },
        courier,
      })
      .select()
      .single();

    if (orderErr || !order) {
      await restoreStock();
      return NextResponse.json(
        { success: false, message: orderErr?.message || 'Failed to create order' },
        { status: 400 }
      );
    }

    // Insert into order_items table in DB using secure server-calculated items
    const orderItemsData = secureItems.map((item) => ({
      order_id: order.id,
      product_variant_id: item.product_variant_id,
      product_name: item.product_name,
      variant_label: item.variant_label,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.subtotal,
    }));

    const { error: itemsErr } = await supabase
      .from('order_items')
      .insert(orderItemsData);

    if (itemsErr) {
      // Cleanup stock and order if items insertion fails
      await restoreStock();
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json({ success: false, message: itemsErr.message }, { status: 400 });
    }

    // 3. Initiate Transaction in Midtrans Snap
    const parameter = {
      transaction_details: {
        order_id: orderNumber,
        gross_amount: grossAmount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        email: user.email,
      },
    };

    try {
      const transaction = await snap.createTransaction(parameter);

      // Store snap token in payments database
      const { error: paymentErr } = await supabase.from('payments').insert({
        order_id: order.id,
        gross_amount: grossAmount,
        snap_token: transaction.token,
        status: 'pending',
      });

      if (paymentErr) {
        // Cleanup stock and order if payment record insertion fails
        await restoreStock();
        await supabase.from('orders').delete().eq('id', order.id);
        return NextResponse.json({ success: false, message: paymentErr.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        token: transaction.token,
        redirectUrl: transaction.redirect_url,
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Midtrans payment gateway error';
      // Cleanup stock and order if midtrans fails
      await restoreStock();
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json({ success: false, message: errMsg }, { status: 500 });
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
