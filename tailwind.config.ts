import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        parchment: 'var(--parchment)',
        ivory: 'var(--ivory)',
        warmSand: 'var(--warmSand)',
        darkSurface: 'var(--darkSurface)',
        nearBlack: 'var(--nearBlack)',
        terracotta: 'var(--terracotta)',
        coral: 'var(--coral)',
        charcoalWarm: 'var(--charcoalWarm)',
        oliveGray: 'var(--oliveGray)',
        stoneGray: 'var(--stoneGray)',
        warmSilver: 'var(--warmSilver)',
        borderCream: 'var(--borderCream)',
        borderWarm: 'var(--borderWarm)',
        ringWarm: 'var(--ringWarm)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'dark-bg': '#141413',
        'dark-bg-elevated': '#30302e',
        'dark-text': '#faf9f5',
        'dark-text-secondary': '#87867f',
        'dark-text-tertiary': '#b0aea5',
        'dark-border': '#30302e'
      },
      ringColor: {
        DEFAULT: 'var(--terracotta)',
        terracotta: 'var(--terracotta)',
      },
      fontFamily: {
        serif: ['Georgia', "'Times New Roman'", 'Times', 'serif'],
        sans: ['var(--font-body)', 'var(--font-chinese)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
        chinese: ['var(--font-chinese)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace']
      },
      borderRadius: {
        '2xs': '4px',
        xs: '6px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px'
      },
      boxShadow: {
        ring: '0px 0px 0px 1px var(--ring-warm)',
        'ring-warm': '0px 0px 0px 1px var(--ring-warm)',
        whisper: 'rgba(0,0,0,0.05) 0px 4px 24px',
        'whisper-lg': 'rgba(0,0,0,0.08) 0px 8px 32px',
        'dark-ring': '0px 0px 0px 1px #30302e',
        'dark-whisper': 'rgba(0,0,0,0.3) 0px 4px 24px',
        'dark-whisper-lg': 'rgba(0,0,0,0.4) 0px 8px 32px'
      },
      lineHeight: {
        relaxed: '1.60',
        tight: '1.10',
        snug: '1.20',
        loose: '1.80'
      },
      letterSpacing: {
        wide: '0.05em',
        wider: '0.10em',
        widest: '0.15em'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};

export default config;
