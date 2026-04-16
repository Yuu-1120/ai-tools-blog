import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { data: category, error: catError } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .single();

  if (catError || !category) {
    return NextResponse.json({ code: 404, error: '分类不存在' }, { status: 404 });
  }

  const { data: tools, error: toolsError } = await supabase
    .from('tools')
    .select('*')
    .eq('category_id', category.id)
    .order('sort_order', { ascending: true });

  if (toolsError) {
    return NextResponse.json({ code: 500, error: toolsError.message }, { status: 500 });
  }

  return NextResponse.json({ code: 200, data: tools });
}
