'use client';

import { createClient } from '@/app/utils/supabase/client';
import { WeddingRingsLogo } from '@/components/icons';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface StyleOption {
  id: string;
  label: string;
}

const styleOptions: StyleOption[] = [
  {
    id: 'selection',
    label: 'Venue Selection',
  },
  {
    id: 'matching',
    label: 'Vendor Matching',
  },
  {
    id: 'guest_list',
    label: 'Guest List & RSVPs',
  },
  {
    id: 'design',
    label: 'Decor & Design',
  },
  {
    id: 'invitation',
    label: 'Invitations & Stationery',
  },
];

export default function PriorityPage() {
  const router = useRouter();
  const supabase = createClient();

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
      alert('Please select at least one priority before continuing!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/onboarding/priority', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: userData,
          selectedPriorities: Array.from(selectedStyles),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save priorities data');
      }

      router.push('/dashboard');
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
      const response = await fetch('/api/onboarding/priority', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: userData,
          selectedPriorities: null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save priorities data');
      }

      router.push('/dashboard');
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
            <div className='h-[3px] md:w-[72px] w-[40px] bg-[#8006F4] rounded-full'></div>
          </div>
          <Link
            href='/onboarding/inspire'
            className='flex items-center text-[15px] text-[#0E001B] hover:opacity-80'
          >
            <ArrowLeft className='w-[18px] h-[18px] mr-[6px]' />
            Back
          </Link>
        </div>

        <div>
          <h2 className='text-[24px] md:text-[28px] lg:text-[32px] leading-normal md:leading-[20px] font-semibold text-[#0E001B] mb-[16px]'>
            Where Do You Need the Most Help?
          </h2>

          <p className='text-[16px] leading-[28px] font-normal text-[#0E001B] mb-[42px]'>
            We'll guide you based on your biggest priorities.
          </p>

          <div className='h-auto min-h-[320px] md:h-[440px]'>
            <div className='flex flex-wrap gap-3 md:gap-4 mb-12'>
              {styleOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => toggleStyle(option.id)}
                  className={`py-[12px] md:py-[14px] px-3 md:px-4 rounded-xl border transition-all shadow-lg w-full sm:w-auto
                  ${
                    selectedStyles.has(option.id)
                      ? 'border-[#6B21A8] bg-white'
                      : 'border-[#CFA2FF8C]/30 bg-white/80 hover:border-[#CFA2FF8C]'
                  }`}
                >
                  <span className='font-normal text-[#0e001b]'>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className='flex justify-end items-start sm:items-center gap-3 pt-[24px]'>
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
            Personalize My Plan
          </button>
        </div>
      </div>

      <div className='hidden lg:block'>
        <div className='bg-[#CFA2FF75] h-full flex flex-col justify-center'>
          <div className='pt-[60px]'>
            <img
              src='/images/onboarding_4.png'
              alt='Calendar illustration'
              className='w-auto h-auto'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
