'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import AnimatedCharacters from '@/components/animated-characters';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<'none' | 'email' | 'password' | 'other'>('none');
  const { signIn } = useAuth();
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        window.location.href = '/';
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setFocusedField('none');

    if (!email || !password) {
      setError('请填写邮箱和密码');
      setLoading(false);
      return;
    }

    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  const handleEmailFocus = () => setFocusedField('email');
  const handlePasswordFocus = () => setFocusedField('password');
  const handleBlur = () => setFocusedField('none');

  return (
    <div className='min-h-screen max-h-screen overflow-hidden grid lg:grid-cols-2 bg-parchment'>
      <div className='relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-terracotta/20 via-coral/10 to-parchment p-12'>
        <div className='relative z-20 flex items-center gap-2 text-lg font-semibold'>
          <span className='text-nearBlack'>AI Tools Blog.</span>
        </div>

        <div className='relative z-20 flex items-center justify-center h-[500px]'>
          <AnimatedCharacters
            focusedField={focusedField}
            isPasswordVisible={showPassword}
            passwordLength={password.length}
            isLoginError={!!error}
          />
        </div>

        <div className='relative z-20 flex items-center gap-8 text-sm text-olive-gray'>
          <span>AI Tools Blog</span>
          <span>•</span>
          <span>探索 AI 工具的无限可能</span>
        </div>

        <div className='absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]' />
        <div className='absolute top-1/4 right-1/4 size-64 bg-terracotta/20 rounded-full blur-3xl' />
        <div className='absolute bottom-1/4 left-1/4 size-96 bg-coral/20 rounded-full blur-3xl' />
      </div>

      <div className='flex items-center justify-center p-8 bg-parchment'>
        <div className='w-full max-w-[420px]'>
          <div className='lg:hidden flex items-center justify-center gap-2 text-lg font-semibold mb-12'>
            {/* <div className='w-8 h-8 rounded-lg bg-terracotta flex items-center justify-center'>
              <span className='text-ivory text-sm'>AI</span>
            </div> */}
            <span className='text-nearBlack'>AI Tools Blog.</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className='text-center mb-10'>
              <h1 className='text-3xl font-serif font-bold tracking-tight mb-2 text-nearBlack'>欢迎回来</h1>
              <p className='text-olive-gray text-sm'>请输入您的账户信息</p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-5'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-charcoalWarm block'>邮箱</label>
                <div className='relative'>
                  <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-gray' />
                  <input
                    ref={emailRef}
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={handleEmailFocus}
                    onBlur={handleBlur}
                    placeholder='your@email.com'
                    className='w-full pl-12 pr-4 py-3 rounded-full border border-border-cream bg-ivory text-nearBlack placeholder:text-stone-gray focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent transition-all text-base'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-charcoalWarm block'>密码</label>
                <div className='relative'>
                  <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-gray' />
                  <input
                    ref={passwordRef}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={handlePasswordFocus}
                    onBlur={handleBlur}
                    placeholder='••••••••'
                    className='w-full pl-12 pr-12 py-3 rounded-full border border-border-cream bg-ivory text-nearBlack placeholder:text-stone-gray focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent transition-all text-base'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-stone-gray hover:text-olive-gray transition-colors'
                  >
                    {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                  </button>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <Link href='/auth/forgot-password' className='text-sm text-terracotta hover:underline font-medium'>
                  忘记密码？
                </Link>
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
                className='w-full cursor-pointer rounded-full border border-terracotta bg-terracotta px-6 py-3 text-center font-medium text-base text-ivory transition-colors hover:bg-terracotta/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              >
                {loading ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    登录中...
                  </>
                ) : (
                  '登录'
                )}
              </button>
            </form>

            <div className='text-center text-sm text-olive-gray mt-8'>
              还没有账户？{' '}
              <Link href='/auth/register' className='text-nearBlack font-medium hover:underline'>
                注册
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
