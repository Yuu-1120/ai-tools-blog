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
import dynamic from 'next/dynamic';
import { HomeData } from '@/types/home';

const Antigravity = dynamic(() => import('@/components/Antigravity'), { ssr: false });
const Ribbons = dynamic(() => import('@/components/Ribbons'), { ssr: false });

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Code,
  Palette,
  TestTube,
  Layers,
  Bot
};

function RibbonBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className='fixed inset-0 -z-10 pointer-events-none' />;
  }

  return (
    <div className='fixed inset-0 -z-10 pointer-events-none'>
      <Ribbons colors={['#D5BDAF', '#E3D5CA', '#D5BDAF', '#E3D5CA']} baseThickness={30} speedMultiplier={0.5} />
    </div>
  );
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }
};

const itemStagger = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]
    }
  })
};

function AnimatedText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`inline-block ${className}`}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letterVariants}
          initial='hidden'
          animate='visible'
          className='inline-block'
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

function GlowOrb({ className }: { className?: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  );
}

export default function Home() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

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

  const y = useTransform(headerScroll.scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(headerScroll.scrollYProgress, [0, 0.5], [1, 0]);

  if (loading) {
    return (
      <main className='min-h-screen bg-[#F5EBE0]'>
        <div className='gradient-mesh fixed inset-0 -z-10' />
        <div className='flex items-center justify-center min-h-screen'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#D5BDAF]' />
        </div>
      </main>
    );
  }

  const categories = homeData?.categories || [];
  const featuredTools = homeData?.featuredTools || [];
  const processSteps = homeData?.processSteps || [];

  return (
    <main className='min-h-screen bg-[#F5EBE0]'>
      {mounted && (
        <motion.div
          className='fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D5BDAF] to-[#1a1a1a] z-50 origin-left'
          style={{ scaleX: scrollYProgress }}
        />
      )}

      <div className='gradient-mesh fixed inset-0 -z-10' />

      <section ref={ref} className='relative min-h-screen flex items-center justify-center overflow-hidden'>
        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <Antigravity
            count={300}
            magnetRadius={10}
            ringRadius={10}
            waveSpeed={0.4}
            waveAmplitude={1}
            particleSize={2}
            lerpSpeed={0.1}
            color='#ffb481'
            autoAnimate={false}
            particleVariance={1}
            rotationSpeed={0}
            depthFactor={1}
            pulseSpeed={3}
            particleShape='capsule'
            fieldStrength={10}
          />
        </div>

        <GlowOrb className='w-96 h-96 bg-[#D5BDAF]/20 -top-20 -left-20' />
        <GlowOrb className='w-80 h-80 bg-[#E3D5CA]/30 top-1/2 -right-20' />

        <motion.div style={{ y, opacity }} className='max-w-5xl mx-auto text-center relative z-10 px-4'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className='inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-md border border-[#D5CFC5] text-sm font-medium text-[#6B6B6B] mb-10 shadow-lg'
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              <Zap className='w-4 h-4 text-amber-500' />
            </motion.span>
            <span>发现最棒的 AI 工具</span>
            <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronRight className='w-4 h-4' />
            </motion.div>
          </motion.div>

          <motion.h1 className='text-6xl md:text-7xl lg:text-[8rem] font-bold tracking-tight mb-10 leading-[1.1] font-display'>
            <motion.span
              className='text-[#1a1a1a] block'
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <AnimatedText text='AI Tools' />
            </motion.span>
            <motion.span
              className='text-[#D5BDAF] block'
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <AnimatedText text='Blog' />
            </motion.span>
          </motion.h1>

          <motion.div
            className='space-y-1 mb-12'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className='text-lg md:text-xl text-[#6B6B6B] max-w-2xl mx-auto leading-relaxed font-chinese'>
              记录产品从{' '}
              <motion.span
                className='text-[#1a1a1a] font-bold'
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                0 → 1
              </motion.span>{' '}
              落地全流程
            </p>
            <p className='text-lg md:text-xl text-[#6B6B6B] max-w-2xl mx-auto leading-relaxed font-chinese'>
              分享每个阶段可使用的 <span className='text-[#1a1a1a] font-bold'>AI 工具</span>
            </p>
          </motion.div>

          <motion.div
            className='flex flex-col sm:flex-row gap-5 justify-center items-center'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <Link href='/tools'>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  y: -3,
                  boxShadow: '0 20px 40px rgba(26, 26, 26, 0.3)'
                }}
                whileTap={{ scale: 0.95 }}
                className='group relative inline-flex items-center gap-3 px-10 py-5 bg-[#1a1a1a] text-white rounded-full font-semibold text-lg shadow-xl overflow-hidden'
              >
                <motion.span
                  className='absolute inset-0 bg-gradient-to-r from-[#D5BDAF] to-[#E3D5CA]'
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className='relative z-10 flex items-center gap-3'>
                  探索 AI 工具
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight className='w-5 h-5' />
                  </motion.span>
                </span>
              </motion.button>
            </Link>
            <Link href='/blog'>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  y: -3,
                  backgroundColor: '#F5EBE0'
                }}
                whileTap={{ scale: 0.95 }}
                className='inline-flex items-center gap-3 px-10 py-5 bg-white text-[#1a1a1a] rounded-full font-semibold text-lg border-2 border-[#1a1a1a] shadow-lg transition-all duration-300'
              >
                阅读博客
                <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Sparkles className='w-5 h-5' />
                </motion.span>
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            className='mt-16 flex items-center justify-center gap-8 text-[#9CA3AF]'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className='flex items-center gap-2'
            >
              <Star className='w-4 h-4 fill-amber-400 text-amber-400' />
              <span className='text-sm'>200+ 工具</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              className='flex items-center gap-2'
            >
              <TrendingUp className='w-4 h-4 text-emerald-500' />
              <span className='text-sm'>每周更新</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              className='flex items-center gap-2'
            >
              <Layers className='w-4 h-4 text-blue-500' />
              <span className='text-sm'>6 大阶段</span>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25rem] md:text-[35rem] font-bold text-[#D5BDAF]/20 select-none pointer-events-none -z-10'
        >
          AI
        </motion.div>

        <motion.div
          className='absolute bottom-8 left-1/2 -translate-x-1/2'
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className='w-6 h-10 rounded-full border-2 border-[#D5BDAF]/50 flex items-start justify-center p-1'>
            <motion.div
              className='w-1.5 h-1.5 rounded-full bg-[#D5BDAF]'
              animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      <section className='py-24 px-4 min-h-screen'>
        <div className='max-w-6xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className='flex items-end justify-between mb-12'
          >
            <div>
              <h2 className='text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-3 font-display'>选择你的阶段</h2>
              <p className='text-[#6B6B6B] text-lg font-chinese'>按产品落地流程分类，发现各阶段最佳 AI 工具</p>
            </div>
          </motion.div>

          <motion.div
            variants={container}
            initial='hidden'
            whileInView='show'
            viewport={{ once: true, margin: '-50px' }}
            className='grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6'
          >
            {categories.map((category) => (
              <motion.div key={category.slug} variants={item}>
                <Link href={`/tools?category=${category.slug}`}>
                  <motion.div
                    className='group relative p-6 md:p-8 bg-white rounded-2xl border border-[#E5E0D8] cursor-pointer card-hover overflow-hidden'
                    whileHover={{ y: -5, borderColor: '#D5BDAF' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${category.color || ''}`}
                      style={{ mixBlendMode: 'soft-light' }}
                    />
                    <div className={`relative inline-flex p-3 rounded-xl ${category.bg_color} mb-4`}>
                      {category.icon &&
                        iconMap[category.icon] &&
                        React.createElement(iconMap[category.icon], { className: 'w-6 h-6 text-[#1a1a1a]' })}
                    </div>
                    <h3 className='text-xl font-bold text-[#1a1a1a] mb-1 group-hover:translate-x-1 transition-transform'>
                      {category.name}
                    </h3>
                    <ArrowRight className='w-5 h-5 text-[#6B6B6B] absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300' />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className='py-24 px-4 bg-white/50 min-h-screen'>
        <div className='max-w-6xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className='mb-12'
          >
            <div className='flex items-center gap-2 mb-3'>
              <Star className='w-5 h-5 text-amber-500 fill-amber-500' />
              <span className='text-sm font-medium text-[#6B6B6B]'>热门工具</span>
            </div>
            <h2 className='text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-3 font-display'>最受欢迎的 AI 工具</h2>
            <p className='text-[#6B6B6B] text-lg font-chinese'>开发者们正在使用的 AI 工具推荐</p>
          </motion.div>

          <motion.div
            variants={container}
            initial='hidden'
            whileInView='show'
            viewport={{ once: true, margin: '-50px' }}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
          >
            {featuredTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                variants={itemStagger}
                className='group relative p-6 bg-white rounded-2xl border-2 border-[#E5E0D8] hover:border-[#D5BDAF] card-hover'
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className='flex items-center justify-between mb-4'>
                  <motion.div
                    className='w-12 h-12 rounded-xl bg-gradient-to-br from-[#D5BDAF] to-[#E5E0D8] flex items-center justify-center text-lg font-bold text-[#1a1a1a]'
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {tool.name.charAt(0)}
                  </motion.div>
                  <span className='px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium'>
                    {tool.users}
                  </span>
                </div>
                <h3 className='text-xl font-bold text-[#1a1a1a] mb-1'>{tool.name}</h3>
                <p className='text-[#6B6B6B] text-sm mb-3'>{tool.description}</p>
                <div className='flex items-center gap-2 text-sm text-[#9CA3AF]'>
                  <TrendingUp className='w-4 h-4' />
                  <span>{tool.category_slug}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className='py-24 px-4 min-h-screen'>
        <div className='max-w-6xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className='mb-12'
          >
            <h2 className='text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-3 font-display'>产品落地流程</h2>
            <p className='text-[#6B6B6B] text-lg font-chinese'>从 0 到 1 的完整指南</p>
          </motion.div>

          <motion.div
            variants={container}
            initial='hidden'
            whileInView='show'
            viewport={{ once: true, margin: '-50px' }}
            className='space-y-4'
          >
            {processSteps.map((process) => (
              <motion.div
                key={process.step}
                variants={itemStagger}
                className='group relative flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-6 md:p-8 bg-white rounded-2xl border-2 border-[#E5E0D8] hover:border-[#D5BDAF] card-hover'
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className='flex items-center gap-6 md:w-32'>
                  <motion.span
                    className='text-4xl md:text-5xl font-bold text-[#D5BDAF] group-hover:text-[#1a1a1a] transition-colors'
                    whileHover={{ scale: 1.1 }}
                  >
                    {process.step}
                  </motion.span>
                  <div className='w-px h-12 bg-[#E5E0D8] hidden md:block' />
                </div>
                <div className='flex-1'>
                  <h3 className='text-2xl font-bold text-[#1a1a1a] mb-2'>{process.title}</h3>
                  <p className='text-[#6B6B6B] mb-3'>{process.description}</p>
                  <div className='flex flex-wrap gap-2'>
                    {process.tools?.map((tool: string) => (
                      <span
                        key={tool}
                        className='px-3 py-1 rounded-full bg-[#F5EBE0] text-[#6B6B6B] text-sm font-medium'
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight className='w-6 h-6 text-[#D5BDAF] group-hover:text-[#1a1a1a] group-hover:translate-x-2 transition-all duration-300 hidden md:block' />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <footer className='py-12 px-4 border-t border-[#E5E0D8]'>
        <div className='max-w-6xl mx-auto text-center'>
          <p className='text-[#6B6B6B]'>© 2024 AI Tools Blog · 产品落地全流程 AI 工具分享</p>
        </div>
      </footer>
    </main>
  );
}
