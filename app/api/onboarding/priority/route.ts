import { createClient } from '@/app/utils/supabase/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const body = await request.json();

  const { user, selectedPriorities } = body;

  if (!user) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const { error } = await supabase.from('onboarding_priority').upsert({
      id: user.id,
      priority: selectedPriorities || null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Error saving priorities to onboarding_priority:', error);
      return NextResponse.json(
        { error: 'Failed to save priorities data' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error handling priority API:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
