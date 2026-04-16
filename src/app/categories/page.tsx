'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/navbar';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const result = await res.json();
        if (result.code === 200) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      fetchCategories();
    }
  }, [user]);

  if (!user || loading || authLoading) {
    return (
      <div className='min-h-screen bg-parchment flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta' />
      </div>
    );
  }

  return (
    <main className='min-h-screen bg-parchment'>
      <Navbar />

      <div className='max-w-6xl mx-auto px-4 pt-24 pb-16'>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='mb-12'>
          <div className='flex items-center gap-2 text-sm text-warm-500 mb-4'>
            <Link href='/' className='hover:text-terracotta'>
              首页
            </Link>
            <span>/</span>
            <span>分类</span>
          </div>
          <h1 className='text-4xl md:text-5xl font-serif font-medium text-warm-900 mb-4'>AI 工具分类</h1>
          <p className='text-warm-600 text-lg'>按用途浏览，找到最适合你的 AI 工具</p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Link href={`/categories/${category.slug}`}>
                <div className='group relative p-8 bg-ivory rounded-xl border border-warm-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full'>
                  <div className='text-5xl mb-4'>{category.icon}</div>
                  <h2 className='text-2xl font-serif font-medium text-warm-900 mb-2 group-hover:text-terracotta transition-colors'>
                    {category.name}
                  </h2>
                  <p className='text-warm-500 mb-4'>{category.description}</p>
                  {category.intro_markdown && (
                    <p className='text-sm text-warm-400 line-clamp-3 mb-4'>
                      {category.intro_markdown.replace(/[#*`]/g, '').slice(0, 100)}...
                    </p>
                  )}
                  <div className='flex items-center justify-between mt-auto'>
                    <span className='text-sm text-terracotta'>查看详情</span>
                    <ArrowRight className='w-5 h-5 text-terracotta group-hover:translate-x-1 transition-transform' />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
