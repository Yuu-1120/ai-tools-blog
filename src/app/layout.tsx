import type { Metadata } from 'next';
import { Space_Grotesk, Outfit } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700']
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'AI Tools Blog - 产品落地全流程 AI 工具分享',
  description: '分享产品从 0-1 落地全过程中使用的 AI 工具，包括产品设计、UI/UX、前端开发、后端开发、测试等各阶段'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='zh-CN' className='scroll-smooth'>
      <body className={cn(spaceGrotesk.variable, outfit.variable, 'min-h-screen antialiased')}>{children}</body>
    </html>
  );
}
