import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { vendorType, budget, location } = req.body;

      const userInput = `Generate a list of vendors for ${vendorType} within a budget of ${budget} in ${location}. Include the name of the vendor and a short description. Please include links from where the descriptions are curated, and contact information of vendors`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userInput }],
      });

      const messageContent = response.choices[0]?.message?.content || '';
      const vendors = messageContent.split('\n');
      const vendorList = vendors
        .filter(vendor => vendor.trim())
        .map(vendor => {
          const parts = vendor.split(':', 1);
          return parts.length === 2
            ? { name: parts[0].trim(), description: parts[1].trim() }
            : { name: parts[0].trim(), description: '' };
        });

      res.status(200).json({ response: vendorList });
    } catch (error: unknown) {
      console.error(
        `Exception: ${error instanceof Error ? error.message : String(error)}`
      );
      res
        .status(500)
        .json({ message: 'Error: Unable to process your request' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
