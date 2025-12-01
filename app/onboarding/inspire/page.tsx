'use client';

import { createClient } from '@/app/utils/supabase/client';
import { WeddingRingsLogo } from '@/components/icons';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface StyleOption {
  id: string;
  image: string;
  title: string;
  description: string;
}

const styleOptions: StyleOption[] = [
  {
    id: 'beach',
    image: '/images/onboarding_inspire_1.png',
    title: 'Beach',
    description: 'Wedding',
  },
  {
    id: 'fariy-tale',
    image: '/images/onboarding_inspire_2.png',
    title: 'Fairy-Tale Theme',
    description: 'Wedding',
  },
  {
    id: 'forest',
    image: '/images/onboarding_inspire_3.png',
    title: 'Forest Wedding',
    description: 'Theme',
  },
  {
    id: 'retro',
    image: '/images/onboarding_inspire_4.png',
    title: 'Retro Wedding',
    description: 'Theme',
  },
];

export default function InspirePage() {
  const router = useRouter();
  const supabase = createClient();

  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const handleSubmit = async () => {
    if (!selectedTheme) {
      alert('Please select a theme before continuing!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/onboarding/inspire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: userData,
          selectedTheme,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save theme data');
      }

      router.push('/onboarding/priority');
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/onboarding/inspire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: userData,
          selectedTheme: null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save theme data');
      }

      router.push('/onboarding/priority');
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserData(user);
    };

    handleUser();
  }, []);

  return (
    <div className='min-h-screen bg-white h-full mx-auto grid grid-cols-1 md:grid-cols-1 lg:grid-cols-[1fr,35%] w-full'>
      <div className='px-6 py-6 md:ml-[10%] lg:ml-[26%]'>
        {/* Header */}
        <div className='flex justify-between items-center mb-[42px]'>
          <div className='flex items-center gap-1'>
            <span className='text-[24px] font-bold text-[#6B21A8]'>
              wedme.ai
            </span>
            <WeddingRingsLogo />
          </div>
        </div>

        {/* Progress Steps */}
        <div className='flex justify-between items-center mb-[40px]'>
          <div className='flex gap-[10px]'>
            <div className='h-[3px] md:w-[72px] w-[40px] bg-[#8006F4] rounded-full'></div>
            <div className='h-[3px] md:w-[72px] w-[40px] bg-[#8006F4] rounded-full'></div>
            <div className='h-[3px] md:w-[72px] w-[40px] bg-[#8006F4] rounded-full'></div>
            <div className='h-[3px] md:w-[72px] w-[40px] bg-[#ECD2FF] rounded-full'></div>
          </div>
          <Link
            href='/onboarding/envision'
            className='flex items-center text-[15px] text-[#0E001B] hover:opacity-80'
          >
            <ArrowLeft className='w-[18px] h-[18px] mr-[6px]' />
            Back
          </Link>
        </div>

        <div>
          <h2 className='text-[24px] md:text-[28px] lg:text-[32px] leading-normal md:leading-[20px] font-semibold text-[#0E001B] mb-[40px] md:mb-[86px]'>
            Choose What Inspires You
          </h2>

          <div className='h-auto min-h-[320px] md:h-[440px]'>
            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12'>
              {styleOptions.map(theme => (
                <div
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  role='button'
                  tabIndex={0}
                  onKeyDown={e =>
                    e.key === 'Enter' && setSelectedTheme(theme.id)
                  }
                  className={`relative group rounded-2xl min-w-[120px] sm:min-w-[153px] overflow-hidden aspect-[3/5] bg-gray-100
                    ${
                      selectedTheme === theme.id
                        ? 'border-[#6B21A8] bg-white border-2'
                        : 'border-[#CFA2FF8C]/30 bg-white/80 hover:border-[#CFA2FF8C]'
                    }`}
                >
                  <img
                    src={theme.image || '/placeholder.svg'}
                    alt={`${theme.title} ${theme.description}`}
                    className='absolute inset-0 w-full h-full object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70' />

                  {/* Title at bottom */}
                  <div className='absolute bottom-0 left-0 right-0 p-4 text-white'>
                    <h2 className='text-[14px] font-medium leading-tight'>
                      {theme.title}
                    </h2>
                    <p className='text-[14px] font-medium leading-tight'>
                      {theme.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='flex md:justify-start justify-end items-start sm:items-center gap-3 pt-[24px]'>
          <button
            onClick={handleSkip}
            disabled={isLoading}
            className='h-[44px] px-[20px] text-[15px] text-[#0E001B] rounded-[8px] border border-[#6B21A8]'
          >
            Skip for now
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className='h-[44px] px-[24px] text-[15px] text-white bg-[#6B21A8] rounded-[8px] hover:bg-[#8006F4] transition-colors'
          >
            Continue
          </button>
        </div>
      </div>

      <div className='hidden lg:block'>
        <div className='bg-[#CFA2FF75] h-full flex flex-col justify-center'>
          <div className='pt-[60px]'>
            <img
              src='/images/onboarding_3.png'
              alt='Calendar illustration'
              className='w-auto h-auto'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
