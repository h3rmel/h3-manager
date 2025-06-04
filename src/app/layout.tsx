import type { Metadata } from 'next';

import '@/assets/globals.css';

import { ThemeProvider } from '@/components/theme-provider';

import { cn } from '@/lib/utils';

import { geistMono, geistSans } from '@/assets/fonts';

export const metadata: Metadata = {
  title: 'Vercel Projects Manager',
  description: 'Manage your Vercel projects',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          'font-sans antialiased',
          'w-full min-h-dvh',
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
