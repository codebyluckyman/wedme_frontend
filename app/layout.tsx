import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import MainLayout from '@/components/Layout/MainLayout';

import { ToastContainer, toast } from 'react-toastify';
import { PostHogProvider } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wedme - Your Wedding Planning Assistant',
  description: 'Plan your perfect wedding with Wedme',
};

// ... existing commented out viewport code ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={inter.className}>
      <body>
        <PostHogProvider>
          <MainLayout>{children}</MainLayout>
          <Analytics />
          <ToastContainer
            position='top-right'
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='light'
          />
        </PostHogProvider>
      </body>
    </html>
  );
}
