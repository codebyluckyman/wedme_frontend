'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { User, ChevronDown, Menu, BadgeDollarSignIcon } from 'lucide-react'; // Import Menu icon
import { LogoutIcon } from '../icons';
import { useAuthStore } from '@/app/store/authStore';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';

export default function HeaderComponent({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const supabase = createClient();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const router = useRouter();

  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [credit, setCredit] = useState(0);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    router.push('/signin');
  }, [supabase, router]);

  useEffect(() => {
    if (user?.id) {
      const handleFetchCredit = async () => {
        const { data: creditData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user?.id)
          .single();

        if (error) throw error;
        if (creditData) setCredit(creditData?.credits);
      };

      handleFetchCredit();
    }
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        buttonRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [user?.id]);

  return (
    <header className='sticky top-0 z-50 md:px-8 px-2 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 flex items-center justify-between'>
      <button
        className='lg:hidden p-2 rounded-md hover:bg-gray-100'
        onClick={onToggleSidebar}
      >
        <Menu className='w-6 h-6 text-gray-700' />
      </button>
      <div className='ml-5 my-4 flex-1 flex items-center justify-end gap-5'>
        {/* <Link href='/credit' className='flex items-center'>
          <span className='sm:hidden text-[14px]'>Credit:</span>
          <span className='hidden sm:inline text-[14px]'>
            Available Credit:
          </span>
          <span className='text-[14px] ml-2 font-bold'>{0 || credit}</span>
        </Link> */}

        <div className='relative'>
          <button
            onClick={() => setShowPopover(!showPopover)}
            ref={buttonRef}
            className='flex items-center space-x-2 p-2 rounded-full hover:bg-purple-50'
          >
            <div className='h-8 w-8 rounded-full bg-purple-200 flex items-center justify-center'>
              <User className='h-5 w-5 text-[#6B21A8]' />
            </div>
            <ChevronDown className='h-4 w-4 text-gray-500' />
          </button>

          {showPopover && (
            <div
              ref={popoverRef}
              className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border'
            >
              <button
                onClick={() => handleSignOut()}
                className='flex items-center w-full px-4 gap-2 py-2 text-sm text-gray-700 hover:bg-purple-50'
              >
                <LogoutIcon />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
