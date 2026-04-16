'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { Category } from '@/types/category';

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === 'new';

  const [form, setForm] = useState<Partial<Category>>({
    name: '',
    slug: '',
    icon: '',
    description: '',
    intro_markdown: '',
    sort_order: 0
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isNew && params.id) {
      fetch(`/api/admin/categories/${params.id}`, { credentials: 'include' })
        .then((res) => res.json())
        .then((result) => {
          if (result.code === 200) {
            setForm(result.data);
          }
          setLoading(false);
        });
    }
  }, [isNew, params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const url = isNew ? '/api/admin/categories' : `/api/admin/categories/${params.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include'
      });

      const result = await res.json();

      if (result.code === 200) {
        router.push('/admin/categories');
      } else {
        setError(result.error || '保存失败');
      }
    } catch (err) {
      setError('保存失败');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className='text-warm-400'>加载中...</div>;
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Link href='/admin/categories' className='p-2 text-warm-400 hover:text-warm-600 transition-colors'>
          <ArrowLeft className='w-5 h-5' />
        </Link>
        <div>
          <h1 className='text-2xl font-bold text-warm-900'>{isNew ? '添加分类' : '编辑分类'}</h1>
          <p className='text-warm-500 mt-1'>{isNew ? '创建新的工具分类' : '修改分类信息'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='bg-ivory rounded-xl border border-warm-200 p-6 space-y-6'>
        {error && <div className='p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg'>{error}</div>}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium text-warm-700 mb-2'>
              名称 <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className='w-full px-4 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50'
              placeholder='如：图像'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-warm-700 mb-2'>
              Slug <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className='w-full px-4 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50 font-mono'
              placeholder='如：image'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-warm-700 mb-2'>
              图标 <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className='w-full px-4 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50'
              placeholder='如：🖼️'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-warm-700 mb-2'>排序</label>
            <input
              type='number'
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
              className='w-full px-4 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50'
              placeholder='0'
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-warm-700 mb-2'>描述</label>
          <input
            type='text'
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className='w-full px-4 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50'
            placeholder='一句话介绍'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-warm-700 mb-2'>技术简介 (Markdown)</label>
          <textarea
            value={form.intro_markdown}
            onChange={(e) => setForm({ ...form, intro_markdown: e.target.value })}
            className='w-full px-4 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50 min-h-[200px]'
            placeholder='介绍这类 AI 的基本原理、技术发展历程、主要应用场景...'
          />
        </div>

        <div className='flex justify-end gap-4'>
          <Link href='/admin/categories' className='px-6 py-2 text-warm-600 hover:text-warm-800 transition-colors'>
            取消
          </Link>
          <button
            type='submit'
            disabled={saving}
            className='flex items-center gap-2 px-6 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors disabled:opacity-50'
          >
            <Save className='w-4 h-4' />
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  );
}
