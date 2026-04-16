'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { User, Settings } from 'lucide-react';

export function Navbar() {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <div className='fixed top-6 right-6 z-50 flex items-center gap-3'>
      {isAdmin && (
        <Link
          href='/admin'
          className='w-10 h-10 rounded-full bg-ivory/80 backdrop-blur-sm border border-border-cream shadow-sm hover:bg-parchment transition-colors flex items-center justify-center'
          title='管理后台'
        >
          <Settings className='w-5 h-5 text-charcoalWarm' />
        </Link>
      )}
      <ThemeToggle />
      {user ? (
        <div className='flex items-center gap-2 px-4 py-2 rounded-lg bg-ivory/80 backdrop-blur-sm border border-warm-200 shadow-sm'>
          <div className='w-7 h-7 rounded-full bg-terracotta flex items-center justify-center'>
            <User className='w-4 h-4 text-ivory' />
          </div>
          <span className='hidden sm:inline text-sm font-medium text-warm-700'>{user.email}</span>
          <button
            onClick={() => signOut()}
            className='ml-2 text-xs text-warm-500 hover:text-terracotta transition-colors'
          >
            退出
          </button>
        </div>
      ) : (
        <Link
          href='/auth/login'
          className='px-5 py-2 rounded-lg bg-terracotta text-ivory font-medium hover:bg-coral transition-colors text-sm'
        >
          登录
        </Link>
      )}
    </div>
  );
}