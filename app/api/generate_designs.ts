import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import Replicate from 'replicate';
import { OpenAI } from 'openai';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'; // Updated helper
import { createClient } from '@supabase/supabase-js';

// Set up multer for file uploads
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// Set up multer for in-memory storage
export const config = {
  api: {
    bodyParser: false, // Disable body parser to handle file uploads
  },
  maxDuration: 300,
};
// Set up multer for in-memory storage (no disk access required)// Set up multer for in-memory storage (no disk access required)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to handle file upload (Multer)
const uploadMiddleware = upload.single('room-image');

// Helper to run middleware
const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      resolve(result);
    });
  });
};

// Add a custom type that extends NextApiRequest to include the file property from Multer
type NextApiRequestWithFile = NextApiRequest & {
  file: Express.Multer.File; // Add file property for Multer uploads
};

async function streamToBase64(stream: ReadableStream) {
  const response = new Response(stream);
  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();
  return `data:image/png;base64,${Buffer.from(buffer).toString('base64')}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createPagesServerClient({ req, res }); // Updated Supabase helper
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Initialize a separate Supabase client for storage
  const supabaseStorageClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (req.method === 'POST') {
    try {
      // Use the middleware to handle file upload
      await runMiddleware(req, res, uploadMiddleware);

      const {
        'event-type': eventType,
        'event-theme': eventTheme,
        'color-scheme': colorScheme,
        'text-prompt': textPrompt,
      } = req.body;
      let imageUrls: string[] = [];

      // Check if user has enough credits
      const { data: creditData, error: creditError } = await supabase
        .from('users')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (creditError || !creditData || creditData.credits < 1) {
        return res.status(403).json({ message: 'Error: Insufficient credits' });
      }

      const reqWithFile = req as NextApiRequestWithFile;

      if (reqWithFile.file) {
        // Generate a unique file name for the uploaded image
        const fileName = `uploads/${Date.now()}-${reqWithFile.file.originalname}`;

        // Upload the file to Supabase Storage
        console.log('Uploading file to Supabase Storage...');
        const { data: uploadData, error: uploadError } =
          await supabaseStorageClient.storage
            .from(process.env.SUPABASE_STORAGE_BUCKET!)
            .upload(fileName, reqWithFile.file.buffer, {
              contentType: reqWithFile.file.mimetype,
            });

        if (uploadError) {
          console.error('Error during upload:', uploadError);
          return res
            .status(500)
            .json({ error: 'Error uploading file to Supabase Storage.' });
        }

        console.log('File uploaded successfully:', uploadData);

        // Get the public URL of the uploaded image
        const { data: publicUrlData } = supabaseStorageClient.storage
          .from(process.env.SUPABASE_STORAGE_BUCKET!)
          .getPublicUrl(fileName);

        if (!publicUrlData) {
          // Handle the case where publicUrlData is undefined
          throw new Error('Failed to retrieve public URL');
        }
        const publicUrl = publicUrlData.publicUrl;
        console.log('Public URL generated:', publicUrl);

        // Now, you have the public URL to the image
        const prompt = `a ${colorScheme} ${eventTheme} ${eventType}`;
        const input = {
          image: publicUrl, // Use the Supabase image URL
          prompt: prompt,
          num_samples: '4',
        };

        // Call the Replicate API
        const output = (await replicate.run(
          'jagilley/controlnet-hough:854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b',
          { input }
        )) as ReadableStream[];
        const outputData = await Promise.all(
          output.map(stream => streamToBase64(stream))
        );
        imageUrls = outputData;

        // Ensure imageUrls is valid before using .slice()
        if (!imageUrls || imageUrls.length === 0) {
          return res
            .status(500)
            .json({ error: 'No images generated by Replicate.' });
        }
      } else if (textPrompt) {
        // Handle text input using DALL-E
        const response = await openai.images.generate({
          model: 'dall-e-3',
          prompt: textPrompt,
          size: '1024x1024',
          quality: 'standard',
          n: 1, // Generate 1 image
        });

        imageUrls = response.data.map((img: any) => img.url);
      } else {
        return res
          .status(400)
          .json({ error: 'No image or text prompt provided.' });
      }

      // Decrement user's credits
      const { error: updateError } = await supabase.rpc('decrement_credits', {
        p_user_id: user.id,
      });

      if (updateError) {
        console.error('Error updating credits:', updateError);
        return res
          .status(500)
          .json({ message: 'Error: Unable to update credits' });
      }

      // Send the generated images back as HTML
      res.send({
        image_urls: reqWithFile.file ? imageUrls.slice(1) : imageUrls,
      });
    } catch (error) {
      console.error('Error generating render:', error);
      res.status(500).send('Error generating render.');
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
