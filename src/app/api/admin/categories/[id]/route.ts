import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized, supabase } = await verifyAdmin(request);

  if (!authorized) {
    return NextResponse.json({ code: 401, error: '未授权' }, { status: 401 });
  }

  const { id } = await params;
  const { data, error } = await supabase.from('categories').select('*').eq('id', id).single();

  if (error) {
    return NextResponse.json({ code: 404, error: '分类不存在' }, { status: 404 });
  }

  return NextResponse.json({ code: 200, data });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized, supabase } = await verifyAdmin(request);

  if (!authorized) {
    return NextResponse.json({ code: 401, error: '未授权' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const { data, error } = await supabase.from('categories').update(body).eq('id', id).select().single();

  if (error) {
    return NextResponse.json({ code: 500, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ code: 200, data });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized, supabase } = await verifyAdmin(request);

  if (!authorized) {
    return NextResponse.json({ code: 401, error: '未授权' }, { status: 401 });
  }

  const { id } = await params;
  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ code: 500, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ code: 200, message: '删除成功' });
}