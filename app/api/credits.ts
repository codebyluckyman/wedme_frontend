import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
}); // Update to the latest stable version

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const supabase = createServerSupabaseClient({ req, res });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('users')
        .select('credits')
        .eq('id', session.user.id)
        .single();

      console.log('Fetched credits:', data?.credits);

      if (error) {
        console.error('Error fetching credits:', error);
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json({ credits: data?.credits || 0 });
    }

    if (req.method === 'POST') {
      const { action } = req.body;

      if (action === 'decrement') {
        const { data, error } = await supabase.rpc('decrement_credits', {
          p_user_id: session.user.id,
        });

        console.log('Decrement action result:', data);

        if (error) {
          console.error('Error decrementing credits:', error);
          return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ credits: data });
      }

      if (action === 'create_checkout_session') {
        try {
          console.log('Creating Stripe checkout session...');
          const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
              {
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: '50 Credits',
                  },
                  unit_amount: 1099, // $10.99
                },
                quantity: 1,
              },
            ],
            mode: 'payment',
            success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/cancel`,
            client_reference_id: session.user.id,
          });

          console.log('Stripe session created:', stripeSession.id);
          return res
            .status(200)
            .json({ sessionId: stripeSession.id, url: stripeSession.url });
        } catch (err) {
          console.error('Error creating Stripe checkout session:', err);
          return res.status(500).json({
            error: 'Failed to create checkout session',
            details: (err as Error).message,
          });
        }
      }

      // If action is not recognized
      return res.status(400).json({ error: 'Invalid action' });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error('Unexpected error in API handler:', err);
    return res.status(500).json({
      error: 'An unexpected error occurred',
      details: (err as Error).message,
    });
  }
}
