'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const dark = document.documentElement.classList.contains('dark');
    setIsDark(dark);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  if (!mounted) {
    return (
      <button className='w-10 h-10 rounded-full bg-ivory/80 backdrop-blur-sm border border-border-cream shadow-sm flex items-center justify-center'>
        <span className='w-5 h-5' />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className='w-10 h-10 rounded-full bg-ivory/80 backdrop-blur-sm border border-border-cream shadow-sm hover:bg-parchment flex items-center justify-center transition-all duration-200'
      aria-label='Toggle theme'
    >
      {isDark ? (
        <svg className="w-5 h-5 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-charcoalWarm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}