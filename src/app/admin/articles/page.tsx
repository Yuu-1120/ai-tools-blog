'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Article } from '@/types/article';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchArticles() {
    const res = await fetch('/api/admin/articles', { credentials: 'include' });
    const result = await res.json();
    if (result.code === 200) {
      setArticles(result.data);
    }
  }

  useEffect(() => {
    fetchArticles();
    setLoading(false);
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('确定要删除这篇文章吗？')) return;

    setDeletingId(id);
    const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE', credentials: 'include' });
    const result = await res.json();

    if (result.code === 200) {
      setArticles(articles.filter((a) => a.id !== id));
    } else {
      alert(result.error || '删除失败');
    }
    setDeletingId(null);
  }

  async function handleToggleStatus(article: Article) {
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    const res = await fetch(`/api/admin/articles/${article.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
      credentials: 'include'
    });
    const result = await res.json();

    if (result.code === 200) {
      setArticles(articles.map((a) => (a.id === article.id ? { ...a, status: newStatus } : a)));
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-warm-900'>文章管理</h1>
          <p className='text-warm-500 mt-1'>管理所有博客文章</p>
        </div>
        <Link
          href='/admin/articles/new'
          className='flex items-center gap-2 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors'
        >
          <Plus className='w-4 h-4' />
          写文章
        </Link>
      </div>

      <div className='bg-ivory rounded-xl border border-warm-200 overflow-hidden'>
        <table className='w-full'>
          <thead className='bg-warm-50 border-b border-warm-200'>
            <tr>
              <th className='text-left px-6 py-4 text-sm font-medium text-warm-600'>标题</th>
              <th className='text-left px-6 py-4 text-sm font-medium text-warm-600'>状态</th>
              <th className='text-left px-6 py-4 text-sm font-medium text-warm-600'>标签</th>
              <th className='text-left px-6 py-4 text-sm font-medium text-warm-600'>日期</th>
              <th className='text-right px-6 py-4 text-sm font-medium text-warm-600'>操作</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-warm-100'>
            {loading ? (
              <tr>
                <td colSpan={5} className='px-6 py-8 text-center text-warm-400'>
                  加载中...
                </td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={5} className='px-6 py-8 text-center text-warm-400'>
                  暂无文章，点击按钮开始写作
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} className='hover:bg-warm-50 transition-colors'>
                  <td className='px-6 py-4'>
                    <p className='font-medium text-warm-900 line-clamp-1 max-w-xs'>{article.title}</p>
                    <p className='text-sm text-warm-400 line-clamp-1 max-w-xs'>{article.excerpt}</p>
                  </td>
                  <td className='px-6 py-4'>
                    <button
                      onClick={() => handleToggleStatus(article)}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        article.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {article.status === 'published' ? '已发布' : '草稿'}
                    </button>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex flex-wrap gap-1'>
                      {article.tags?.slice(0, 2).map((tag) => (
                        <span key={tag} className='px-2 py-0.5 bg-warm-100 text-warm-600 rounded text-xs'>
                          {tag}
                        </span>
                      ))}
                      {article.tags && article.tags.length > 2 && (
                        <span className='text-xs text-warm-400'>+{article.tags.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className='px-6 py-4 text-warm-500 text-sm'>
                    {new Date(article.created_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center justify-end gap-2'>
                      <button
                        onClick={() => handleToggleStatus(article)}
                        className='p-2 text-warm-400 hover:text-terracotta transition-colors'
                        title={article.status === 'published' ? '设为草稿' : '发布'}
                      >
                        {article.status === 'published' ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                      </button>
                      <Link
                        href={`/admin/articles/${article.id}`}
                        className='p-2 text-warm-400 hover:text-terracotta transition-colors'
                      >
                        <Edit className='w-4 h-4' />
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        disabled={deletingId === article.id}
                        className='p-2 text-warm-400 hover:text-red-500 transition-colors disabled:opacity-50'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
