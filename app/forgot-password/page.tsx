'use client';

import { useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import Link from 'next/link';

const WeddingRingsLogo = () => (
  <svg
    width='32'
    height='32'
    viewBox='0 0 32 32'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <circle
      cx='13'
      cy='16'
      r='6'
      stroke='currentColor'
      strokeWidth='2'
      className='text-primary/80'
      fill='none'
    />
    <circle
      cx='19'
      cy='16'
      r='6'
      stroke='currentColor'
      strokeWidth='2'
      className='text-primary'
      fill='none'
    />
  </svg>
);

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const supabase = createClient();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');
    setSubmitted(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSubmitted(true);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      setErrorMessage('Failed to send password reset email. Please try again.');
    }
  };

  return (
    <div className='flex min-h-screen w-full'>
      <div className='w-full lg:w-3/5 flex items-center justify-center px-6 py-12 lg:px-8 bg-white pb-[160px]'>
        <div className='w-full max-w-md space-y-8'>
          <div className='flex items-center justify-center'>
            <h2 className='text-2xl font-medium text-purple-800'>wedme.ai</h2>
            <WeddingRingsLogo />
          </div>

          <h1 className='text-2xl font-semibold text-center'>
            Forgot your password?
          </h1>

          <form onSubmit={handleForgotPassword} className='mt-8 space-y-6'>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email Address
                </label>
                <input
                  id='email'
                  type='email'
                  required
                  className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500'
                  placeholder='Enter your email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            {message && (
              <div className='text-green-500 text-sm text-center font-light animate-fade-in'>
                {message}
              </div>
            )}
            {errorMessage && (
              <div className='text-red-500 text-sm text-center font-light animate-fade-in'>
                {errorMessage}
              </div>
            )}

            <div>
              <button
                type='submit'
                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-purple-800 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
              >
                Send Reset Link
              </button>
            </div>
          </form>

          <div className='text-center mt-4'>
            <p className='text-sm text-gray-600'>
              Remember your password?{' '}
              <Link
                href='/signin'
                className='font-medium text-purple-600 hover:text-purple-500'
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className='hidden lg:block lg:w-2/5 bg-purple-100'>
        <div className='flex flex-col h-full justify-center px-12 py-12 relative'>
          <div className='max-w-lg text-start mb-8'>
            <h1 className='text-4xl leading-[48px] font-medium mb-2'>
              Your <span className='text-purple-800'>Dream</span> <br />
              Wedding Awaits
            </h1>
            <p className='text-gray-700'>
              Reset your password to continue your wedding planning journey
            </p>
          </div>

          <div className='relative w-full mb-4 mt-16'>
            <div className='rounded-lg overflow-hidden'>
              <img
                src='/images/signin_image.png'
                alt='Wedding couple illustration'
                className='w-[360px] h-full aspect-square mx-auto'
              />
            </div>
          </div>
        </div>
      </div>

      {submitted && message && (
        <div className='fixed bottom-4 right-4 bg-purple-600 shadow-lg rounded-lg px-8 py-6 text-white animate-fade-in backdrop-blur-sm'>
          <div className='flex items-center space-x-2'>
            <span className='text-2xl'>✓</span>
            <span>{message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
