import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session_id } = req.body;

  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id' });
  }

  const supabase = createServerSupabaseClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(session_id);

    if (stripeSession.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not successful' });
    }

    // Add 50 credits to the user's account
    const { data, error } = await supabase.rpc('add_credits', {
      p_user_id: session.user.id,
      p_credits: 50,
    });

    if (error) {
      console.error('Error adding credits:', error);
      return res.status(500).json({ error: 'Failed to add credits' });
    }

    res.status(200).json({ credits: data });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while verifying the payment' });
  }
}
