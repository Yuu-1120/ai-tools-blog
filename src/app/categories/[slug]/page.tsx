'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/navbar';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [category, setCategory] = useState<any>(null);
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, toolsRes] = await Promise.all([
          fetch(`/api/categories/${slug}`),
          fetch(`/api/categories/${slug}/tools`)
        ]);

        const catResult = await catRes.json();
        const toolsResult = await toolsRes.json();

        if (catResult.code === 200) {
          setCategory(catResult.data);
        }
        if (toolsResult.code === 200) {
          setTools(toolsResult.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    if (user && slug) {
      fetchData();
    }
  }, [user, slug]);

  if (!user || loading || authLoading) {
    return (
      <div className='min-h-screen bg-parchment flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta' />
      </div>
    );
  }

  if (!category) {
    return (
      <div className='min-h-screen bg-parchment flex items-center justify-center'>
        <p className='text-warm-500'>分类不存在</p>
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
            <Link href='/categories' className='hover:text-terracotta'>
              分类
            </Link>
            <span>/</span>
            <span>{category.name}</span>
          </div>

          <div className='flex items-start gap-6'>
            <div className='text-6xl'>{category.icon}</div>
            <div>
              <h1 className='text-4xl md:text-5xl font-serif font-medium text-warm-900 mb-4'>{category.name}</h1>
              <p className='text-warm-600 text-lg mb-4'>{category.description}</p>
              {category.intro_markdown && (
                <div className='prose prose-warm max-w-none'>
                  <p className='text-warm-500 whitespace-pre-wrap'>{category.intro_markdown}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className='mb-8'>
          <h2 className='text-2xl font-serif font-medium text-warm-900 mb-6'>工具列表 ({tools.length})</h2>

          {tools.length === 0 ? (
            <p className='text-warm-500'>暂无工具</p>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {tools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className='p-6 bg-ivory rounded-xl border border-warm-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300'
                >
                  <div className='flex items-start justify-between mb-4'>
                    <div className='w-12 h-12 rounded-lg bg-terracotta flex items-center justify-center text-lg font-medium text-ivory'>
                      {tool.name.charAt(0)}
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        tool.pricing === 'free'
                          ? 'bg-green-100 text-green-700'
                          : tool.pricing === 'freemium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {tool.pricing === 'free' ? '免费' : tool.pricing === 'freemium' ? '免费+付费' : '付费'}
                    </span>
                  </div>
                  <h3 className='text-lg font-medium text-warm-900 mb-2'>{tool.name}</h3>
                  <p className='text-warm-500 text-sm mb-4 line-clamp-2'>{tool.description}</p>
                  <div className='flex items-center justify-between'>
                    <div className='flex flex-wrap gap-1'>
                      {tool.tags?.slice(0, 3).map((tag: string) => (
                        <span key={tag} className='px-2 py-0.5 bg-warm-100 text-warm-600 rounded text-xs'>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a
                      href={tool.website_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-1 text-sm text-terracotta hover:underline'
                    >
                      访问
                      <ExternalLink className='w-3 h-3' />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className='mt-12'>
          <Link
            href='/categories'
            className='inline-flex items-center gap-2 text-warm-500 hover:text-terracotta transition-colors'
          >
            <ArrowLeft className='w-4 h-4' />
            返回分类列表
          </Link>
        </div>
      </div>
    </main>
  );
}
