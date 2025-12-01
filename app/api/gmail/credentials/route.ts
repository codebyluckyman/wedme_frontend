// app/api/gmail/credentials/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET endpoint to fetch credentials
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: credentials, error: credentialsError } = await supabase
      .from('user_gmail_credentials')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (credentialsError || !credentials) {
      console.error('Error fetching credentials:', credentialsError);
      return NextResponse.json(
        { error: 'No Gmail credentials found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      credentials: {
        access_token: credentials.access_token,
        refresh_token: credentials.refresh_token,
        token_type: 'Bearer',
        expiry_date: Date.now() + 3600000, // 1 hour from now
      },
    });
  } catch (error) {
    console.error('Credentials fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// HEAD endpoint to check if credentials exist
export async function HEAD() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return new Response(null, { status: 401 });
    }

    const { data, error } = await supabase
      .from('user_gmail_credentials')
      .select('user_id')
      .eq('user_id', session.user.id)
      .single();

    if (error || !data) {
      return new Response(null, { status: 404 });
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}

// PUT endpoint to update tokens
export async function PUT(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { access_token, refresh_token } = body;

    const { error: updateError } = await supabase
      .from('user_gmail_credentials')
      .update({
        access_token,
        refresh_token,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', session.user.id);

    if (updateError) {
      console.error('Token update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update tokens' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Token update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
