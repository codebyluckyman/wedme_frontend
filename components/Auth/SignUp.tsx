'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/app/utils/supabase/client';

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

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const router = useRouter();
  // const supabase = createClientComponentClient();
  const supabase = createClient();
  const [submitted, setSubmitted] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const GMAIL_SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.compose',
    // 'https://www.googleapis.com/auth/gmail.modify',
    // 'https://www.googleapis.com/auth/gmail.settings.basic',
    // 'https://www.googleapis.com/auth/gmail.settings.sharing',
  ];

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const {
  //       data: { session },
  //     } = await supabase.auth.getSession();
  //     if (session) {
  //       router.push('/dashboard');
  //     }
  //   };

  //   checkAuth();

  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((event, session) => {
  //     if (event === 'SIGNED_IN') {
  //       router.push('/dashboard');
  //     }
  //   });

  //   return () => {
  //     if (subscription) {
  //       subscription.unsubscribe();
  //     }
  //   };
  // }, [supabase, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setConfirmationMessage('');
    setSubmitted(false);
    setShowMessage(false);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;

      setSubmitted(true);
      setShowMessage(true);
      setConfirmationMessage(
        'Please check your email for the confirmation link to complete your registration.'
      );
      router.push('/onboarding/yourself');
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred during sign up');
      setShowMessage(true);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            scope: ['email', 'profile', ...GMAIL_SCOPES].join(' '),
          },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Google sign-up error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
      setShowMessage(true);
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
            Welcome to <span className='text-purple-800'>wedme.ai</span>
          </h1>

          <form onSubmit={handleSignUp} className='mt-8 space-y-6'>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700'
                >
                  Full Name
                </label>
                <input
                  id='name'
                  type='text'
                  required
                  className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500'
                  placeholder='Enter your full name'
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

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

              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700'
                >
                  Password
                </label>
                <div className='relative'>
                  <input
                    id='password'
                    type='password'
                    required
                    className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500'
                    placeholder='Enter your password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <div className='absolute inset-y-0 right-0 flex items-center pr-3 mt-1'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-gray-400'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                      />
                    </svg>
                  </div>
                </div>
                {password.length > 0 && password.length < 8 && (
                  <p className='mt-2 text-sm text-red-600 font-light'>
                    Password must be at least 8 characters long.
                  </p>
                )}
              </div>
            </div>

            {errorMessage && (
              <div className='text-red-500 text-sm text-center font-light animate-fade-in'>
                {errorMessage}
              </div>
            )}

            {confirmationMessage && (
              <div className='text-green-500 text-sm text-center font-light animate-fade-in'>
                {confirmationMessage}
              </div>
            )}

            <div className='!mt-[40px]'>
              <button
                type='submit'
                disabled={password.length < 8}
                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-purple-800 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
              >
                Create Account
              </button>
            </div>

            {/* <div className='relative my-4'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>or</span>
              </div>
            </div> */}

            {/* <div>
              <button
                type='button'
                onClick={handleGoogleSignUp}
                className='w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-md font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
              >
                <svg
                  className='h-5 w-5 mr-2'
                  viewBox='0 0 24 24'
                  width='24'
                  height='24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <g transform='matrix(1, 0, 0, 1, 27.009001, -39.238998)'>
                    <path
                      fill='#4285F4'
                      d='M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z'
                    />
                    <path
                      fill='#34A853'
                      d='M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z'
                    />
                    <path
                      fill='#FBBC05'
                      d='M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z'
                    />
                    <path
                      fill='#EA4335'
                      d='M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z'
                    />
                  </g>
                </svg>
                Continue with Google
              </button>
            </div> */}
          </form>

          <div className='text-center mt-4'>
            <p className='text-sm text-gray-600'>
              Already have an account?{' '}
              <Link
                href='/signin'
                className='font-medium text-purple-600 hover:text-purple-500'
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className='hidden lg:block lg:w-2/5 bg-purple-100'>
        <div className='flex flex-col h-full justify-center px-12 py-12 relative'>
          <div className='max-w-lg text-start mb-8'>
            <h1 className='text-4xl leading-[48px] font-medium mb-2'>
              Plan Your <span className='text-purple-800'>Perfect</span> <br />
              Wedding
            </h1>
            <p className='text-gray-700'>
              Let our AI simplify your wedding planning journey
            </p>
          </div>

          <div className='relative w-full mb-4 mt-16'>
            <div className='rounded-lg overflow-hidden'>
              <img
                src='/images/signup_image.png'
                alt='Wedding Planning'
                className='w-[360px] h-full aspect-square mx-auto'
              />
            </div>
          </div>
        </div>
      </div>

      {submitted && showMessage && (
        <div className='fixed bottom-4 right-4 bg-purple-600 shadow-lg rounded-lg px-8 py-6 text-white animate-fade-in backdrop-blur-sm'>
          <div className='flex items-center space-x-2'>
            <span className='text-2xl'>✓</span>
            <span>Check your email to complete registration!</span>
          </div>
        </div>
      )}
    </div>
  );
}
