'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useRef, useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  Code,
  Palette,
  TestTube,
  Layers,
  Bot,
  Zap,
  TrendingUp,
  Star,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { HomeData } from '@/types/home';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/auth-context';
import { User } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Code,
  Palette,
  TestTube,
  Layers,
  Bot
};

export default function Home() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const res = await fetch('/api/home');
        const result = await res.json();
        if (result.code === 200 && result.data) {
          setHomeData(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeData();
  }, []);

  const ref = useRef(null);
  const { scrollYProgress } = useScroll();
  const headerScroll = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const y = useTransform(headerScroll.scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(headerScroll.scrollYProgress, [0, 0.5], [1, 0]);

  if (loading) {
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

  const categories = homeData?.categories || [];
  const featuredTools = homeData?.featuredTools || [];
  const processSteps = homeData?.processSteps || [];

  return (
    <main className='min-h-screen bg-parchment'>
      {mounted && (
        <motion.div
          className='fixed top-0 left-0 right-0 h-0.5 bg-terracotta z-50 origin-left'
          style={{ scaleX: scrollYProgress }}
        />
      )}

      <div className='fixed top-6 right-6 z-50 flex items-center gap-3'>
        {user ? (
          <div className='flex items-center gap-2 px-4 py-2 rounded-lg bg-ivory/80 backdrop-blur-sm border border-border-cream shadow-whisper'>
            <div className='w-7 h-7 rounded-full bg-terracotta flex items-center justify-center'>
              <User className='w-4 h-4 text-ivory' />
            </div>
            <span className='hidden sm:inline text-sm font-medium text-charcoalWarm'>{user.email}</span>
            <button
              onClick={() => signOut()}
              className='ml-2 text-xs text-olive-gray hover:text-terracotta transition-colors'
            >
              退出
            </button>
          </div>
        ) : (
          <Link
            href='/auth/login'
            className='px-5 py-2 rounded-lg bg-terracotta text-ivory font-medium hover:bg-coral transition-colors text-sm'
          >
            登录
          </Link>
        )}
        <ThemeToggle />
      </div>

      <div
        className='fixed inset-0 -z-10'
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(201,100,66,0.06) 0%, rgba(217,119,87,0.03) 40%, transparent 70%)'
        }}
      />

      <section ref={ref} className='relative min-h-screen flex items-center justify-center overflow-hidden'>
        <motion.div style={{ y, opacity }} className='max-w-5xl mx-auto text-center relative z-10 px-4 pt-20'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ivory border border-border-cream text-sm font-medium text-olive-gray mb-12'
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
            <span className='text-nearBlack block mb-2'>AI Tools</span>
            <span className='text-terracotta block'>Blog</span>
          </motion.h1>

          <motion.div
            className='space-y-2 mb-14'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <p className='text-lg md:text-xl text-olive-gray max-w-2xl mx-auto leading-relaxed font-body'>
              记录产品从 <span className='text-nearBlack font-medium'>0 → 1</span> 落地全流程
            </p>
            <p className='text-lg md:text-xl text-olive-gray max-w-2xl mx-auto leading-relaxed font-body'>
              分享每个阶段可使用的 <span className='text-nearBlack font-medium'>AI 工具</span>
            </p>
          </motion.div>

          <motion.div
            className='flex flex-col sm:flex-row gap-4 justify-center items-center'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Link href='/tools'>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className='btn-terracotta inline-flex items-center gap-3 text-base'
              >
                探索 AI 工具
                <ArrowRight className='w-5 h-5' />
              </motion.button>
            </Link>
            <Link href='/blog'>
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: '#e8e6dc' }}
                whileTap={{ scale: 0.98 }}
                className='btn-warm-sand inline-flex items-center gap-3 text-base'
              >
                阅读博客
                <Sparkles className='w-5 h-5' />
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            className='mt-16 flex items-center justify-center gap-10 text-stone-gray'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className='flex items-center gap-2'>
              <Star className='w-4 h-4 text-terracotta fill-terracotta' />
              <span className='text-sm font-medium'>200+ 工具</span>
            </div>
            <div className='flex items-center gap-2'>
              <TrendingUp className='w-4 h-4 text-coral' />
              <span className='text-sm font-medium'>每周更新</span>
            </div>
            <div className='flex items-center gap-2'>
              <Layers className='w-4 h-4 text-oliveGray' />
              <span className='text-sm font-medium'>6 大阶段</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.06, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] md:text-[28rem] font-serif font-medium text-nearBlack select-none pointer-events-none -z-10'
        >
          AI
        </motion.div>

        <motion.div
          className='absolute bottom-8 left-1/2 -translate-x-1/2'
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className='w-6 h-10 rounded-full border border-border-warm flex items-start justify-center p-1'>
            <motion.div
              className='w-1 h-2 rounded-full bg-terracotta'
              animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      <section className='py-24 px-4'>
        <div className='max-w-6xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className='mb-16'
          >
            <span className='section-label'>01 / 分类浏览</span>
            <h2 className='text-3xl md:text-5xl font-serif font-medium text-nearBlack mt-3'>选择你的阶段</h2>
            <p className='text-olive-gray text-lg mt-3 max-w-xl'>按产品落地流程分类，发现各阶段最佳 AI 工具</p>
          </motion.div>

          <div className='grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6'>
            {categories.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link href={`/tools?category=${category.slug}`}>
                  <motion.div
                    className='group relative p-6 md:p-8 bg-ivory rounded-xl border border-border-cream cursor-pointer transition-all duration-300 hover:shadow-whisper'
                    whileHover={{ y: -4 }}
                  >
                    <div
                      className={`inline-flex p-3 rounded-lg mb-5`}
                      style={{ backgroundColor: category.bg_color || '#e8e6dc' }}
                    >
                      {category.icon &&
                        iconMap[category.icon] &&
                        React.createElement(iconMap[category.icon], { className: 'w-6 h-6 text-nearBlack' })}
                    </div>
                    <h3 className='text-xl font-serif font-medium text-nearBlack mb-1 group-hover:text-terracotta transition-colors'>
                      {category.name}
                    </h3>
                    <ArrowRight className='w-5 h-5 text-stone-gray absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300' />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className='py-24 px-4 bg-ivory'>
        <div className='max-w-6xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className='mb-16'
          >
            <span className='section-label'>02 / 热门推荐</span>
            <h2 className='text-3xl md:text-5xl font-serif font-medium text-nearBlack mt-3'>最受欢迎的 AI 工具</h2>
            <p className='text-olive-gray text-lg mt-3 max-w-xl'>开发者们正在使用的 AI 工具推荐</p>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {featuredTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className='group relative p-6 bg-parchment rounded-xl border border-border-cream hover:shadow-whisper transition-all duration-300'
                whileHover={{ y: -4 }}
              >
                <div className='flex items-center justify-between mb-5'>
                  <div
                    className='w-12 h-12 rounded-lg flex items-center justify-center text-lg font-serif font-medium text-ivory'
                    style={{ backgroundColor: '#c96442' }}
                  >
                    {tool.name.charAt(0)}
                  </div>
                  <span className='px-3 py-1 rounded-full bg-warmSand text-charcoalWarm text-sm font-medium'>
                    {tool.users}
                  </span>
                </div>
                <h3 className='text-xl font-serif font-medium text-nearBlack mb-2 group-hover:text-terracotta transition-colors'>
                  {tool.name}
                </h3>
                <p className='text-olive-gray text-sm mb-4 line-clamp-2'>{tool.description}</p>
                <div className='flex items-center gap-2 text-sm text-stone-gray'>
                  <TrendingUp className='w-4 h-4' />
                  <span>{tool.category_slug}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className='py-24 px-4'>
        <div className='max-w-6xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className='mb-16'
          >
            <span className='section-label'>03 / 落地流程</span>
            <h2 className='text-3xl md:text-5xl font-serif font-medium text-nearBlack mt-3'>产品落地流程</h2>
            <p className='text-olive-gray text-lg mt-3 max-w-xl'>从 0 到 1 的完整指南</p>
          </motion.div>

          <div className='space-y-4'>
            {processSteps.map((process, index) => (
              <motion.div
                key={process.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className='group relative flex flex-col md:flex-row md:items-center gap-4 md:gap-10 p-6 md:p-8 bg-ivory rounded-xl border border-border-cream hover:shadow-whisper transition-all duration-300'
                whileHover={{ x: 4 }}
              >
                <div className='flex items-center gap-6 md:w-36'>
                  <span className='text-4xl md:text-5xl font-serif font-medium text-terracotta group-hover:text-coral transition-colors'>
                    {process.step}
                  </span>
                  <div className='w-px h-12 bg-border-warm hidden md:block' />
                </div>
                <div className='flex-1'>
                  <h3 className='text-2xl font-serif font-medium text-nearBlack mb-2'>{process.title}</h3>
                  <p className='text-olive-gray mb-4'>{process.description}</p>
                  <div className='flex flex-wrap gap-2'>
                    {process.tools?.map((tool: string) => (
                      <span key={tool} className='px-3 py-1 rounded-full bg-warmSand text-charcoalWarm text-sm'>
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight className='w-6 h-6 text-terracotta opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-3 transition-all duration-300 hidden md:block' />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className='py-12 px-4 border-t border-border-cream'>
        <div className='max-w-6xl mx-auto text-center'>
          <p className='text-stone-gray'>© 2024 AI Tools Blog · 产品落地全流程 AI 工具分享</p>
        </div>
      </footer>
    </main>
  );
}
