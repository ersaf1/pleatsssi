import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabaseServer';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const items = body.items;

    if (!Array.isArray(items)) {
      return NextResponse.json({ success: false, message: 'Invalid payload: items must be an array' }, { status: 400 });
    }

    const supabase = await supabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, message: 'Unauthenticated' }, { status: 401 });
    }

    if (items.length === 0) {
      return NextResponse.json({ success: true, message: 'No items to sync' });
    }

    // Fetch existing cart items from database
    const { data: dbItems, error: fetchError } = await supabase
      .from('cart_items')
      .select('product_variant_id, quantity')
      .eq('user_id', user.id);

    if (fetchError) {
      return NextResponse.json({ success: false, message: fetchError.message }, { status: 400 });
    }

    // Merge logic
    const mergedMap = new Map<string, number>();

    if (dbItems) {
      for (const dbItem of dbItems) {
        mergedMap.set(dbItem.product_variant_id, dbItem.quantity);
      }
    }

    for (const item of items) {
      if (!item.variantId || typeof item.quantity !== 'number') {
        continue;
      }
      const existingQty = mergedMap.get(item.variantId) || 0;
      mergedMap.set(item.variantId, existingQty + item.quantity);
    }

    const upsertData = Array.from(mergedMap.entries()).map(([variantId, quantity]) => ({
      user_id: user.id,
      product_variant_id: variantId,
      quantity,
    }));

    if (upsertData.length > 0) {
      const { error: upsertError } = await supabase
        .from('cart_items')
        .upsert(upsertData, { onConflict: 'user_id,product_variant_id' });

      if (upsertError) {
        return NextResponse.json({ success: false, message: upsertError.message }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
