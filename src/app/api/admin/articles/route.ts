import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-server';

export async function GET(request: NextRequest) {
  const { authorized, supabase } = await verifyAdmin(request);

  if (!authorized) {
    return NextResponse.json({ code: 401, error: '未授权' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  let query = supabase.from('articles').select('*').order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ code: 500, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ code: 200, data });
}

export async function POST(request: NextRequest) {
  const { authorized, user, supabase } = await verifyAdmin(request);

  if (!authorized || !user) {
    return NextResponse.json({ code: 401, error: '未授权' }, { status: 401 });
  }

  const body = await request.json();
  const { title, slug, cover_image, excerpt, content_markdown, tags, status, featured } = body;

  if (!title || !slug || !content_markdown) {
    return NextResponse.json({ code: 400, error: '缺少必填字段' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('articles')
    .insert([
      {
        title,
        slug,
        cover_image,
        excerpt,
        content_markdown,
        tags,
        status: status || 'draft',
        featured: featured || false,
        author_id: user.id
      }
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ code: 500, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ code: 200, data });
}
