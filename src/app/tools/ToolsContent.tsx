'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/ui/navbar';
import { useAuth } from '@/contexts/auth-context';
import { Sparkles, Code, Palette, TestTube, Layers, Bot, Zap, Search, ExternalLink } from 'lucide-react';

const categoryConfig = [
  { name: '全部', icon: Sparkles, slug: 'all', color: 'from-stone-gray to-olive-gray', bgColor: 'bg-warmSand' },
  { name: '图像', icon: Palette, slug: 'image', color: 'from-pink-500 to-rose-600', bgColor: 'bg-pink-50' },
  { name: '视频', icon: Sparkles, slug: 'video', color: 'from-violet-500 to-purple-600', bgColor: 'bg-violet-50' },
  { name: '对话', icon: Bot, slug: 'chat', color: 'from-blue-500 to-cyan-600', bgColor: 'bg-blue-50' },
  { name: '编程', icon: Code, slug: 'code', color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-50' },
  { name: '设计', icon: Layers, slug: 'design', color: 'from-amber-500 to-orange-600', bgColor: 'bg-amber-50' },
  { name: '音频', icon: Zap, slug: 'audio', color: 'from-indigo-500 to-violet-600', bgColor: 'bg-indigo-50' },
  { name: '写作', icon: TestTube, slug: 'writing', color: 'from-rose-500 to-pink-600', bgColor: 'bg-rose-50' },
  { name: 'Agent', icon: Bot, slug: 'agent', color: 'from-cyan-500 to-blue-600', bgColor: 'bg-cyan-50' }
];

interface Tool {
  id: string;
  name: string;
  logo_url: string | null;
  description: string;
  website_url: string;
  pricing: string;
  category_id: string;
  tags: string[];
  featured: boolean;
  users?: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function ToolsContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const categorySlug = searchParams.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(categorySlug);
  const [searchQuery, setSearchQuery] = useState('');
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<{ id: string; slug: string }[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveCategory(categorySlug);
  }, [categorySlug]);

  useEffect(() => {
    async function fetchTools() {
      const res = await fetch('/api/home');
      const result = await res.json();
      if (result.code === 200) {
        const cleanTools = (result.data?.tools || []).map((t: Tool) => ({
          ...t,
          logo_url: t.logo_url?.trim() || null,
          website_url: t.website_url?.trim() || ''
        }));
        setTools(cleanTools);
        setCategories(result.data?.categories || []);
      }
      setLoading(false);
    }
    fetchTools();
  }, []);

  useEffect(() => {
    let result = tools;

    if (activeCategory !== 'all') {
      const cat = categories.find((c) => c.slug === activeCategory);
      if (cat) {
        result = result.filter((tool) => tool.category_id === cat.id);
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    setFilteredTools(result);
  }, [activeCategory, searchQuery, tools, categories]);

  return (
    <main className='min-h-screen bg-parchment'>
      <div
        className='fixed inset-0 -z-10'
        style={{ background: 'radial-gradient(circle at 50% 30%, rgba(201,100,66,0.05) 0%, transparent 60%)' }}
      />

      <Navbar />

      <section className='relative py-20 px-4 overflow-hidden'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='max-w-6xl mx-auto text-center'
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ivory border border-border-cream text-sm font-medium text-olive-gray mb-6'
          >
            <Zap className='w-4 h-4 text-terracotta' />
            <span>AI Tools Collection</span>
          </motion.div>

          <h1 className='text-4xl md:text-6xl font-serif font-medium text-nearBlack mb-4'>
            <span className='text-terracotta'>AI</span> 工具库
          </h1>

          <p className='text-lg text-olive-gray max-w-2xl mx-auto mb-10'>发现并探索产品落地各阶段的最佳 AI 工具</p>

          <div className='max-w-xl mx-auto relative'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-gray' />
            <input
              type='text'
              placeholder='搜索工具名称、功能或标签...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-12 pr-4 py-4 rounded-full bg-ivory border border-border-cream focus-visible:border-terracotta focus-visible:outline-none outline-none transition-all'
            />
          </div>
        </motion.div>
      </section>

      <section className='py-8 px-4'>
        <div className='max-w-6xl mx-auto'>
          <motion.div
            className='flex flex-wrap gap-3 justify-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {categoryConfig.map((category) => (
              <motion.button
                key={category.slug}
                onClick={() => setActiveCategory(category.slug)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                  activeCategory === category.slug
                    ? 'bg-nearBlack text-ivory shadow-lg'
                    : 'bg-ivory text-olive-gray border border-border-cream hover:border-border-warm'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <category.icon className='w-4 h-4' />
                {category.name}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      <section className='py-12 px-4 pb-24'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex items-center justify-between mb-8'>
            <p className='text-olive-gray'>
              共 <span className='font-medium text-nearBlack'>{filteredTools.length}</span> 个工具
              {activeCategory !== 'all' && (
                <span className='ml-2'>（{categoryConfig.find((c) => c.slug === activeCategory)?.name}）</span>
              )}
            </p>
          </div>

          {loading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className='bg-ivory rounded-xl border border-border-cream p-6 animate-pulse'>
                  <div className='flex items-center gap-4 mb-5'>
                    <div className='w-14 h-14 bg-warm-200 rounded-lg' />
                    <div>
                      <div className='h-5 w-24 bg-warm-200 rounded mb-2' />
                      <div className='h-4 w-16 bg-warm-200 rounded' />
                    </div>
                  </div>
                  <div className='h-4 bg-warm-200 rounded mb-3' />
                  <div className='h-4 bg-warm-200 rounded w-3/4' />
                </div>
              ))}
            </div>
          ) : filteredTools.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-center py-20'>
              <div className='w-20 h-20 mx-auto mb-6 rounded-full bg-warmSand flex items-center justify-center'>
                <Search className='w-10 h-10 text-stone-gray' />
              </div>
              <h3 className='text-xl font-serif font-medium text-nearBlack mb-2'>未找到相关工具</h3>
              <p className='text-olive-gray'>试试其他关键词或分类</p>
            </motion.div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  className='group relative bg-ivory rounded-xl border border-border-cream hover:shadow-whisper transition-all duration-300 overflow-hidden'
                >
                  <div className='p-6'>
                    <div className='flex items-start justify-between mb-5'>
                      <div className='flex items-center gap-4'>
                        {tool.logo_url ? (
                          <img
                            src={tool.logo_url}
                            alt={tool.name}
                            className='w-14 h-14 rounded-lg object-contain bg-white border border-border-cream'
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-14 h-14 rounded-lg flex items-center justify-center text-xl font-serif font-medium text-ivory ${tool.logo_url ? 'hidden' : ''}`}
                          style={{ backgroundColor: '#c96442' }}
                        >
                          {tool.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className='text-lg font-serif font-medium text-nearBlack'>{tool.name}</h3>
                          <span className='text-sm text-stone-gray'>{tool.pricing}</span>
                        </div>
                      </div>
                      {tool.featured && (
                        <span className='px-2 py-1 rounded-full bg-warmSand text-terracotta text-xs font-medium'>
                          热门
                        </span>
                      )}
                    </div>

                    <p className='text-olive-gray text-sm mb-5 line-clamp-2'>{tool.description}</p>

                    <div className='flex flex-wrap gap-2 mb-5'>
                      {tool.tags.map((tag) => (
                        <span key={tag} className='px-2 py-1 rounded-full bg-warmSand text-charcoalWarm text-xs'>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className='flex items-center justify-between pt-4 border-t border-border-cream'>
                      <span className='text-sm text-stone-gray'>{tool.pricing}</span>
                      <a
                        href={tool.website_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='p-2 rounded-full hover:bg-warmSand transition-colors'
                      >
                        <ExternalLink className='w-4 h-4 text-stone-gray' />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className='py-12 px-4 border-t border-border-cream'>
        <div className='max-w-6xl mx-auto text-center'>
          <p className='text-stone-gray'>© 2026 AI Tools Blog · 产品落地全流程 AI 工具分享</p>
        </div>
      </footer>
    </main>
  );
}
