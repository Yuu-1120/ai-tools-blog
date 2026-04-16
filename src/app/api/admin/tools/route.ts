import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-server';

export async function GET(request: NextRequest) {
  const { authorized, supabase } = await verifyAdmin(request);

  if (!authorized) {
    return NextResponse.json({ code: 401, error: '未授权' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('category_id');

  let query = supabase
    .from('tools')
    .select('*')
    .order('sort_order', { ascending: true });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

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
  const { category_id, name, logo_url, description, website_url, pricing, tags, sort_order } = body;

  if (!category_id || !name || !website_url) {
    return NextResponse.json({ code: 400, error: '缺少必填字段' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('tools')
    .insert([{ category_id, name, logo_url, description, website_url, pricing, tags, sort_order }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ code: 500, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ code: 200, data });
}