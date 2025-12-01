import SignIn from '@/components/Auth/SignIn';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
};

export default function SignInPage() {
  return <SignIn />;
}
