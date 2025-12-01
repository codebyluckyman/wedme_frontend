import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  // Make sure to use 'await' with cookies()
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data: formData, user } = await req.json();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if a record already exists for this user
    const { data: existingRecord } = await supabase
      .from('onboarding_userInfo')
      .select('id')
      .eq('id', user.id)
      .single();

    if (existingRecord) {
      // Update the existing record instead of inserting a new one
      const { data, error } = await supabase
        .from('onboarding_userInfo')
        .update({
          full_name: formData.name,
          partner_name: formData.partnerName,
          wedding_date: formData.weddingDate || null,
          wedding_location: formData.weddingLocation || null,
          guest_count: formData.numberOfGuests || null,
          estimate_budget: formData.estimatedBudget || null,
        })
        .eq('id', user.id);

      if (error) throw error;
      return NextResponse.json({ success: true, data }, { status: 200 });
    } else {
      // Insert a new record
      const { data, error } = await supabase
        .from('onboarding_userInfo')
        .insert([
          {
            id: user.id,
            full_name: formData.name,
            partner_name: formData.partnerName,
            wedding_date: formData.weddingDate || null,
            wedding_location: formData.weddingLocation || null,
            guest_count: formData.numberOfGuests || null,
            estimate_budget: formData.estimatedBudget || null,
          },
        ]);

      if (error) throw error;
      return NextResponse.json({ success: true, data }, { status: 200 });
    }
  } catch (error) {
    console.error('Error saving user info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save user info' },
      { status: 500 }
    );
  }
}
