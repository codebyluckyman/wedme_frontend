'use client';

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import { ActivityItem } from '@/utils/activity';
import axios from 'axios';
import { Menu as MenuIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const WeddingRingsLogo = () => (
  <svg
    width='32'
    height='32'
    viewBox='0 0 32 32'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <circle
      cx='13'
      cy='16'
      r='6'
      stroke='currentColor'
      strokeWidth='2'
      className='text-primary/80'
      fill='none'
    />
    <circle
      cx='19'
      cy='16'
      r='6'
      stroke='currentColor'
      strokeWidth='2'
      className='text-primary'
      fill='none'
    />
  </svg>
);

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface SuggestionCard {
  title: string;
  query: string;
}

const SuggestionCard: React.FC<{
  card: SuggestionCard;
  onClick: (query: string) => void;
}> = ({ card, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className='bg-white rounded-2xl shadow-lg shadow-purple-100/50 p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer'
    onClick={() => onClick(card.query)}
  >
    <div className='space-y-4'>
      <h3 className='text-xl font-semibold text-primary'> {card.title} </h3>
      <p className='text-gray-600 text-sm'> {card.query} </p>
    </div>
  </motion.div>
);

export default function VenueSearch() {
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  const suggestionCards: SuggestionCard[] = [
    {
      title: 'Find Venues',
      query: 'Find me venues in Manhattan, NYC with my budget of $10,000',
    },
    { title: 'Find Florists', query: 'Find me the best florists in NYC' },
    { title: 'Find DJs', query: 'Find me the best DJs in California' },
    {
      title: 'Find Makeup Artists',
      query: 'Find me the best makeup artists in Miami',
    },
  ];

  useEffect(() => {
    fetchRecentActivity();
    const intervalId = setInterval(fetchRecentActivity, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const fetchRecentActivity = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/recent-activity?t=${Date.now()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recent activity');
      }
      const data = await response.json();
      setRecentActivity(data.activities);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  useEffect(() => {
    fetchRemainingCredits();
  }, []);

  const fetchRemainingCredits = async () => {
    try {
      const response = await fetch('/api/credits');
      if (!response.ok) {
        throw new Error('Failed to fetch credits');
      }
      const data = await response.json();
      setRemainingCredits(data.credits);
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChatSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    await sendMessage(chatInput);
  };

  const redirectToStripeCheckout = async () => {
    try {
      const response = await fetch('/api/credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'create_checkout_session' }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          'Error response:',
          response.status,
          response.statusText,
          errorData
        );
        throw new Error(
          `Failed to create checkout session: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      if (!data.url) {
        console.error('No URL in response:', data);
        throw new Error('No checkout URL received');
      }

      window.location.href = data.url;
    } catch (error) {
      console.error('Error redirecting to Stripe:', error);
      setError(
        'An error occurred while trying to redirect to checkout. Please try again.'
      );
      setOpenSnackbar(true);
    }
  };

  const sendMessage = async (message: string): Promise<void> => {
    const newUserMessage: ChatMessage = { role: 'user', content: message };
    setChatMessages(prev => [...prev, newUserMessage]);
    setChatInput('');

    setLoading(true);
    try {
      if (remainingCredits === null || remainingCredits <= 0) {
        throw new Error('Insufficient credits');
      }
      const response = await axios.post<{ answer: string; chatId: string }>(
        '/api/searchvenues',
        {
          message,
          chatId,
          history: chatMessages,
          top_k: 3,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const formattedAnswer = response.data.answer.replace(
        /\n\d+\.\s/g,
        '\n\n'
      );

      const newAssistantMessage: ChatMessage = {
        role: 'assistant',
        content: formattedAnswer,
      };
      setChatMessages(prev => [...prev, newAssistantMessage]);
      setChatId(response.data.chatId);
      fetchRemainingCredits(); // Update credits after successful message
    } catch (error) {
      console.error('Error in chat:', error);
      if (error instanceof Error && error.message === 'Insufficient credits') {
        setError('Insufficient credits. Would you like to purchase more?');
        setOpenSnackbar(true);
        // Optionally, you can automatically redirect to Stripe checkout here
        // redirectToStripeCheckout();
      } else {
        setError('An error occurred while processing your request.');
        setOpenSnackbar(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (query: string) => {
    sendMessage(query);
  };

  const handleResetChat = () => {
    setChatMessages([]);
    setChatId(null);
  };

  const formatAssistantMessage = (content: string) => {
    const lines = content.split('\n\n');
    return (
      <div>
        {lines.map((line, index) => (
          <p key={index} className='mb-2'>
            {line.trim()}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 w-full'>
      <div className='flex-1 min-h-screen'>
        <div className={`transition-all duration-300 ease-in-out`}>
          {/* Updated Header */}
          {/* <div className='sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-purple-100 shadow-sm'>
            <header className='py-4 px-8'>
              <div className='max-w-7xl mx-auto flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <h1 className='text-3xl font-serif text-purple-900'>
                    wedme.ai
                  </h1>
                  <WeddingRingsLogo />
                </div>
                {remainingCredits !== null && (
                  <div className='bg-purple-100 px-6 py-2 rounded-full'>
                    <p className='text-sm font-medium text-purple-700'>
                      Available Credits:{' '}
                      <span className='font-bold'>{remainingCredits}</span>
                    </p>
                  </div>
                )}
              </div>
            </header>
          </div> */}

          {/* Title Section */}
          <div className='max-w-7xl mx-auto px-8 pt-8'>
            <div className='bg-purple-900 rounded-3xl shadow-lg overflow-hidden'>
              <div className='px-8 py-12'>
                <h2 className='text-4xl font-serif text-white mb-4'>
                  Vendor Search Assistant
                </h2>
                <p className='text-purple-100 text-lg max-w-2xl'>
                  Find and connect with the perfect vendors for your special day
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className='max-w-7xl mx-auto p-8'>
            {/* Chat Section */}
            <div className='bg-white rounded-2xl shadow-lg border border-purple-100 p-6 mb-8'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-semibold text-purple-900'>
                  Chat with Wedme Assistant
                </h2>
                <div className='flex items-center'>
                  <span
                    className={`h-3 w-3 rounded-full mr-2 ${
                      chatId ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                  <span className='text-sm text-gray-600'>
                    {chatId ? 'Memory Active' : 'No Memory'}
                  </span>
                  <button
                    onClick={handleResetChat}
                    className='ml-4 px-4 py-2 bg-purple-600 text-white text-sm rounded-full hover:bg-purple-700 transition-colors duration-200'
                  >
                    Reset Chat
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className='h-96 overflow-y-auto mb-4 p-4 border border-purple-100 rounded-lg bg-purple-50'>
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      msg.role === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block p-4 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-white text-purple-900 shadow-sm'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <p>{msg.content}</p>
                      ) : (
                        formatAssistantMessage(msg.content)
                      )}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleChatSubmit} className='flex gap-2 mb-6'>
                <input
                  type='text'
                  placeholder='Ask about vendors...'
                  className='flex-grow px-6 py-3 border border-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-900 bg-purple-50'
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                />
                <button
                  type='submit'
                  disabled={loading}
                  className='px-8 py-3 bg-purple-900 text-white rounded-full hover:bg-purple-800 transition-colors duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl'
                >
                  {loading ? (
                    <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      />
                    </svg>
                  ) : (
                    'Send'
                  )}
                </button>
              </form>

              {/* Suggestion Cards */}
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {suggestionCards.map((card, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className='bg-purple-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-purple-100'
                    onClick={() => handleSuggestionClick(card.query)}
                  >
                    <div className='space-y-3'>
                      <h3 className='text-xl font-semibold text-purple-900'>
                        {card.title}
                      </h3>
                      <p className='text-purple-600 text-sm'>{card.query}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Snackbar */}
      {openSnackbar && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className='fixed bottom-4 right-4 bg-purple-900 text-white px-6 py-3 rounded-full shadow-lg z-50'
        >
          {error}
          {error.includes('Insufficient credits') && (
            <button
              onClick={redirectToStripeCheckout}
              className='ml-4 bg-white text-purple-900 px-4 py-2 rounded-full hover:bg-purple-100 transition-colors duration-200'
            >
              Purchase Credits
            </button>
          )}
          <button
            onClick={() => setOpenSnackbar(false)}
            className='ml-2 text-white hover:text-purple-200 focus:outline-none'
          >
            <span className='sr-only'>Close</span>×
          </button>
        </motion.div>
      )}
    </div>
  );
}
