import type { Metadata } from 'next';
import { Space_Grotesk, Outfit, Noto_Sans_SC, Geist } from 'next/font/google';
import { AuthProvider } from '@/contexts/auth-context';
import './globals.css';
import { cn } from '@/lib/utils';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

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

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-chinese',
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'AI Tools Blog.',
  description: '按用途分类的 AI 工具百科，图像·视频·对话·编程·设计·音频·写作·Agent'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='zh-CN' suppressHydrationWarning className={cn('scroll-smooth', 'font-sans', geist.variable)}>
      <body
        suppressHydrationWarning
        className={cn(
          spaceGrotesk.variable,
          outfit.variable,
          notoSansSC.variable,
          'min-h-screen antialiased font-sans'
        )}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
