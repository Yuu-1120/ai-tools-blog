import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const cookies = request.cookies.getAll();
  const cookieNames = cookies.map(c => c.name);

  return NextResponse.json({
    message: 'Debug info',
    cookieNames,
    hasSupabaseCookie: cookieNames.some(name => name.includes('supabase') || name.includes('sb-')),
    allCookies: cookies
  });
}