'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, EyeOff, Upload, Image as ImageIcon } from 'lucide-react';
import { Article } from '@/types/article';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u4e00-\u9fa5]/g, (char) => {
      const map: Record<string, string> = {
        我: 'wo',
        你: 'ni',
        他: 'ta',
        她: 'ta',
        的: 'de',
        是: 'shi',
        在: 'zai',
        了: 'le',
        和: 'he',
        与: 'yu',
        或: 'huo',
        不: 'bu',
        这: 'zhe',
        那: 'na',
        有: 'you',
        来: 'lai',
        去: 'qu',
        到: 'dao',
        为: 'wei',
        之: 'zhi',
        于: 'yu',
        从: 'cong',
        而: 'er',
        以: 'yi',
        及: 'ji',
        等: 'deng',
        着: 'zhe',
        过: 'guo',
        也: 'ye',
        就: 'jiu',
        都: 'dou',
        要: 'yao',
        会: 'hui',
        可: 'ke',
        能: 'neng',
        将: 'jiang',
        被: 'bei',
        但: 'dan',
        却: 'que',
        又: 'you',
        更: 'geng',
        最: 'zui',
        还: 'hai',
        很: 'hen',
        把: 'ba',
        让: 'rang',
        做: 'zuo',
        想: 'xiang',
        看: 'kan',
        说: 'shuo',
        给: 'gei',
        用: 'yong',
        没: 'mei'
      };
      return map[char] || char;
    })
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === 'new';

  const [form, setForm] = useState<Partial<Article>>({
    title: '',
    slug: '',
    cover_image: '',
    excerpt: '',
    content_markdown: '',
    tags: [],
    status: 'draft',
    featured: false
  });
  const [slugManual, setSlugManual] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (!isNew && params.id) {
      fetch(`/api/admin/articles/${params.id}`, { credentials: 'include' })
        .then((res) => res.json())
        .then((result) => {
          if (result.code === 200) {
            setForm(result.data);
            setSlugManual(result.data.slug || '');
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
      const url = isNew ? '/api/admin/articles' : `/api/admin/articles/${params.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include'
      });

      const result = await res.json();

      if (result.code === 200) {
        router.push('/admin/articles');
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

  function handleTitleChange(value: string) {
    setForm({ ...form, title: value });
    // 自动从标题生成 slug（如果用户没有手动修改过）
    if (!slugManual) {
      setForm((prev) => ({ ...prev, slug: generateSlug(value) }));
    }
  }

  function handleSlugChange(value: string) {
    setSlugManual(value);
    setForm({ ...form, slug: value });
  }

  function handleRemoveTag(tag: string) {
    setForm({ ...form, tags: form.tags?.filter((t) => t !== tag) });
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const result = await res.json();

      if (result.code === 200) {
        setForm({ ...form, cover_image: result.url });
      } else {
        setUploadError(result.error || '上传失败');
      }
    } catch {
      setUploadError('上传失败，请重试');
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return <div className='text-warm-400'>加载中...</div>;
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Link href='/admin/articles' className='p-2 text-warm-400 hover:text-warm-600 transition-colors'>
          <ArrowLeft className='w-5 h-5' />
        </Link>
        <div>
          <h1 className='text-2xl font-bold text-warm-900'>{isNew ? '写文章' : '编辑文章'}</h1>
          <p className='text-warm-500 mt-1'>{isNew ? '创建新的博客文章' : '修改文章内容'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='bg-ivory rounded-xl border border-warm-200 p-6 space-y-6'>
        {error && <div className='p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg'>{error}</div>}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium text-warm-700 mb-2'>
              标题 <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className='w-full px-4 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50'
              placeholder='文章标题'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-warm-700 mb-2'>
              Slug <span className='text-red-500'>*</span>
              <span className='text-warm-400 font-normal ml-2'>（自动生成，可自定义）</span>
            </label>
            <input
              type='text'
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className='w-full px-4 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50 font-mono'
              placeholder='auto-generated-from-title'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-warm-700 mb-2'>封面图</label>
            {form.cover_image ? (
              <div className='relative group'>
                <div className='aspect-video w-full rounded-xl overflow-hidden border border-warm-200 bg-warm-100'>
                  <img src={form.cover_image} alt='封面预览' className='w-full h-full object-cover' />
                </div>
                <div className='absolute inset-0 bg-nearBlack/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 rounded-xl'>
                  <label className='cursor-pointer px-4 py-2 bg-white text-nearBlack rounded-lg hover:bg-warm-100 transition-colors'>
                    <span className='flex items-center gap-2'>
                      <Upload className='w-4 h-4' />
                      更换图片
                    </span>
                    <input
                      type='file'
                      accept='image/*'
                      className='sr-only'
                      onChange={handleCoverUpload}
                      disabled={uploading}
                    />
                  </label>
                  <Button type='button' variant='destructive' onClick={() => setForm({ ...form, cover_image: '' })}>
                    删除
                  </Button>
                </div>
                {uploading && (
                  <div className='absolute inset-0 bg-nearBlack/60 flex items-center justify-center rounded-xl'>
                    <div className='text-white'>上传中...</div>
                  </div>
                )}
              </div>
            ) : (
              <label className='flex flex-col items-center justify-center w-full h-48 border-2 border-warm-200 border-dashed rounded-xl cursor-pointer bg-warm-50/50 hover:bg-warm-100/50 transition-colors'>
                <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                  <div className='w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center mb-3'>
                    <ImageIcon className='w-6 h-6 text-terracotta' />
                  </div>
                  <p className='mb-2 text-sm text-warm-600'>
                    <span className='font-medium text-terracotta'>点击上传</span> 或拖拽图片到这里
                  </p>
                  <p className='text-xs text-warm-400'>支持 JPG、PNG、WebP，最大 5MB</p>
                </div>
                <input
                  type='file'
                  accept='image/*'
                  className='sr-only'
                  onChange={handleCoverUpload}
                  disabled={uploading}
                />
              </label>
            )}
            {uploadError && <p className='text-sm text-red-500 mt-2'>{uploadError}</p>}
            <div className='mt-3'>
              <Input
                type='url'
                value={form.cover_image}
                onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                placeholder='或粘贴图片 URL'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-warm-700 mb-2'>状态</label>
            <div className='flex gap-4'>
              <button
                type='button'
                onClick={() => setForm({ ...form, status: 'draft' })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  form.status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-warm-100 text-warm-500'
                }`}
              >
                <EyeOff className='w-4 h-4' />
                草稿
              </button>
              <button
                type='button'
                onClick={() => setForm({ ...form, status: 'published' })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  form.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-warm-100 text-warm-500'
                }`}
              >
                <Eye className='w-4 h-4' />
                已发布
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-warm-700 mb-2'>摘要</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className='w-full px-4 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50 min-h-[80px]'
            placeholder='文章摘要，用于列表页显示'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-warm-700 mb-2'>
            正文 (Markdown) <span className='text-red-500'>*</span>
          </label>
          <textarea
            value={form.content_markdown}
            onChange={(e) => setForm({ ...form, content_markdown: e.target.value })}
            className='w-full px-4 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/50 min-h-[300px] font-mono'
            placeholder='使用 Markdown 编写文章内容...'
            required
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
          <Link href='/admin/articles' className='px-6 py-2 text-warm-600 hover:text-warm-800 transition-colors'>
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
