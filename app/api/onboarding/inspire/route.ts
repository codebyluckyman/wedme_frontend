import { createClient } from '@/app/utils/supabase/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const body = await request.json();

  const { user, selectedTheme } = body;

  if (!user) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const { error } = await supabase.from('onboarding_inspire').upsert({
      id: user.id,
      inspire: selectedTheme,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Error inserting data into onboarding_inspire:', error);
      return NextResponse.json(
        { error: 'Failed to save envision data' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error handling envision API:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
