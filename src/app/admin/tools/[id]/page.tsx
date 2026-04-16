'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { Tool } from '@/types/tool';
import { Category } from '@/types/category';

export default function EditToolPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === 'new';

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Partial<Tool>>({
    category_id: '',
    name: '',
    logo_url: '',
    description: '',
    website_url: '',
    pricing: 'free',
    tags: [],
    sort_order: 0
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/categories', { credentials: 'include' })
      .then((res) => res.json())
      .then((result) => {
        if (result.code === 200) {
          setCategories(result.data);
        }
      });

    if (!isNew && params.id) {
      fetch(`/api/admin/tools/${params.id}`, { credentials: 'include' })
        .then((res) => res.json())
        .then((result) => {
          if (result.code === 200) {
            setForm(result.data);
          }
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [isNew, params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const url = isNew ? '/api/admin/tools' : `/api/admin/tools/${params.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include'
      });

      const result = await res.json();

      if (result.code === 200) {
        router.push('/admin/tools');
      } else {
        setError(result.error || '保存失败');
      }
    } catch (err) {
      setError('保存失败');
    } finally {
      setSaving(false);
    }
  }

  function handleAddTag() {
    if (tagInput.trim() && !form.tags?.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...(form.tags || []), tagInput.trim()] });
      setTagInput('');
    }
  }

  function handleRemoveTag(tag: string) {
    setForm({ ...form, tags: form.tags?.filter((t) => t !== tag) });
  }

  if (loading) {
    return <div className='text-warm-400'>加载中...</div>;
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Link href='/admin/tools' className='p-2 text-warm-400 hover:text-warm-600 transition-colors'>
          <ArrowLeft className='w-5 h-5' />
        </Link>
        <div>
          <h1 className='text-2xl font-bold text-warm-900'>{isNew ? '添加工具' : '编辑工具'}</h1>
          <p className='text-warm-500 mt-1'>{isNew ? '添加新的 AI 工具' : '修改工具信息'}</p>
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
              placeholder='如：Midjourney'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-warm-700 mb-2'>
              分类 <span className='text-red-500'>*</span>
            </label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className='w-full px-4 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50'
              required
            >
              <option value=''>选择分类</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-warm-700 mb-2'>
              官网链接 <span className='text-red-500'>*</span>
            </label>
            <input
              type='url'
              value={form.website_url}
              onChange={(e) => setForm({ ...form, website_url: e.target.value })}
              className='w-full px-4 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50'
              placeholder='https://...'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-warm-700 mb-2'>Logo URL</label>
            <input
              type='url'
              value={form.logo_url}
              onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
              className='w-full px-4 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50'
              placeholder='https://...'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-warm-700 mb-2'>定价</label>
            <select
              value={form.pricing}
              onChange={(e) => setForm({ ...form, pricing: e.target.value as any })}
              className='w-full px-4 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50'
            >
              <option value='free'>免费</option>
              <option value='freemium'>免费+付费</option>
              <option value='paid'>付费</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-warm-700 mb-2'>排序</label>
            <input
              type='number'
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
              className='w-full px-4 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50'
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-warm-700 mb-2'>简介</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className='w-full px-4 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50 min-h-[100px]'
            placeholder='一句话介绍这个工具'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-warm-700 mb-2'>标签</label>
          <div className='flex gap-2 mb-2'>
            <input
              type='text'
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className='flex-1 px-4 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50'
              placeholder='输入标签后按回车添加'
            />
            <button
              type='button'
              onClick={handleAddTag}
              className='px-4 py-2 bg-warm-100 text-warm-600 rounded-lg hover:bg-warm-200 transition-colors'
            >
              添加
            </button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {form.tags?.map((tag) => (
              <span
                key={tag}
                className='px-3 py-1 bg-terracotta/10 text-terracotta rounded-full text-sm flex items-center gap-1'
              >
                {tag}
                <button type='button' onClick={() => handleRemoveTag(tag)} className='hover:text-red-500'>
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className='flex justify-end gap-4'>
          <Link href='/admin/tools' className='px-6 py-2 text-warm-600 hover:text-warm-800 transition-colors'>
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
