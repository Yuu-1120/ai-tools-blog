'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tool } from '@/types/tool';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchTools() {
    const res = await fetch('/api/admin/tools', { credentials: 'include' });
    const result = await res.json();
    if (result.code === 200) {
      setTools(result.data);
    }
  }

  useEffect(() => {
    fetchTools();
    setLoading(false);
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('确定要删除这个工具吗？')) return;

    setDeletingId(id);
    const res = await fetch(`/api/admin/tools/${id}`, { method: 'DELETE', credentials: 'include' });
    const result = await res.json();

    if (result.code === 200) {
      setTools(tools.filter((t) => t.id !== id));
    } else {
      alert(result.error || '删除失败');
    }
    setDeletingId(null);
  }

  const pricingColors: Record<string, string> = {
    free: 'bg-green-100 text-green-700',
    freemium: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-red-100 text-red-700'
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-warm-900'>工具管理</h1>
          <p className='text-warm-500 mt-1'>管理所有 AI 工具</p>
        </div>
        <Link
          href='/admin/tools/new'
          className='flex items-center gap-2 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors'
        >
          <Plus className='w-4 h-4' />
          添加工具
        </Link>
      </div>

      <div className='bg-ivory rounded-xl border border-warm-200 overflow-hidden'>
        <table className='w-full'>
          <thead className='bg-warm-50 border-b border-warm-200'>
            <tr>
              <th className='text-left px-6 py-4 text-sm font-medium text-warm-600'>工具</th>
              <th className='text-left px-6 py-4 text-sm font-medium text-warm-600'>分类</th>
              <th className='text-left px-6 py-4 text-sm font-medium text-warm-600'>简介</th>
              <th className='text-left px-6 py-4 text-sm font-medium text-warm-600'>定价</th>
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
            ) : tools.length === 0 ? (
              <tr>
                <td colSpan={5} className='px-6 py-8 text-center text-warm-400'>
                  暂无工具，点击添加按钮创建
                </td>
              </tr>
            ) : (
              tools.map((tool) => (
                <tr key={tool.id} className='hover:bg-warm-50 transition-colors'>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                      {tool.logo_url ? (
                        <img src={tool.logo_url} alt={tool.name} className='w-10 h-10 rounded-lg object-cover' />
                      ) : (
                        <div className='w-10 h-10 rounded-lg bg-warm-100 flex items-center justify-center text-warm-400'>
                          {tool.name[0]}
                        </div>
                      )}
                      <div>
                        <p className='font-medium text-warm-900'>{tool.name}</p>
                        <a
                          href={tool.website_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-xs text-terracotta hover:underline flex items-center gap-1'
                        >
                          <ExternalLink className='w-3 h-3' />
                          官网
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 text-warm-600'>{(tool as any).category?.name || '-'}</td>
                  <td className='px-6 py-4 text-warm-500 text-sm max-w-xs truncate'>{tool.description}</td>
                  <td className='px-6 py-4'>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        pricingColors[tool.pricing] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tool.pricing === 'free' ? '免费' : tool.pricing === 'freemium' ? '免费+付费' : '付费'}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center justify-end gap-2'>
                      <Link
                        href={`/admin/tools/${tool.id}`}
                        className='p-2 text-warm-400 hover:text-terracotta transition-colors'
                      >
                        <Edit className='w-4 h-4' />
                      </Link>
                      <button
                        onClick={() => handleDelete(tool.id)}
                        disabled={deletingId === tool.id}
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
