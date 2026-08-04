import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabaseServer';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      payment_type,
      transaction_id,
    } = payload;

    // Validate presence of required signature inputs
    if (!order_id || !status_code || !gross_amount || !signature_key || !transaction_status) {
      return NextResponse.json(
        { success: false, message: 'Missing required payload parameters' },
        { status: 400 }
      );
    }

    // Validate Signature Key
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      return NextResponse.json(
        { success: false, message: 'Server configuration error: MIDTRANS_SERVER_KEY is not defined' },
        { status: 500 }
      );
    }

    const payloadStr = `${order_id}${status_code}${gross_amount}${serverKey}`;
    const hash = crypto.createHash('sha512').update(payloadStr).digest('hex');

    if (hash !== signature_key) {
      return NextResponse.json({ success: false, message: 'Invalid Signature' }, { status: 403 });
    }

    const supabase = await supabaseServerClient();

    // Fetch the existing order by its unique order number
    const { data: order, error: orderFetchErr } = await supabase
      .from('orders')
      .select('id, status, payment_status')
      .eq('order_number', order_id)
      .single();

    if (orderFetchErr || !order) {
      return NextResponse.json(
        { success: false, message: orderFetchErr?.message || 'Order not found' },
        { status: 404 }
      );
    }

    // Map Midtrans transaction_status to Database order status and payment status
    let orderStatus = order.status;
    let paymentStatus = order.payment_status;

    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      orderStatus = 'processing';
      paymentStatus = 'paid';
    } else if (transaction_status === 'pending') {
      orderStatus = 'pending';
      paymentStatus = 'pending';
    } else if (transaction_status === 'deny' || transaction_status === 'cancel') {
      orderStatus = 'cancelled';
      paymentStatus = 'failed';
    } else if (transaction_status === 'expire') {
      orderStatus = 'cancelled';
      paymentStatus = 'expired';
    } else if (transaction_status === 'refund') {
      orderStatus = 'cancelled';
      paymentStatus = 'refunded';
    }

    // Update order status and payment_status in DB
    const { error: updateOrderErr } = await supabase
      .from('orders')
      .update({
        status: orderStatus,
        payment_status: paymentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id);

    if (updateOrderErr) {
      return NextResponse.json(
        { success: false, message: updateOrderErr.message },
        { status: 400 }
      );
    }

    // Update payments table details
    const { error: updatePaymentErr } = await supabase
      .from('payments')
      .update({
        status: transaction_status,
        payment_method: payment_type || null,
        midtrans_transaction_id: transaction_id || null,
        raw_payload: payload,
        paid_at: (transaction_status === 'settlement' || transaction_status === 'capture') ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('order_id', order.id);

    if (updatePaymentErr) {
      return NextResponse.json(
        { success: false, message: updatePaymentErr.message },
        { status: 400 }
      );
    }

    // If order was not cancelled previously but is now cancelled, restore variant stock levels
    if (orderStatus === 'cancelled' && order.status !== 'cancelled') {
      const { data: orderItems, error: itemsErr } = await supabase
        .from('order_items')
        .select('product_variant_id, quantity')
        .eq('order_id', order.id);

      if (!itemsErr && orderItems) {
        for (const item of orderItems) {
          const { data: variant, error: variantErr } = await supabase
            .from('product_variants')
            .select('stock')
            .eq('id', item.product_variant_id)
            .single();

          if (!variantErr && variant) {
            await supabase
              .from('product_variants')
              .update({
                stock: variant.stock + item.quantity,
              })
              .eq('id', item.product_variant_id);
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
