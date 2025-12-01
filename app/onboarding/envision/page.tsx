'use client';

import { createClient } from '@/app/utils/supabase/client';
import { WeddingRingsLogo } from '@/components/icons';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface StyleOption {
  id: string;
  emoji: any;
  label: string;
}

const styleOptions: StyleOption[] = [
  {
    id: 'romantic',
    emoji: (
      <img src='/images/envision_icon_1.png' className='w-[50px] h-[46px]' />
    ),
    label: 'Romantic',
  },
  {
    id: 'elegant',
    emoji: (
      <img src='/images/envision_icon_2.png' className='w-[46px] h-[46px]' />
    ),
    label: 'Elegant',
  },
  {
    id: 'boho',
    emoji: (
      <img src='/images/envision_icon_3.png' className='w-[60px] h-[46px]' />
    ),
    label: 'Boho',
  },
  {
    id: 'traditional',
    emoji: (
      <img src='/images/envision_icon_4.png' className='w-[40px] h-[46px]' />
    ),
    label: 'Traditional',
  },
  {
    id: 'modern',
    emoji: (
      <img src='/images/envision_icon_5.png' className='w-[50px] h-[46px]' />
    ),
    label: 'Modern',
  },
  {
    id: 'whimsical',
    emoji: (
      <img src='/images/envision_icon_6.png' className='w-[50px] h-[46px]' />
    ),
    label: 'Whimsical',
  },
];

export default function EnvisionPage() {
  const supabase = createClient();
  const router = useRouter();
  const [selectedStyles, setSelectedStyles] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const toggleStyle = (id: string) => {
    const newSelected = new Set(selectedStyles);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedStyles(newSelected);
  };

  const handleSubmit = async () => {
    if (selectedStyles.size === 0) {
      alert('Please select at least one style before continuing!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/onboarding/envision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: userData,
          selectedStyles: Array.from(selectedStyles),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save envision data');
      }

      router.push('/onboarding/inspire');
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
      const response = await fetch('/api/onboarding/envision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: userData,
          selectedStyles: [],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to skip envision step');
      }

      router.push('/onboarding/inspire');
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
            <div className='h-[3px] md:w-[72px] w-[40px] bg-[#ECD2FF] rounded-full'></div>
            <div className='h-[3px] md:w-[72px] w-[40px] bg-[#ECD2FF] rounded-full'></div>
          </div>
          <Link
            href='/onboarding/yourself'
            className='flex items-center text-[15px] text-[#0E001B] hover:opacity-80'
          >
            <ArrowLeft className='w-[18px] h-[18px] mr-[6px]' />
            Back
          </Link>
        </div>

        <div>
          <h2 className='text-[24px] md:text-[28px] lg:text-[32px] leading-normal md:leading-[20px] font-semibold text-[#0E001B] mb-[16px]'>
            Envision Your Perfect Day
          </h2>

          <p className='text-[16px] leading-[28px] font-normal text-[#0E001B] mb-[42px]'>
            Pick a few words that describe your dream wedding
          </p>

          <div className='h-auto min-h-[320px] md:h-[440px]'>
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12 max-w-full md:max-w-[90%]'>
              {styleOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => toggleStyle(option.id)}
                  className={`p-4 sm:p-6 rounded-xl border w-full sm:w-[140px] flex flex-col items-center justify-center gap-2 transition-all shadow-lg
                  ${
                    selectedStyles.has(option.id)
                      ? 'border-[#6B21A8] bg-white'
                      : 'border-[#CFA2FF8C]/30 bg-white/80 hover:border-[#CFA2FF8C]'
                  }`}
                >
                  <span className='text-3xl'>{option.emoji}</span>
                  <span className='font-medium text-[#0e001b]'>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className='flex md:justify-start justify-end sm:justify-end items-start sm:items-center gap-3 pt-[24px]'>
          <button
            onClick={handleSkip}
            disabled={isLoading}
            className='h-[44px] w-auto px-[20px] text-[15px] text-[#0E001B] rounded-[8px] border border-[#6B21A8]'
          >
            Skip for now
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className='h-[44px] w-auto px-[24px] text-[15px] text-white bg-[#6B21A8] rounded-[8px] hover:bg-[#8006F4] transition-colors'
          >
            Continue
          </button>
        </div>
      </div>

      <div className='hidden md:block'>
        <div className='bg-[#CFA2FF75] h-full flex flex-col justify-center'>
          <div className='pt-[60px]'>
            <img
              src='/images/onboarding_2.png'
              alt='Calendar illustration'
              className='w-auto h-auto'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
