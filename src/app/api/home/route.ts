import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { successResponse, errorResponse } from '@/types/api';

export async function GET() {
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order');

  if (categoriesError) {
    return NextResponse.json(errorResponse(categoriesError.message), { status: 500 });
  }

  const { data: featuredTools, error: toolsError } = await supabase.from('tools').select('*').eq('featured', true);

  if (toolsError) {
    return NextResponse.json(errorResponse(toolsError.message), { status: 500 });
  }

  const { data: processSteps, error: stepsError } = await supabase
    .from('process_steps')
    .select('*')
    .order('sort_order');

  if (stepsError) {
    return NextResponse.json(errorResponse(stepsError.message), { status: 500 });
  }

  return NextResponse.json(
    successResponse({
      categories,
      featuredTools,
      processSteps
    })
  );
}
