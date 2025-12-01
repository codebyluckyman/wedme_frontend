'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';
import { useAuthStore } from '@/app/store/authStore';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const setUser = useAuthStore((state: any) => state.setUser);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const {
          data: { session },
          error: authError,
        } = await supabase.auth.getSession();

        if (authError) {
          console.error('Auth error:', authError);
          router.push(`/signin?error=auth_error`);
          return;
        }

        if (!session) {
          router.push(`/signin?error=session_error`);
          return;
        }
        setUser(session?.user);

        // Check if the user credentials already exist in the 'user_gmail_credentials' table
        const { data: existingCredentials, error: credentialsError } =
          await supabase
            .from('user_gmail_credentials')
            .select('*')
            .eq('user_id', session?.user.id)
            .single();

        if (credentialsError && credentialsError.code !== 'PGRST116') {
          console.error(
            'Error checking Gmail credentials existence:',
            credentialsError
          );
          router.push(`/signin?error=credentials_check_error`);
          return;
        }

        let redirectToOnboarding = false;

        if (existingCredentials) {
          // If credentials exist, update them
          const { error: updateError } = await supabase
            .from('user_gmail_credentials')
            .update({
              access_token: session.provider_token,
              refresh_token: session.provider_refresh_token,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', session.user.id);

          if (updateError) {
            console.error('Error updating Gmail credentials:', updateError);
            router.push(`/signin?error=update_error`);
            return;
          }
        } else {
          // If credentials do not exist, insert them
          const { error: insertError } = await supabase
            .from('user_gmail_credentials')
            .insert({
              user_id: session.user.id,
              access_token: session.provider_token,
              refresh_token: session.provider_refresh_token,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (insertError) {
            console.error(
              'Error inserting new Gmail credentials:',
              insertError
            );
            router.push(`/signin?error=insert_error`);
            return;
          }

          redirectToOnboarding = true; // Set the flag to redirect to onboarding
        }

        // Redirect to the appropriate page based on user state
        const forwardedHost = window.location.hostname;
        const isLocalEnv = process.env.NODE_ENV === 'development';

        if (redirectToOnboarding) {
          // Redirect to the onboarding page if the user is new
          if (isLocalEnv) {
            router.push(`/onboarding/yourself`);
          } else if (forwardedHost) {
            router.push(`https://${forwardedHost}/onboarding/yourself`);
          } else {
            router.push(`/onboarding/yourself`);
          }
        } else {
          // Redirect to the dashboard if the user already exists
          if (isLocalEnv) {
            router.push('/dashboard');
          } else if (forwardedHost) {
            router.push(`https://${forwardedHost}/dashboard`);
          } else {
            router.push('/dashboard');
          }
        }
      } catch (error) {
        console.error('Callback error:', error);
        router.push(`/signin?error=callback_error`);
      }
    };

    handleAuthCallback();
  }, [searchParams, router]);

  return (
    <div>
      {error ? <p>Error: {error}</p> : <p>Processing your authentication...</p>}
    </div>
  );
}
