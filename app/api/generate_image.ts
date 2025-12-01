import { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import fetch from 'node-fetch';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const config = {
  maxDuration: 300,
};

type ResponseData = {
  image_urls?: string[];
  message?: string;
  remainingCredits?: number;
};

async function enhancePrompt(
  initialPrompt: string,
  additionalInstructions?: string
): Promise<string> {
  try {
    // Create a base prompt that includes any additional instructions
    const basePrompt = additionalInstructions
      ? `${initialPrompt}\nAdditional design requirements: ${additionalInstructions}`
      : initialPrompt;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert at creating detailed, visually descriptive prompts for invitation card image generation. Focus on incorporating specific design elements while maintaining readability and elegance.',
        },
        {
          role: 'user',
          content: `Transform this invitation card prompt into a detailed image generation prompt. Include all design elements and additional instructions while ensuring only the specified text appears in the final design:\n\n${basePrompt}\n\nKey requirements:
          1. Only include the following text elements: couple's names, "Save The Date", event date, and location
          2. Make text prominent and easily readable
          3. Incorporate any additional design instructions naturally
          4. Maintain the specified theme and style
          5. Ensure high-quality visual details
          
          Example format:
          "Create an [style] [event_type] invitation with [detailed design elements]. The design should prominently display '[couple_name]' in [font style] at [position], with 'Save The Date', '[event_date]', and '[event_location]' arranged [layout description]. [Additional design elements]. [Any specified additional instructions]. Ensure all text is clear and readable, with no additional text elements."`,
        },
      ],
      max_tokens: 700,
      temperature: 0.7,
    });

    const enhancedPrompt = response.choices[0].message.content?.trim();
    if (!enhancedPrompt) {
      throw new Error('No prompt generated from OpenAI');
    }

    // Log the enhanced prompt for debugging
    return enhancedPrompt;
  } catch (error) {
    console.error('Error in prompt enhancement:', error);
    // Return a formatted fallback prompt if enhancement fails
    return `Create a professional ${initialPrompt}${additionalInstructions ? `. Additional design details: ${additionalInstructions}` : ''}. Ensure text is clear and prominent, including only the couple's names, Save The Date, event date, and location.`;
  }
}

async function generateImages(
  prompt: string,
  num_images: number = 4
): Promise<string[]> {
  const headers = {
    'Api-Key': process.env.IDEOGRAM_API_KEY!,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  } as const;

  try {
    const response = await fetch('https://api.ideogram.ai/generate', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        image_request: {
          model: 'V_2',
          style: 'DESIGN',
          prompt: prompt,
          width: 1024,
          height: 1024,
          num_images: num_images 
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(`Ideogram API error: ${JSON.stringify(data, null, 2)}`);
    }

    if (!data?.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response format');
    }

    const imageUrls = data.data
      .filter((item: any) => item?.url)
      .map((item: any) => item.url);

    if (imageUrls.length === 0) {
      throw new Error('No valid image URLs in response');
    }

    return imageUrls;
  } catch (error) {
    console.error('Error in generateImages:', error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const supabase = createPagesServerClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Credit check
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', session.user.id)
      .single();

    if (userError) throw userError;
    if (userData.credits < 2) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    const {
      event_type,
      theme,
      couple_name,
      event_date,
      event_location,
      photo_url,
      additional_instructions,
    } = req.body;

    // Build the initial prompt
    let initialPrompt = `Create a ${theme} themed ${event_type} invitation card for ${couple_name} on ${event_date} at ${event_location}.`;
    if (photo_url) {
      initialPrompt += ` Incorporate design elements inspired by this reference image: ${photo_url}.`;
    }

    // Enhance the prompt with any additional instructions
    const enhancedPrompt = await enhancePrompt(
      initialPrompt,
      additional_instructions
    );

    // Generate the images
    const image_urls = await generateImages(enhancedPrompt);

    // Update credits
    const { data: updatedCredits, error: creditError } = await supabase.rpc(
      'decrement_credits',
      {
        p_user_id: session.user.id,
      }
    );

    if (creditError) throw creditError;

    res.status(200).json({ image_urls, remainingCredits: updatedCredits });
  } catch (err) {
    console.error('Error details:', err);
    res.status(500).json({
      message:
        err instanceof Error ? err.message : 'An unexpected error occurred',
    });
  }
}
