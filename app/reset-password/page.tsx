'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '../utils/supabase/client';

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

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const supabase = createClient();
  useEffect(() => {
    const url = new URL(window.location.href);
    const access_token = url.searchParams.get('access_token');
    const refresh_token = url.searchParams.get('refresh_token');

    if (access_token && refresh_token) {
      supabase.auth.setSession({
        access_token,
        refresh_token,
      });
    }
  }, []);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setErrorMessage(error.message);
        return;
      }
      setSuccessMessage('Password has been reset successfully!');
      setTimeout(() => router.push('/signin'), 3000);
    } catch (err) {
      setErrorMessage('Failed to reset password. Please try again.');
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
            Reset Your Password
          </h1>

          <form onSubmit={handlePasswordReset} className='mt-8 space-y-6'>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700'
                >
                  New Password
                </label>
                <input
                  id='password'
                  type='password'
                  required
                  className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500'
                  placeholder='Enter new password'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor='confirm-password'
                  className='block text-sm font-medium text-gray-700'
                >
                  Confirm New Password
                </label>
                <input
                  id='confirm-password'
                  type='password'
                  required
                  className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500'
                  placeholder='Confirm new password'
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {errorMessage && (
              <div className='text-red-500 text-sm text-center font-light'>
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className='text-green-500 text-sm text-center font-light'>
                {successMessage}
              </div>
            )}

            <div>
              <button
                type='submit'
                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-purple-800 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
              >
                Reset Password
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
              Set a new password to continue your journey
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

      {successMessage && (
        <div className='fixed bottom-4 right-4 bg-purple-600 shadow-lg rounded-lg px-8 py-6 text-white animate-fade-in backdrop-blur-sm'>
          <div className='flex items-center space-x-2'>
            <span className='text-2xl'>✓</span>
            <span>{successMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
