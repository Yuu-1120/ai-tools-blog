'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        router.push('/auth/reset-password');
        subscription.unsubscribe();
      } else if (session && session.user) {
        router.push('/');
        subscription.unsubscribe();
      }
    });

    const timer = setTimeout(() => {
      router.push('/auth/login');
      subscription.unsubscribe();
    }, 5000);

    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <main className='min-h-screen bg-parchment flex items-center justify-center'>
      <div className='text-center'>
        <Loader2 className='w-8 h-8 animate-spin text-terracotta mx-auto mb-4' />
        <p className='text-olive-gray'>验证中...</p>
      </div>
    </main>
  );
}
