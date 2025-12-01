// app/test/gmail-credentials/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function TestGmailCredentials() {
  const [credentials, setCredentials] = useState<any>(null);
  const [hasCredentials, setHasCredentials] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Test GET credentials
  const fetchCredentials = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gmail/credentials');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch credentials');
      }

      setCredentials(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setCredentials(null);
    } finally {
      setLoading(false);
    }
  };

  // Test HEAD request to check if credentials exist
  const checkCredentials = async () => {
    try {
      const response = await fetch('/api/gmail/credentials', {
        method: 'HEAD',
      });
      setHasCredentials(response.ok);
    } catch (err) {
      console.error('Error checking credentials:', err);
      setHasCredentials(false);
    }
  };

  // Check credentials on component mount
  useEffect(() => {
    checkCredentials();
  }, []);

  return (
    <div className='p-8 max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Gmail Credentials Test</h1>

      <div className='space-y-6'>
        {/* Status Display */}
        <div className='bg-gray-100 p-4 rounded'>
          <h2 className='font-semibold mb-2'>Credentials Status:</h2>
          {hasCredentials === null ? (
            <p>Checking credentials...</p>
          ) : (
            <p className={hasCredentials ? 'text-green-600' : 'text-red-600'}>
              {hasCredentials ? 'Credentials found' : 'No credentials found'}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className='space-x-4'>
          <button
            onClick={fetchCredentials}
            disabled={loading}
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50'
          >
            {loading ? 'Loading...' : 'Fetch Credentials'}
          </button>

          <button
            onClick={checkCredentials}
            disabled={loading}
            className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50'
          >
            Check Credentials Status
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
            <p className='font-bold'>Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Credentials Display */}
        {credentials && (
          <div className='bg-white shadow rounded p-4'>
            <h2 className='font-semibold mb-2'>Current Credentials:</h2>
            <pre className='bg-gray-50 p-4 rounded overflow-auto max-h-96'>
              {JSON.stringify(credentials, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
