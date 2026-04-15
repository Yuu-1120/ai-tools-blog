'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Loader2, Check } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('请输入邮箱地址');
      setLoading(false);
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(email);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className='min-h-screen bg-parchment flex items-center justify-center p-4'>
        <div
          className='fixed inset-0 -z-10'
          style={{
            background: 'radial-gradient(circle at 50% 30%, rgba(201,100,66,0.08) 0%, transparent 60%)'
          }}
        />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className='text-center'>
          <div className='w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4'>
            <Check className='w-8 h-8 text-green-600' />
          </div>
          <h1 className='text-2xl font-serif font-medium text-nearBlack mb-2'>发送成功！</h1>
          <p className='text-olive-gray mb-6'>请查收邮箱中的链接来重置密码</p>
          <Link
            href='/auth/login'
            className='inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-terracotta text-ivory font-medium hover:bg-coral transition-colors'
          >
            返回登录
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-parchment flex items-center justify-center p-4'>
      <div
        className='fixed inset-0 -z-10'
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(201,100,66,0.08) 0%, transparent 60%)'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'
      >
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-serif font-medium text-nearBlack mb-2'>重置密码</h1>
          <p className='text-olive-gray'>我们会向您的邮箱发送重置链接</p>
        </div>

        <div className='bg-ivory rounded-xl border border-border-cream p-8 shadow-whisper'>
          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label className='block text-sm font-medium text-charcoalWarm mb-2'>邮箱</label>
              <div className='relative'>
                <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-gray' />
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='your@email.com'
                  className='w-full pl-12 pr-4 py-3 rounded-lg border border-border-cream bg-parchment text-nearBlack placeholder:text-stone-gray focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent transition-all'
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className='p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm'
              >
                {error}
              </motion.div>
            )}

            <button
              type='submit'
              disabled={loading}
              className='w-full py-3 px-4 rounded-lg bg-terracotta text-ivory font-medium hover:bg-coral transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {loading && <Loader2 className='w-5 h-5 animate-spin' />}
              {loading ? '发送中...' : '发送重置链接'}
            </button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-olive-gray text-sm'>
              想起密码了？{' '}
              <Link href='/auth/login' className='text-terracotta hover:underline font-medium'>
                返回登录
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
