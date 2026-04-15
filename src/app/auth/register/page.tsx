'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2, Check, X } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();

  const passwordRequirements = [
    { met: password.length >= 8, text: '至少 8 个字符' },
    { met: /[A-Z]/.test(password), text: '包含大写字母' },
    { met: /[a-z]/.test(password), text: '包含小写字母' },
    { met: /[0-9]/.test(password), text: '包含数字' }
  ];

  const allRequirementsMet = passwordRequirements.every((req) => req.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email || !password || !confirmPassword) {
      setError('请填写所有字段');
      setLoading(false);
      return;
    }

    if (!allRequirementsMet) {
      setError('请确保密码符合所有要求');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      setLoading(false);
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password);
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
          <h1 className='text-2xl font-serif font-medium text-nearBlack mb-2'>注册成功！</h1>
          <p className='text-olive-gray mb-6'>请查收邮箱中的验证链接完成激活</p>
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
          <h1 className='text-3xl font-serif font-medium text-nearBlack mb-2'>创建账户</h1>
          <p className='text-olive-gray'>加入我们开始探索 AI 工具</p>
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

            <div>
              <label className='block text-sm font-medium text-charcoalWarm mb-2'>密码</label>
              <div className='relative'>
                <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-gray' />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='设置密码'
                  className='w-full pl-12 pr-12 py-3 rounded-lg border border-border-cream bg-parchment text-nearBlack placeholder:text-stone-gray focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent transition-all'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-stone-gray hover:text-olive-gray transition-colors'
                >
                  {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                </button>
              </div>

              {password && (
                <div className='mt-3 space-y-2'>
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className='flex items-center gap-2 text-sm'>
                      {req.met ? (
                        <Check className='w-4 h-4 text-green-600' />
                      ) : (
                        <X className='w-4 h-4 text-stone-gray' />
                      )}
                      <span className={req.met ? 'text-green-600' : 'text-stone-gray'}>{req.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-charcoalWarm mb-2'>确认密码</label>
              <div className='relative'>
                <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-gray' />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='再次输入密码'
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
              {loading ? '注册中...' : '注册'}
            </button>
          </form>

          <div className='mt-6 pt-6 border-t border-border-cream text-center'>
            <p className='text-olive-gray text-sm'>
              已有账户？{' '}
              <Link href='/auth/login' className='text-terracotta hover:underline font-medium'>
                立即登录
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}