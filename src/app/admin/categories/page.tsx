'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Category } from '@/types/category';
import { Plus, Edit, Trash2, ArrowUpDown } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchCategories() {
    const res = await fetch('/api/admin/categories', { credentials: 'include' });
    const result = await res.json();
    if (result.code === 200) {
      setCategories(result.data);
    }
  }

  useEffect(() => {
    fetchCategories();
    setLoading(false);
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('确定要删除这个分类吗？')) return;

    setDeletingId(id);
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE', credentials: 'include' });
    const result = await res.json();

    if (result.code === 200) {
      setCategories(categories.filter((c) => c.id !== id));
    } else {
      alert(result.error || '删除失败');
    }
    setDeletingId(null);
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-warm-900'>分类管理</h1>
          <p className='text-warm-500 mt-1'>管理 AI 工具的分类</p>
        </div>
        <Link
          href='/admin/categories/new'
          className='flex items-center gap-2 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors'
        >
          <Plus className='w-4 h-4' />
          添加分类
        </Link>
      </div>

      <div className='bg-ivory rounded-xl border border-warm-200 overflow-hidden'>
        <table className='w-full'>
          <thead className='bg-warm-50 border-b border-warm-200'>
            <tr>
              <th className='text-left px-6 py-4 text-sm font-medium text-warm-600'>排序</th>
              <th className='text-left px-6 py-4 text-sm font-medium text-warm-600'>图标</th>
              <th className='text-left px-6 py-4 text-sm font-medium text-warm-600'>名称</th>
              <th className='text-left px-6 py-4 text-sm font-medium text-warm-600'>Slug</th>
              <th className='text-left px-6 py-4 text-sm font-medium text-warm-600'>描述</th>
              <th className='text-right px-6 py-4 text-sm font-medium text-warm-600'>操作</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-warm-100'>
            {loading ? (
              <tr>
                <td colSpan={6} className='px-6 py-8 text-center text-warm-400'>
                  加载中...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={6} className='px-6 py-8 text-center text-warm-400'>
                  暂无分类，点击添加按钮创建
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className='hover:bg-warm-50 transition-colors'>
                  <td className='px-6 py-4 text-warm-600'>{category.sort_order}</td>
                  <td className='px-6 py-4 text-2xl'>{category.icon}</td>
                  <td className='px-6 py-4 font-medium text-warm-900'>{category.name}</td>
                  <td className='px-6 py-4 text-warm-500 font-mono text-sm'>{category.slug}</td>
                  <td className='px-6 py-4 text-warm-500 text-sm max-w-xs truncate'>{category.description}</td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center justify-end gap-2'>
                      <Link
                        href={`/admin/categories/${category.id}`}
                        className='p-2 text-warm-400 hover:text-terracotta transition-colors'
                      >
                        <Edit className='w-4 h-4' />
                      </Link>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={deletingId === category.id}
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
