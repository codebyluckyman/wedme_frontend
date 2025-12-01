'use client';

import { createClient } from '@/app/utils/supabase/client';
import { WeddingRingsLogo } from '@/components/icons';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormData {
  name: string;
  partnerName: string;
  weddingDate?: string; // Optional
  weddingLocation?: string; // Optional
  numberOfGuests?: number; // Optional
  estimatedBudget?: string; // Optional
}

export default function WeddingForm() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const supabase = createClient();

  useEffect(() => {
    const handleUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error fetching user:', error);
          return;
        }
        setUserData(data.user);
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    handleUser();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: data,
          user: userData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        router.push('/onboarding/envision');
      } else {
        setError(result.error || 'Failed to save user info');
        console.error('Failed to save user info:', result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/onboarding/envision');
  };

  return (
    <div className='min-h-screen bg-white h-full mx-auto grid md:grid-cols-[1fr,35%] grid-cols-1 w-full'>
      <div className='md:ml-[26%] px-4 md:px-6 py-6'>
        <div className='flex justify-between items-center mb-8 md:mb-[42px]'>
          <div className='flex items-center gap-1'>
            <span className='text-[24px] font-bold text-[#6B21A8]'>
              wedme.ai
            </span>
            <WeddingRingsLogo />
          </div>
        </div>

        <div className='flex justify-between items-center mb-8 md:mb-[40px]'>
          <div className='flex gap-2 md:gap-[10px]'>
            <div className='h-[3px] md:w-[72px] w-[40px] bg-[#8006F4] rounded-full'></div>
            <div className='h-[3px] md:w-[72px] w-[40px] bg-[#ECD2FF] rounded-full'></div>
            <div className='h-[3px] md:w-[72px] w-[40px] bg-[#ECD2FF] rounded-full'></div>
            <div className='h-[3px] md:w-[72px] w-[40px] bg-[#ECD2FF] rounded-full'></div>
          </div>
          <Link
            href='#'
            className='flex items-center text-[15px] text-[#0E001B] hover:opacity-80'
          >
            <ArrowLeft className='w-[18px] h-[18px] mr-[6px]' />
            Back
          </Link>
        </div>

        <div>
          <h2 className='text-[24px] md:text-[32px] leading-[28px] md:leading-[38px] font-semibold text-[#0E001B] mb-8 md:mb-[42px]'>
            Tell us about yourself
          </h2>

          {error && (
            <div className='p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded'>
              {error}
            </div>
          )}

          <form
            className='space-y-6 md:space-y-[18px]'
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label className='block text-[15px] text-[#0E001B] mb-2'>
                Your Name
              </label>
              <input
                type='text'
                placeholder='Enter your full name'
                {...register('name', { required: 'Your name is required' })}
                className={`w-full max-w-full md:max-w-[70%] h-[40px] px-[16px] rounded-[12px] border ${
                  errors.name ? 'border-red-500' : 'border-[#E5E7EB]'
                } text-[15px] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 ${
                  errors.name ? 'focus:ring-red-500' : 'focus:ring-[#6B21A8]'
                }`}
              />
              {errors.name && (
                <p className='text-red-500 text-[13px] mt-1'>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className='block text-[15px] text-[#0E001B] mb-2'>
                Your Partner's Name
              </label>
              <input
                type='text'
                placeholder="Enter your partner's full name"
                {...register('partnerName', {
                  required: 'Partner name is required',
                })}
                className={`w-full h-[40px] px-[16px] max-w-full md:max-w-[70%] rounded-[12px] border ${
                  errors.partnerName ? 'border-red-500' : 'border-[#E5E7EB]'
                } text-[15px] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 ${
                  errors.partnerName
                    ? 'focus:ring-red-500'
                    : 'focus:ring-[#6B21A8]'
                }`}
              />
              {errors.partnerName && (
                <p className='text-red-500 text-[13px] mt-1'>
                  {errors.partnerName.message}
                </p>
              )}
            </div>

            <div>
              <label className='block text-[15px] text-[#0E001B] mb-2'>
                Wedding Date (optional)
              </label>
              <input
                type='date'
                {...register('weddingDate')}
                className='w-full h-[40px] px-[16px] max-w-full md:max-w-[70%] rounded-[12px] border border-[#E5E7EB] text-[15px] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#6B21A8]'
              />
            </div>

            <div>
              <label className='block text-[15px] text-[#0E001B] mb-2'>
                Wedding Location (optional)
              </label>
              <input
                type='text'
                placeholder='Enter location'
                {...register('weddingLocation')}
                className='w-full h-[40px] px-[16px] max-w-full md:max-w-[70%] rounded-[12px] border border-[#E5E7EB] text-[15px] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#6B21A8]'
              />
            </div>

            <div>
              <label className='block text-[15px] text-[#0E001B] mb-2'>
                Number of Guests (optional)
              </label>
              <input
                type='number'
                placeholder='Enter number of guests'
                {...register('numberOfGuests', {
                  valueAsNumber: true,
                  min: { value: 1, message: 'Guests must be at least 1' },
                })}
                className='w-full h-[40px] px-[16px] max-w-full md:max-w-[70%] rounded-[12px] border-[0.5px] border-[#E5E7EB] text-[15px] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#6B21A8]'
              />
              {errors.numberOfGuests && (
                <p className='text-red-500 text-[13px] mt-1'>
                  {errors.numberOfGuests.message}
                </p>
              )}
            </div>

            <div>
              <label className='block text-[15px] text-[#0E001B] mb-2'>
                Estimated Budget?
              </label>
              <input
                type='text'
                placeholder='Enter estimated budget'
                {...register('estimatedBudget')}
                className='w-full h-[40px] px-[16px] max-w-full md:max-w-[70%] rounded-[12px] border border-[#E5E7EB] text-[15px] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#6B21A8]'
              />
            </div>

            <div className='flex justify-end items-center gap-3 pt-6 md:pt-[24px]'>
              <button
                type='button'
                onClick={handleSkip}
                className='h-[44px] px-[20px] text-[15px] text-[#0E001B] rounded-[8px] border border-[#6B21A8]'
              >
                Skip for now
              </button>
              <button
                type='submit'
                disabled={isLoading}
                className='h-[44px] px-[24px] text-[15px] text-white bg-[#6B21A8] rounded-[8px] hover:bg-[#8006F4] transition-colors disabled:opacity-50'
              >
                {isLoading ? 'Submitting...' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Calendar Section */}
      <div className='md:block hidden'>
        <div className='bg-[#CFA2FF75] h-full flex flex-col justify-end py-6 md:py-0 '>
          <div className='space-y-6 md:space-y-[30px]'>
            <div className='bg-white rounded-[20px] ml-4 md:ml-[70px] p-[20px] max-w-[210px] flex justify-center items-center gap-4'>
              <div className='bg-black rounded-full p-[4px]'>
                <Check className='w-3 h-3 text-white' />
              </div>
              <div className='text-[28px] leading-[34px] font-semibold text-[#0E001B]'>
                01
              </div>
              <div className=''>
                <span className='text-[18px] font-medium'>February</span>
                <br />
                <span className='text-[14px] font-medium text-[#6B7280]'>
                  Saturday
                </span>
              </div>
            </div>

            <div className='bg-white rounded-[20px] ml-4 md:ml-[70px] p-[20px] max-w-[210px] flex justify-center items-center gap-4'>
              <div className='bg-black rounded-full p-[4px]'>
                <Check className='w-3 h-3 text-white' />
              </div>
              <div className='text-[28px] leading-[34px] font-semibold text-[#0E001B]'>
                20
              </div>
              <div className=''>
                <span className='text-[18px] font-medium'>March</span>
                <br />
                <span className='text-[14px] font-medium text-[#6B7280]'>
                  Monday
                </span>
              </div>
            </div>

            <div className='pt-[60px] ml-4 md:ml-10'>
              <img
                src='/images/onboarding_1.png'
                alt='Calendar illustration'
                className='w-auto h-auto'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
