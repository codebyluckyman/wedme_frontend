import { NextApiRequest, NextApiResponse } from 'next';
import { Pinecone } from '@pinecone-database/pinecone';
import { pipeline } from '@xenova/transformers';
import OpenAI from 'openai';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { v4 as uuidv4 } from 'uuid';

// Define types
interface ChatRequest {
  message: string;
  chatId?: string;
  history?: ChatMessage[];
  top_k?: number;
}

interface ChatResponse {
  answer: string;
  chatId: string;
  remainingCredits?: number;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Initialize the feature-extraction pipeline
let embeddingPipeline: any;

// Initialize Pinecone client
const pinecone = new Pinecone();

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// In-memory storage for chat histories (replace with a database in production)
const chatHistories: { [chatId: string]: ChatMessage[] } = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const supabase = createPagesServerClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Check if user has enough credits
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', session.user.id)
      .single();

    if (userError) throw userError;
    if (userData.credits <= 0) {
      return res.status(400).json({ error: 'Insufficient credits' });
    }
    // Initialize the embedding pipeline if it hasn't been initialized yet
    if (!embeddingPipeline) {
      embeddingPipeline = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2'
      );
    }

    // Parse the request body
    const data = req.body as ChatRequest;
    console.log('Received data:', data);
    const { message, chatId: requestChatId, history, top_k } = data;

    if (!message) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const topK = top_k || 3;
    let chatId = requestChatId || uuidv4();

    console.log(
      `Processing message: "${message}", chat_id: ${chatId}, top_k: ${topK}`
    );

    // Retrieve or initialize chat history
    let chatHistory = chatHistories[chatId] || [];
    if (history) {
      chatHistory = [...history];
    }

    // Generate query embedding using the pipeline
    const output = await embeddingPipeline(message, {
      pooling: 'mean',
      normalize: true,
    });
    const queryEmbedding = Array.from(output.data) as number[];
    console.log(`Generated embedding of length: ${queryEmbedding.length}`);

    // Get the Pinecone index
    const indexName = process.env.PINECONE_INDEX_NAME;
    if (!indexName) {
      throw new Error(
        'PINECONE_INDEX_NAME is not set in environment variables'
      );
    }
    const index = pinecone.Index(indexName);

    // Query the Pinecone index
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK: topK,
      includeMetadata: true,
    });

    console.log(
      `Received ${queryResponse.matches.length} matches from Pinecone`
    );

    // Prepare context from retrieved venues
    const vendorContext = queryResponse.matches
      .map(
        match => `
      Name: ${match.metadata?.name ?? 'N/A'}
      City: ${match.metadata?.city ?? 'N/A'}
      State: ${match.metadata?.state ?? 'N/A'}
      Capacity: ${match.metadata?.min_capacity ?? 'N/A'} - ${match.metadata?.max_capacity ?? 'N/A'}
      Starting Price: $${match.metadata?.starting_price_dollars ?? 'N/A'}
      Description: ${match.metadata?.description ?? 'No description available'}
    `
      )
      .join('\n\n');

    // Prepare messages for OpenAI, including chat history
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content:
          'You are a helpful assistant that is great at finding vendors for different wedding services.',
      },
      { role: 'user', content: `Vendor Information:\n${vendorContext}` },
      ...chatHistory,
      { role: 'user', content: message },
    ];

    // Generate response using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    const answer =
      completion.choices[0].message.content ??
      'Sorry, I could not generate a response.';

    // Update chat history
    chatHistory.push({ role: 'user', content: message });
    chatHistory.push({ role: 'assistant', content: answer });
    chatHistories[chatId] = chatHistory;

    const { data: updatedCredits, error: creditError } = await supabase.rpc(
      'decrement_credits',
      {
        p_user_id: session.user.id,
      }
    );

    if (creditError) throw creditError;
    // Deduct credits
    console.log(`Generated answer: "${answer}"`);
    return res.status(200).json({ answer, chatId });
  } catch (error) {
    console.error(`Error in chat handler:`, error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
}
