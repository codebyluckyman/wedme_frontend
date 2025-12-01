import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Add the runtime directive for edge compatibility
export const runtime = 'edge';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Enhances a prompt for image generation using OpenAI
 */
async function enhancePrompt(
  initialPrompt: string,
  coupleNames?: string,
  eventDate?: string,
  location?: string,
  additionalInstructions?: string
): Promise<string> {
  try {
    // Insert user details into the initial prompt
    let userDetailsPrompt = initialPrompt;

    // Add couple names if available
    if (coupleNames) {
      // Split names to get individual bride/groom names if available
      const nameParts = coupleNames.split(' and ');
      const brideName = nameParts[0] || '';
      const groomName = nameParts[1] || '';

      userDetailsPrompt = userDetailsPrompt
        .replace(/\[Couple['']?s? Names\]/gi, coupleNames)
        .replace(/\[Names\]/gi, coupleNames)
        .replace(/\[Bride and Groom\]/gi, coupleNames)
        .replace(/\[Bride['']?s? Name\]/gi, brideName)
        .replace(/\[Groom['']?s? Name\]/gi, groomName);
    }

    // Add event date if available
    if (eventDate && eventDate.trim() !== '') {
      userDetailsPrompt = userDetailsPrompt
        .replace(/\[Wedding Date\]/gi, eventDate)
        .replace(/\[Date\]/gi, eventDate)
        .replace(/\[Bridal Shower Date\]/gi, eventDate)
        .replace(/\[Event Date\]/gi, eventDate);
    } else {
      // If no date provided, replace date placeholders with a generic phrase
      userDetailsPrompt = userDetailsPrompt
        .replace(/\[Wedding Date\]/gi, 'the wedding date')
        .replace(/\[Date\]/gi, 'the event date')
        .replace(/\[Bridal Shower Date\]/gi, 'the bridal shower date')
        .replace(/\[Event Date\]/gi, 'the event date');
    }

    // Add location if available
    if (location) {
      userDetailsPrompt = userDetailsPrompt
        .replace(/\[Location\]/gi, location)
        .replace(/\[Venue\]/gi, location)
        .replace(/\[Address\]/gi, location);
    }

    // Create a base prompt that includes user details and any additional instructions
    const basePrompt = `${userDetailsPrompt}${additionalInstructions ? `\nAdditional design requirements: ${additionalInstructions}` : ''}`;

    // Call OpenAI to enhance the prompt
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
          "Create an [style] [event_type] invitation with [detailed design elements]. The design should prominently display '[couple_name]' in [font style] at [position], with 'Save The Date', '[event_date]', and '[event_location]' arranged [layout description]. [Additional design elements]. [Any specified additional instructions]. Ensure all text is clear and readable, with no additional text elements. Please remove all unwanted text"`,
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
    console.log('Enhanced prompt:', enhancedPrompt);
    return enhancedPrompt;
  } catch (error) {
    console.error('Error in prompt enhancement:', error);

    // Create a fallback prompt if enhancement fails
    let fallbackPrompt = `Create a professional invitation card design`;

    if (coupleNames) {
      fallbackPrompt += ` for ${coupleNames}`;
    }

    if (eventDate) {
      fallbackPrompt += ` on ${eventDate}`;
    }

    if (location) {
      fallbackPrompt += ` at ${location}`;
    }

    if (additionalInstructions) {
      fallbackPrompt += `. Additional design details: ${additionalInstructions}`;
    }

    fallbackPrompt += `. Ensure text is clear and prominent, including only the couple's names, Save The Date, event date, and location.`;

    return fallbackPrompt;
  }
}

export async function POST(request: Request) {
  try {
    const {
      imageUrl,
      prompt,
      aspectRatio = 'ASPECT_1_1',
      imageWeight = 50,
      coupleNames,
      eventDate,
      location,
      additionalInstructions,
    } = await request.json();

    // Validate required inputs - only imageUrl is truly required
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Get the Ideogram API key from environment variables
    const ideogramApiKey = process.env.IDEOGRAM_API_KEY;
    if (!ideogramApiKey) {
      return NextResponse.json(
        { error: 'Ideogram API key not configured' },
        { status: 500 }
      );
    }

    // Enhance the prompt if OpenAI API key is available
    let finalPrompt = prompt;
    if (process.env.OPENAI_API_KEY) {
      try {
        finalPrompt = await enhancePrompt(
          prompt,
          coupleNames,
          eventDate,
          location,
          additionalInstructions
        );
        console.log('Using enhanced prompt for image generation:', finalPrompt);

        // Do additional replacements on the enhanced prompt to catch any remaining placeholders
        if (coupleNames) {
          finalPrompt = finalPrompt
            .replace(/\[Couple['']?s? Names\]/gi, coupleNames)
            .replace(/\[Names\]/gi, coupleNames)
            .replace(/\[Bride and Groom\]/gi, coupleNames)
            .replace(/\[Bride['']?s? Name\]/gi, coupleNames.split(' and ')[0])
            .replace(
              /\[Groom['']?s? Name\]/gi,
              coupleNames.split(' and ')[1] || ''
            );
        }

        if (eventDate) {
          finalPrompt = finalPrompt
            .replace(/\[Wedding Date\]/gi, eventDate)
            .replace(/\[Date\]/gi, eventDate)
            .replace(/\[Bridal Shower Date\]/gi, eventDate)
            .replace(/\[Event Date\]/gi, eventDate);
        }

        if (location) {
          finalPrompt = finalPrompt
            .replace(/\[Location\]/gi, location)
            .replace(/\[Venue\]/gi, location)
            .replace(/\[Address\]/gi, location);
        }
      } catch (enhanceError) {
        console.error(
          'Failed to enhance prompt, using original:',
          enhanceError
        );
        // Continue with the original prompt if enhancement fails
      }
    } else {
      console.log('OpenAI API key not found, using original prompt');
    }

    // First, we need to download the image
    console.log('Downloading image from URL:', imageUrl);
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch image from URL' },
        { status: 400 }
      );
    }

    // Get the image as an ArrayBuffer and convert to Blob
    const imageArrayBuffer = await imageResponse.arrayBuffer();
    const imageBlob = new Blob([imageArrayBuffer]);

    // Create a FormData object exactly as in the example
    const formData = new FormData();

    // Create image_request JSON string according to the example
    const imageRequestStr = JSON.stringify({
      prompt: finalPrompt,
      aspect_ratio: aspectRatio,
      image_weight: imageWeight,
      magic_prompt_option: 'ON',
      model: 'V_2',
    });

    // Add the parameters exactly as in the example
    formData.append('image_request', imageRequestStr);
    formData.append('image_file', imageBlob, 'image.jpg');

    console.log('Calling Ideogram Remix API with parameters:', {
      prompt: finalPrompt.substring(0, 100) + '...', // Log truncated prompt
      aspect_ratio: aspectRatio,
      image_weight: imageWeight,
    });

    // Call the Ideogram Remix API exactly as in the example
    const options = {
      method: 'POST',
      headers: {
        'Api-Key': ideogramApiKey,
        // Let browser set the multipart/form-data content-type with boundary
      },
      body: formData,
    };

    const response = await fetch('https://api.ideogram.ai/remix', options);

    // Get response as text first to help with debugging
    const responseText = await response.text();

    if (!response.ok) {
      console.error('Ideogram API error status:', response.status);
      console.error(
        'Ideogram API error response:',
        responseText.substring(0, 200)
      );
      return NextResponse.json(
        {
          error: `Failed to call Ideogram API: ${response.status} ${responseText.substring(0, 200)}`,
        },
        { status: response.status }
      );
    }

    // Try to parse the response as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error(
        'Failed to parse Ideogram API response as JSON:',
        responseText.substring(0, 500)
      );
      return NextResponse.json(
        { error: 'Invalid response from Ideogram API' },
        { status: 500 }
      );
    }

    console.log('Ideogram response structure:', Object.keys(data));
    console.log(
      'Full response (truncated):',
      JSON.stringify(data).substring(0, 500)
    );

    // Extract image URLs based on Ideogram's response structure
    let imageUrls = [];

    if (data.images && Array.isArray(data.images)) {
      imageUrls = data.images;
    } else if (data.data && Array.isArray(data.data)) {
      imageUrls = data.data
        .map((item: any) => item.url || item.image_url)
        .filter(Boolean);
    } else if (data.results && Array.isArray(data.results)) {
      imageUrls = data.results
        .map((item: any) => item.image_url)
        .filter(Boolean);
    } else if (data.generations && Array.isArray(data.generations)) {
      imageUrls = data.generations
        .map((item: any) => item.image_url)
        .filter(Boolean);
    }

    if (imageUrls.length === 0) {
      console.warn(
        'No images found in response:',
        JSON.stringify(data).substring(0, 500)
      );
      return NextResponse.json(
        { error: 'No remixed images were generated' },
        { status: 500 }
      );
    }

    console.log(`Found ${imageUrls.length} remixed images in response`);

    return NextResponse.json({
      success: true,
      variations: imageUrls,
      prompt: finalPrompt,
      enhancedPrompt: finalPrompt !== prompt, // Flag to indicate if enhancement was used
    });
  } catch (error) {
    console.error('Error in Ideogram Remix API route:', error);
    return NextResponse.json(
      {
        error:
          'Internal server error: ' +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}
