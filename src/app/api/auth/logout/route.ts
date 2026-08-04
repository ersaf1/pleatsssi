import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabaseServer';

export async function POST() {
  try {
    const supabase = await supabaseServerClient();
    await supabase.auth.signOut();
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
