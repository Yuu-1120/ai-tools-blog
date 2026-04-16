'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/navbar';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch('/api/articles');
        const result = await res.json();
        if (result.code === 200) {
          setArticles(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      fetchArticles();
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

      <div className='max-w-4xl mx-auto px-4 pt-24 pb-16'>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='mb-12'>
          <div className='flex items-center gap-2 text-sm text-warm-500 mb-4'>
            <Link href='/' className='hover:text-terracotta'>
              首页
            </Link>
            <span>/</span>
            <span>文章</span>
          </div>
          <h1 className='text-4xl md:text-5xl font-serif font-medium text-warm-900 mb-4'>文章</h1>
          <p className='text-warm-600 text-lg'>AI 领域的思考与分享</p>
        </motion.div>

        {articles.length === 0 ? (
          <div className='text-center py-16'>
            <p className='text-warm-500'>暂无文章</p>
          </div>
        ) : (
          <div className='space-y-8'>
            {articles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Link href={`/articles/${article.slug}`}>
                  <div className='group p-6 bg-ivory rounded-xl border border-warm-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer'>
                    {article.cover_image && (
                      <div className='mb-4 rounded-lg overflow-hidden'>
                        <img
                          src={article.cover_image}
                          alt={article.title}
                          className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'
                        />
                      </div>
                    )}
                    <div className='flex items-center gap-4 mb-3'>
                      <div className='flex items-center gap-2 text-sm text-warm-400'>
                        <Calendar className='w-4 h-4' />
                        {new Date(article.created_at).toLocaleDateString('zh-CN')}
                      </div>
                      {article.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className='px-2 py-0.5 bg-terracotta/10 text-terracotta rounded text-xs'>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className='text-2xl font-serif font-medium text-warm-900 mb-2 group-hover:text-terracotta transition-colors'>
                      {article.title}
                    </h2>
                    <p className='text-warm-500 line-clamp-2'>{article.excerpt}</p>
                    <div className='flex items-center gap-2 mt-4 text-terracotta'>
                      <span className='text-sm font-medium'>阅读更多</span>
                      <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
