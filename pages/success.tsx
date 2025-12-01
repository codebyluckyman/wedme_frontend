import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Success() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const { session_id } = router.query;

    if (typeof session_id !== 'string') {
      setStatus('error');
      setMessage('Invalid session ID');
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id }),
        });

        if (!response.ok) {
          throw new Error('Payment verification failed');
        }

        const data = await response.json();
        setStatus('success');
        setMessage(
          `Payment successful! ${data.credits} credits added to your account.`
        );
      } catch (error) {
        setStatus('error');
        setMessage(
          'An error occurred while verifying your payment. Please contact support.'
        );
        console.error('Payment verification error:', error);
      }
    };

    verifyPayment();
  }, [router.isReady, router.query]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center'>
      <Head>
        <title>
          Payment {status === 'success' ? 'Successful' : 'Processing'} - Wedme
        </title>
      </Head>
      <div className='bg-white p-8 rounded-xl shadow-lg max-w-md w-full'>
        <h1 className='text-2xl font-bold text-center mb-4'>
          {status === 'loading'
            ? 'Processing Payment'
            : status === 'success'
              ? 'Payment Successful!'
              : 'Payment Error'}
        </h1>
        <p className='text-center text-gray-600'>{message}</p>
        {status !== 'loading' && (
          <button
            onClick={() => router.push('/venue-search')}
            className='mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors'
          >
            Return to Chat
          </button>
        )}
      </div>
    </div>
  );
}
