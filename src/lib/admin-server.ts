import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function verifyAdmin(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        }
      }
    }
  );

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  console.log('[Admin Server] User:', user?.id, 'Error:', error);

  if (!user) {
    return { authorized: false, user: null, supabase, response };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  console.log('[Admin Server] Profile:', profile, 'Error:', profileError);

  const isAdmin = profile?.role === 'admin';

  return { authorized: isAdmin, user, supabase, response };
}
