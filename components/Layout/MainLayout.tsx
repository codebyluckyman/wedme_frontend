'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';
import HeaderComponent from './Header';
import Sidebar from './Sidebar';
import Loading from '../Loading';
import { useAuthStore } from '@/app/store/authStore';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setUser, user } = useAuthStore();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session?.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const isOnboarding = pathname && pathname.includes('onboarding');
  const isResetPassword = pathname && pathname.includes('reset-password');
  const isLogin = pathname && pathname.includes('signin');

  // if (loading) {
  //   return (
  //     <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm h-screen'>
  //       <Loading />
  //     </div>
  //   );
  // }

  return (
    <main className='h-screen flex'>
      {isOnboarding || isResetPassword || isLogin ? (
        <>{children}</>
      ) : user?.id === null ? (
        <>{children}</>
      ) : (
        <div className='w-full flex'>
          <Sidebar isMobileOpen={isSidebarOpen} onClose={closeSidebar} />
          <div
            className='w-full flex flex-col overflow-y-auto'
            id='main_container'
          >
            <HeaderComponent onToggleSidebar={toggleSidebar} />
            <div className='flex-1 flex'>{children}</div>
          </div>
        </div>
      )}
    </main>
  );
}
