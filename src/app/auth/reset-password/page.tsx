'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || password.length < 6) {
      setError('密码至少需要 6 个字符');
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password
    });

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
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className='text-center'
        >
          <div className='w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4'>
            <Check className='w-8 h-8 text-green-600' />
          </div>
          <h1 className='text-2xl font-serif font-medium text-nearBlack mb-2'>密码重置成功！</h1>
          <p className='text-olive-gray mb-6'>请使用新密码登录</p>
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
          <h1 className='text-3xl font-serif font-medium text-nearBlack mb-2'>设置新密码</h1>
          <p className='text-olive-gray'>请输入您的新密码</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5'>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2'
            >
              <AlertCircle className='w-4 h-4' />
              {error}
            </motion.div>
          )}

          <div className='space-y-2'>
            <label className='text-sm font-medium text-charcoalWarm block'>新密码</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='至少 6 个字符'
              className='w-full px-4 py-3 rounded-full border border-border-cream bg-ivory text-nearBlack placeholder:text-stone-gray focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent transition-all text-base'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-charcoalWarm block'>确认密码</label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='再次输入新密码'
              className='w-full px-4 py-3 rounded-full border border-border-cream bg-ivory text-nearBlack placeholder:text-stone-gray focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent transition-all text-base'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full cursor-pointer rounded-full border border-terracotta bg-terracotta px-6 py-3 text-center font-medium text-base text-ivory transition-colors hover:bg-terracotta/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
          >
            {loading ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin' />
                重置中...
              </>
            ) : (
              '重置密码'
            )}
          </button>

          <div className='text-center'>
            <Link href='/auth/login' className='text-sm text-olive-gray hover:text-terracotta transition-colors'>
              返回登录
            </Link>
          </div>
        </form>
      </motion.div>
    </main>
  );
}