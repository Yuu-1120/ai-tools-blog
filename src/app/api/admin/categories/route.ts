import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });

  if (error) {
    return NextResponse.json({ code: 500, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ code: 200, data });
}

export async function POST(request: NextRequest) {
  const { authorized, supabase } = await verifyAdmin(request);

  if (!authorized) {
    return NextResponse.json({ code: 401, error: '未授权' }, { status: 401 });
  }

  const body = await request.json();
  const { name, slug, icon, description, intro_markdown, sort_order } = body;

  if (!name || !slug || !icon) {
    return NextResponse.json({ code: 400, error: '缺少必填字段' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('categories')
    .insert([{ name, slug, icon, description, intro_markdown, sort_order }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ code: 500, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ code: 200, data });
}
