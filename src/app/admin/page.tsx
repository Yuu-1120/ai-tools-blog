'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FolderOpen, Wrench, FileText, TrendingUp, Clock } from 'lucide-react';

interface Stats {
  categories: number;
  tools: number;
  articles: number;
  publishedArticles: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    categories: 0,
    tools: 0,
    articles: 0,
    publishedArticles: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [catRes, toolsRes, articlesRes] = await Promise.all([
          fetch('/api/admin/categories', { credentials: 'include' }),
          fetch('/api/admin/tools', { credentials: 'include' }),
          fetch('/api/admin/articles', { credentials: 'include' }),
        ]);

        const [catData, toolsData, articlesData] = await Promise.all([
          catRes.json(),
          toolsRes.json(),
          articlesRes.json(),
        ]);

        const publishedCount = articlesData.data?.filter(
          (a: { status: string }) => a.status === 'published'
        ).length || 0;

        setStats({
          categories: catData.data?.length || 0,
          tools: toolsData.data?.length || 0,
          articles: articlesData.data?.length || 0,
          publishedArticles: publishedCount,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      label: '分类',
      value: stats.categories,
      icon: FolderOpen,
      href: '/admin/categories',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: '工具',
      value: stats.tools,
      icon: Wrench,
      href: '/admin/tools',
      color: 'bg-green-50 text-green-600',
    },
    {
      label: '文章',
      value: stats.articles,
      icon: FileText,
      href: '/admin/articles',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: '已发布',
      value: stats.publishedArticles,
      icon: TrendingUp,
      href: '/admin/articles?status=published',
      color: 'bg-orange-50 text-orange-600',
    },
  ];

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-2xl font-bold text-warm-900'>仪表盘</h1>
        <p className='text-warm-500 mt-1'>欢迎回来！这里是网站概览。</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className='bg-ivory rounded-xl p-6 border border-warm-200 hover:shadow-md transition-shadow'
          >
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-warm-500 text-sm'>{card.label}</p>
                <p className='text-3xl font-bold text-warm-900 mt-1'>
                  {loading ? '-' : card.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className='w-6 h-6' />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className='bg-ivory rounded-xl p-6 border border-warm-200'>
        <h2 className='text-lg font-bold text-warm-900 mb-4'>快速操作</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Link
            href='/admin/categories/new'
            className='flex items-center gap-3 p-4 rounded-lg bg-warm-50 hover:bg-warm-100 transition-colors'
          >
            <FolderOpen className='w-5 h-5 text-terracotta' />
            <span className='text-warm-700'>添加分类</span>
          </Link>
          <Link
            href='/admin/tools/new'
            className='flex items-center gap-3 p-4 rounded-lg bg-warm-50 hover:bg-warm-100 transition-colors'
          >
            <Wrench className='w-5 h-5 text-terracotta' />
            <span className='text-warm-700'>添加工具</span>
          </Link>
          <Link
            href='/admin/articles/new'
            className='flex items-center gap-3 p-4 rounded-lg bg-warm-50 hover:bg-warm-100 transition-colors'
          >
            <FileText className='w-5 h-5 text-terracotta' />
            <span className='text-warm-700'>写文章</span>
          </Link>
        </div>
      </div>

      <div className='bg-ivory rounded-xl p-6 border border-warm-200'>
        <div className='flex items-center gap-2 mb-4'>
          <Clock className='w-5 h-5 text-warm-400' />
          <h2 className='text-lg font-bold text-warm-900'>最近活动</h2>
        </div>
        <p className='text-warm-500 text-sm'>
          暂无最近活动记录。
        </p>
      </div>
    </div>
  );
}
