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
      // Check credits before generating menu
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('credits')
        .eq('id', session.user.id)
        .single();

      if (userError) throw userError;
      if (userData.credits <= 0) {
        return res.status(400).json({ error: 'Insufficient credits' });
      }

      const { cuisines, dietaryRestrictions, additionalInstructions } =
        req.body;

      if (!Array.isArray(cuisines) || cuisines.length === 0) {
        return res.status(400).json({ error: 'Invalid cuisines input' });
      }

      const cuisineString = cuisines.join(', ');

      const userInput = `Generate two different menu options for a ${cuisineString} cuisine wedding. 
      Consider these dietary restrictions: ${dietaryRestrictions || 'None'}.
      Additional instructions: ${additionalInstructions || 'None'}.
      For each menu option, include appetizers, main courses, and desserts.
      For each item, provide a brief description of the dish.
      Format the output as two distinct menus, clearly labeled as 'Menu Option 1' and 'Menu Option 2'.
      Use the following format for each item:
      
      [Course Name]:
      - [Dish Name]: [Brief description of the dish, including key ingredients and flavors]

      Ensure that the descriptions are enticing and highlight the unique aspects of each dish.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userInput }],
      });

      const messageContent = response.choices[0]?.message?.content || '';
      const menuOptions = messageContent.split('Menu Option 2');
      const menuOption1 = menuOptions[0].trim();
      const menuOption2 =
        menuOptions.length > 1
          ? 'Menu Option 2' + menuOptions[1].trim()
          : 'Could not generate second menu option.';

      // Decrement credits after successful generation
      const { data: updatedCredits, error: creditError } = await supabase.rpc(
        'decrement_credits',
        {
          p_user_id: session.user.id,
        }
      );

      if (creditError) throw creditError;

      res.status(200).json({
        menu_option1: menuOption1,
        menu_option2: menuOption2,
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
