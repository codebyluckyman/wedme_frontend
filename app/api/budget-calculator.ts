import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const supabase = createPagesServerClient({ req, res });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // Check credits before generating budget
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('credits')
        .eq('id', session.user.id)
        .single();

      if (userError) throw userError;
      if (userData.credits <= 0) {
        return res.status(400).json({ error: 'Insufficient credits' });
      }

      const { totalBudget, guestCount, location, weddingDate, venueType } =
        req.body;

      if (
        !totalBudget ||
        !guestCount ||
        !location ||
        !weddingDate ||
        !venueType
      ) {
        return res.status(400).json({ error: 'Missing required inputs' });
      }

      const userInput = `Generate a detailed wedding budget breakdown for the following scenario:
      Total Budget: $${totalBudget}
      Number of Guests: ${guestCount}
      Location: ${location}
      Wedding Date: ${weddingDate}
      Venue Type: ${venueType}

      Please provide a breakdown of estimated costs for the following categories, ensuring the total does not exceed the given budget:
      1. Venue and Catering (40-50% of total budget)
      2. Attire and Beauty (10-15% of total budget)
      3. Flowers and Decor (10-15% of total budget)
      4. Photography and Videography (10-12% of total budget)
      5. Entertainment and Music (5-10% of total budget)
      6. Stationery and Favors (2-3% of total budget)
      7. Transportation (2-3% of total budget)
      8. Wedding Rings (2-3% of total budget)
      9. Gifts (2-3% of total budget)
      10. Miscellaneous and Emergency Fund (5-10% of total budget)

      For each category, provide:
      - Estimated cost (as a specific amount, not a range)
      - Brief explanation of what's included
      - Any location-specific, date-specific, or venue-specific considerations
      
      Also, provide any money-saving tips specific to this wedding scenario and suggest areas where the couple might want to allocate more or less of their budget based on their specific details.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userInput }],
      });

      const budgetBreakdown =
        response.choices[0]?.message?.content ||
        'Could not generate budget breakdown.';

      // Decrement credits after successful generation
      const { data: updatedCredits, error: creditError } = await supabase.rpc(
        'decrement_credits',
        {
          p_user_id: session.user.id,
        }
      );

      if (creditError) throw creditError;

      res.status(200).json({
        budgetBreakdown: budgetBreakdown,
        remainingCredits: updatedCredits,
      });
    } catch (error: unknown) {
      console.error(
        `Exception: ${error instanceof Error ? error.message : String(error)}`
      );
      res.status(500).json({
        error: 'Error: Unable to process your request',
        details: error,
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).send(`Method ${req.method} Not Allowed`);
  }
}
