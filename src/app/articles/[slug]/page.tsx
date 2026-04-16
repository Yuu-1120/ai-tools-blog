'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Tag, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/navbar';

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`/api/articles/${slug}`);
        const result = await res.json();
        if (result.code === 200) {
          setArticle(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch article:', error);
      } finally {
        setLoading(false);
      }
    }
    if (user && slug) {
      fetchArticle();
    }
  }, [user, slug]);

  if (!user || loading || authLoading) {
    return (
      <div className='min-h-screen bg-parchment flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta' />
      </div>
    );
  }

  if (!article) {
    return (
      <div className='min-h-screen bg-parchment flex flex-col items-center justify-center'>
        <p className='text-warm-500 mb-4'>文章不存在</p>
        <Link href='/articles' className='text-terracotta hover:underline'>
          返回文章列表
        </Link>
      </div>
    );
  }

  return (
    <main className='min-h-screen bg-parchment'>
      <Navbar />

      <article className='max-w-3xl mx-auto px-4 pt-24 pb-16'>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className='flex items-center gap-2 text-sm text-warm-500 mb-6'>
            <Link href='/' className='hover:text-terracotta'>
              首页
            </Link>
            <span>/</span>
            <Link href='/articles' className='hover:text-terracotta'>
              文章
            </Link>
            <span>/</span>
            <span className='line-clamp-1'>{article.title}</span>
          </div>

          {article.cover_image && (
            <div className='mb-8 rounded-xl overflow-hidden'>
              <img src={article.cover_image} alt={article.title} className='w-full h-64 md:h-96 object-cover' />
            </div>
          )}

          <h1 className='text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-warm-900 mb-6'>
            {article.title}
          </h1>

          <div className='flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-warm-200'>
            <div className='flex items-center gap-2 text-sm text-warm-400'>
              <Calendar className='w-4 h-4' />
              {new Date(article.created_at).toLocaleDateString('zh-CN')}
            </div>
            {article.author?.profiles?.email && (
              <div className='flex items-center gap-2 text-sm text-warm-400'>
                <User className='w-4 h-4' />
                {article.author.profiles.email}
              </div>
            )}
            {article.tags?.map((tag: string) => (
              <span
                key={tag}
                className='flex items-center gap-1 px-2 py-1 bg-terracotta/10 text-terracotta rounded text-xs'
              >
                <Tag className='w-3 h-3' />
                {tag}
              </span>
            ))}
          </div>

          <div className='prose prose-stone max-w-none text-warm-700'>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content_markdown}</ReactMarkdown>
          </div>

          <div className='mt-16 pt-8 border-t border-warm-200'>
            <Link
              href='/articles'
              className='inline-flex items-center gap-2 text-warm-500 hover:text-terracotta transition-colors'
            >
              <ArrowLeft className='w-4 h-4' />
              返回文章列表
            </Link>
          </div>
        </motion.div>
      </article>
    </main>
  );
}
