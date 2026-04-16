import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-server';

export async function POST(request: NextRequest) {
  const { authorized } = await verifyAdmin(request);

  if (!authorized) {
    return NextResponse.json({ code: 401, error: '未授权' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ code: 400, error: '未选择文件' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ code: 400, error: '只能上传图片文件' }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ code: 400, error: '图片大小不能超过 5MB' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({ code: 200, url: dataUrl });
  } catch (error) {
    return NextResponse.json({ code: 500, error: '上传失败' }, { status: 500 });
  }
}