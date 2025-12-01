// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
// import { NextResponse } from 'next/server';

// export async function middleware(req: any) {
//   const res = NextResponse.next();

//   // Create a Supabase client configured to use cookies
//   const supabase = createMiddlewareClient({ req, res });

//   // Refresh session if expired - required for Server Components
//   await supabase.auth.getSession();

//   return res;
// }

import { type NextRequest } from 'next/server';
import { updateSession } from './app/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/',
    '/onboarding',
    // '/((?!_next/static|_next/image|favicon.ico|onboarding.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
