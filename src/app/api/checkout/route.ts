import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabaseServer';
import { snap } from '@/lib/midtrans';

interface CheckoutItem {
  variantId: string;
  name: string;
  variantLabel: string;
  price: number;
  quantity: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { addressId, courier, items } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload: items must be a non-empty array' },
        { status: 400 }
      );
    }

    // Validate each item in the payload
    for (const item of items as CheckoutItem[]) {
      if (!item.variantId || typeof item.price !== 'number' || item.price <= 0 || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return NextResponse.json(
          { success: false, message: 'Invalid payload: each item must have a valid variantId, price > 0, and quantity > 0' },
          { status: 400 }
        );
      }
    }

    const supabase = await supabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, message: 'Unauthenticated' }, { status: 401 });
    }

    // 1. Calculate amount & validate variant stock levels
    const variantIds = items.map((item: CheckoutItem) => item.variantId);
    const { data: variants, error: variantsErr } = await supabase
      .from('product_variants')
      .select('id, stock, sku')
      .in('id', variantIds);

    if (variantsErr || !variants) {
      return NextResponse.json(
        { success: false, message: variantsErr?.message || 'Failed to fetch variants' },
        { status: 400 }
      );
    }

    const variantMap = new Map<string, { id: string; stock: number; sku: string }>();
    for (const v of variants) {
      variantMap.set(v.id, v);
    }

    for (const item of items as CheckoutItem[]) {
      const variant = variantMap.get(item.variantId);
      if (!variant) {
        return NextResponse.json(
          { success: false, message: `Variant ${item.variantId} not found` },
          { status: 400 }
        );
      }
      if (variant.stock < item.quantity) {
        return NextResponse.json(
          { success: false, message: `Insufficient stock for SKU ${variant.sku}` },
          { status: 400 }
        );
      }
    }

    let grossAmount = 0;
    for (const item of items as CheckoutItem[]) {
      grossAmount += item.price * item.quantity;
    }

    const orderNumber = `PLT-${Date.now()}`;

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
      return NextResponse.json(
        { success: false, message: orderErr?.message || 'Failed to create order' },
        { status: 400 }
      );
    }

    // Insert into order_items table in DB
    const orderItemsData = (items as CheckoutItem[]).map((item) => ({
      order_id: order.id,
      product_variant_id: item.variantId,
      product_name: item.name,
      variant_label: item.variantLabel,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    }));

    const { error: itemsErr } = await supabase
      .from('order_items')
      .insert(orderItemsData);

    if (itemsErr) {
      // Cleanup the order if items insertion fails
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
        // Cleanup order and items if payment record insertion fails
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
      // Cleanup order and items if midtrans fails
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json({ success: false, message: errMsg }, { status: 500 });
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
