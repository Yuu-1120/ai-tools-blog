import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (categoriesError) {
    return NextResponse.json({ code: 500, error: categoriesError.message }, { status: 500 });
  }

  const { data: tools, error: toolsError } = await supabase
    .from('tools')
    .select('*')
    .order('sort_order', { ascending: true });

  if (toolsError) {
    return NextResponse.json({ code: 500, error: toolsError.message }, { status: 500 });
  }

  return NextResponse.json({
    code: 200,
    data: {
      categories,
      tools
    }
  });
}
