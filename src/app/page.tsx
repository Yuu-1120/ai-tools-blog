'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Zap, Star, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/navbar';
import { useAuth } from '@/contexts/auth-context';
import dynamic from 'next/dynamic';
import ChatBot from '@/components/ChatBot';

const Antigravity = dynamic(() => import('@/components/Antigravity'), {
  ssr: false,
  loading: () => null
});

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user && mounted) {
      router.push('/auth/login');
    }
  }, [authLoading, user, mounted, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/home');
        const result = await res.json();
        if (result.code === 200 && result.data) {
          setCategories(result.data.categories || []);
          setTools(result.data.tools || []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      fetchData();
    }
  }, [user]);

  const ref = useRef(null);
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  if (!mounted || authLoading || loading) {
    return (
      <main className='min-h-screen bg-parchment'>
        <div
          className='fixed inset-0 -z-10'
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(201,100,66,0.06) 0%, rgba(217,119,87,0.03) 40%, transparent 70%)'
          }}
        />
        <div className='flex items-center justify-center min-h-screen'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta' />
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-parchment'>
      <motion.div className='fixed top-0 left-0 right-0 h-0.5 bg-terracotta/30 z-50'>
        <motion.div className='h-full bg-terracotta origin-left' style={{ width: progressWidth }} />
      </motion.div>
      <Navbar />
      {/* 背景 */}
      {/* 内容 */}
      <section ref={ref} className='relative min-h-screen flex items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 z-0 pointer-events-none'>
          {mounted && (
            <Antigravity
              count={300}
              magnetRadius={10}
              ringRadius={10}
              waveSpeed={0.4}
              waveAmplitude={1}
              particleSize={2}
              lerpSpeed={0.1}
              autoAnimate={false}
              color='#c96442'
              particleVariance={1}
              rotationSpeed={0}
              depthFactor={1}
              pulseSpeed={3}
              particleShape='capsule'
              fieldStrength={10}
            />
          )}
        </div>

        <motion.div style={{ opacity: 1 }} className='max-w-5xl mx-auto text-center relative z-10 px-4 pt-20'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ivory/80 backdrop-blur-sm border border-warm-200 shadow-sm text-sm font-medium text-warm-600 mb-12'
          >
            <Zap className='w-4 h-4 text-terracotta' />
            <span>发现最棒的 AI 工具</span>
          </motion.div>

          <motion.h1
            className='text-5xl md:text-6xl lg:text-7xl font-serif font-medium tracking-tight mb-10 leading-tight'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className='text-warm-900 block mb-2'>AI Tools</span>
            <span className='text-terracotta block'>Blog</span>
          </motion.h1>

          <motion.div
            className='space-y-2 mb-14'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <p className='text-lg md:text-xl text-warm-600 max-w-2xl mx-auto leading-relaxed'>
              按用途分类的 <span className='text-warm-900 font-medium'>AI 工具百科</span>
            </p>
            <p className='text-lg md:text-xl text-warm-600 max-w-2xl mx-auto leading-relaxed'>
              图像 · 视频 · 对话 · 编程 · 设计 · 音频 · 写作 · Agent
            </p>
          </motion.div>

          <motion.div
            className='flex flex-col sm:flex-row gap-4 justify-center items-center'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Link href='/categories'>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className='px-8 py-3 bg-terracotta text-ivory rounded-lg font-medium hover:bg-coral transition-colors inline-flex items-center gap-3'
              >
                浏览分类
                <ArrowRight className='w-5 h-5' />
              </motion.button>
            </Link>
            <Link href='/articles'>
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: '#e8e6dc' }}
                whileTap={{ scale: 0.98 }}
                className='px-8 py-3 bg-ivory text-warm-700 rounded-lg font-medium hover:bg-warm-100 transition-colors inline-flex items-center gap-3 border border-warm-200'
              >
                阅读文章
                <Sparkles className='w-5 h-5' />
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            className='mt-16 flex items-center justify-center gap-10 text-warm-500'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className='flex items-center gap-2'>
              <Star className='w-4 h-4 text-terracotta fill-terracotta' />
              <span className='text-sm font-medium'>{categories.length} 个分类</span>
            </div>
            <div className='flex items-center gap-2'>
              <Sparkles className='w-4 h-4 text-coral' />
              <span className='text-sm font-medium'>{tools.length} 个工具</span>
            </div>
          </motion.div>
        </motion.div>
      </section>
      {/* 分类 */}
      <section className='py-24 px-4 bg-ivory'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-16'>
            <span className='text-sm font-medium text-terracotta tracking-widest uppercase'>8 大分类</span>
            <h2 className='text-4xl md:text-5xl font-serif font-medium text-warm-900 mt-4 mb-4'>按用途探索</h2>
            <p className='text-warm-500 max-w-xl mx-auto'>从图像到 Agent，找到最适合你的 AI 工具</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link href={`/categories/${category.slug}`}>
                  <div className='group relative h-full min-h-[180px] p-6 bg-parchment rounded-xl border border-warm-200 hover:border-terracotta/30 hover:shadow-lg transition-all cursor-pointer'>
                    <div className='text-4xl mb-4'>{category.icon}</div>
                    <h3 className='text-lg font-medium text-warm-900 mb-2 group-hover:text-terracotta transition-colors'>
                      {category.name}
                    </h3>
                    <p className='text-sm text-warm-500 line-clamp-2'>{category.description}</p>
                    <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity'>
                      <ArrowRight className='w-5 h-5 text-terracotta' />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* 预选工具 */}
      <section className='py-24 px-4 '>
        <div className='max-w-6xl mx-auto'>
          <div className='flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4'>
            <div>
              <span className='text-sm font-medium text-terracotta tracking-widest uppercase'>精选工具</span>
              <h2 className='text-4xl md:text-5xl font-serif font-medium text-warm-900 mt-4'>热门 AI 产品</h2>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {tools.slice(0, 6).map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <div className='group p-6 bg-parchment rounded-xl border border-warm-200 hover:shadow-lg hover:-translate-y-0.5 transition-all h-full flex flex-col bg-ivory'>
                  <div className='flex items-start justify-between mb-4'>
                    <div className='w-12 h-12 rounded-lg bg-gradient-to-br from-terracotta to-coral flex items-center justify-center text-lg font-bold text-ivory'>
                      {tool.name.charAt(0)}
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        tool.pricing === 'free'
                          ? 'bg-green-100 text-green-700'
                          : tool.pricing === 'freemium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {tool.pricing === 'free' ? '免费' : tool.pricing === 'freemium' ? '免费+' : '付费'}
                    </span>
                  </div>

                  <h3 className='text-lg font-medium text-warm-900 mb-2 group-hover:text-terracotta transition-colors'>
                    {tool.name}
                  </h3>
                  <p className='text-warm-500 text-sm mb-4 line-clamp-2 flex-grow'>{tool.description}</p>

                  <div className='flex items-center justify-between mt-auto pt-4 border-t border-warm-100'>
                    <span className='text-sm text-warm-400'>{tool.category?.name}</span>
                    <a
                      href={tool.website_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-1 text-sm text-terracotta hover:underline'
                    >
                      访问
                      <ExternalLink className='w-3 h-3' />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {tools.length > 6 && (
            <div className='mt-12 text-center'>
              <Link href='/tools'>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className='px-8 py-3 bg-terracotta text-ivory rounded-lg font-medium hover:bg-coral transition-colors inline-flex items-center gap-3'
                >
                  查看全部 {tools.length} 个工具
                  <ArrowRight className='w-5 h-5' />
                </motion.button>
              </Link>
            </div>
          )}
        </div>
      </section>
      {/* footer */}
      <section className='py-8 px-4  bg-ivory'>
        <div className='max-w-6xl mx-auto text-center'>
          <p className='text-warm-500'>© 2026 AI Tools Blog · 仅供学习交流使用</p>
        </div>
      </section>
      {/* 聊天机器人 */}
      <ChatBot />
    </main>
  );
}
