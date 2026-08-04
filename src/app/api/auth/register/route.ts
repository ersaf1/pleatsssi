import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabaseServer';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();
    const supabase = await supabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
