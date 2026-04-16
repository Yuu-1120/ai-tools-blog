'use client';

import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderOpen,
  Wrench,
  FileText,
  LogOut,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useEffect } from 'react';

const navItems = [
  { href: '/admin', label: '仪表盘', icon: LayoutDashboard },
  { href: '/admin/categories', label: '分类管理', icon: FolderOpen },
  { href: '/admin/tools', label: '工具管理', icon: Wrench },
  { href: '/admin/articles', label: '文章管理', icon: FileText },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading, isAdmin, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (!loading && user && !isAdmin) {
      router.push('/');
    }
  }, [loading, user, isAdmin, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className='min-h-screen bg-parchment flex items-center justify-center'>
        <div className='text-terracotta'>加载中...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-parchment flex'>
      <aside className='w-64 bg-ivory border-r border-warm-200 flex flex-col fixed h-screen'>
        <div className='p-6 border-b border-warm-200'>
          <Link href='/' className='flex items-center gap-2'>
            <Sparkles className='w-6 h-6 text-terracotta' />
            <span className='font-bold text-lg'>AI Tools</span>
            <span className='text-xs bg-terracotta/10 text-terracotta px-2 py-0.5 rounded'>
              Admin
            </span>
          </Link>
        </div>

        <nav className='flex-1 p-4 space-y-1 overflow-y-auto'>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-terracotta/10 text-terracotta'
                    : 'text-warm-600 hover:bg-warm-100'
                }`}
              >
                <item.icon className='w-5 h-5' />
                <span>{item.label}</span>
                {isActive && <ChevronRight className='w-4 h-4 ml-auto' />}
              </Link>
            );
          })}
        </nav>

        <div className='p-4 border-t border-warm-200'>
          <div className='px-4 py-2 text-sm text-warm-500 mb-2 truncate'>
            {profile?.email}
          </div>
          <button
            onClick={() => signOut()}
            className='flex items-center gap-3 px-4 py-3 w-full text-warm-600 hover:bg-warm-100 rounded-lg transition-colors'
          >
            <LogOut className='w-5 h-5' />
            <span>退出登录</span>
          </button>
        </div>
      </aside>

      <main className='flex-1 p-8 ml-64 overflow-y-auto h-screen'>{children}</main>
    </div>
  );
}
