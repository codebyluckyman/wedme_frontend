'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';

// Define types
type CardType = 'all' | string;
type CardItem = {
  id: string;
  image_url: string;
  type: string;
  prompt: string;
};
type CardCategory = {
  type: string;
  title: string;
  cards: CardItem[];
};

export default function GenerateCards() {
  const router = useRouter();
  const supabase = createClient();
  const [type, setType] = useState<CardType>('all');
  const [cardData, setCardData] = useState<CardCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        const { data: cards, error: cardError } = await supabase
          .from('wedding_card')
          .select(`*, type:wedding_card_type(*)`);

        if (cardError) throw cardError;

        if (!cards || cards.length === 0) {
          setError('No cards found.');
          setCardData([]);
          return;
        }

        const groupedCards = cards.reduce(
          (acc: Record<string, CardCategory>, card) => {
            if (!card.type || !card.type.type) {
              console.warn(
                `Card with id ${card.id} has a missing or invalid type relation.`
              );
              return acc;
            }

            const cardType = card.type.type;
            if (!acc[cardType]) {
              acc[cardType] = {
                type: cardType,
                title: cardType
                  .replace('_', ' ')
                  .replace(/\b\w/g, (c: any) => c.toUpperCase()),
                cards: [],
              };
            }
            acc[cardType].cards.push({
              id: card.id,
              image_url: card.image_url,
              type: cardType,
              prompt: card.prompt,
            });
            return acc;
          },
          {}
        );

        const formattedData = Object.values(groupedCards);

        setCardData(formattedData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load card data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredData =
    type === 'all'
      ? cardData
      : cardData.filter(category => category.type === type);

  if (isLoading) {
    return (
      <div className='w-full'>
        <div className='flex flex-wrap items-center justify-between mb-8 border-b py-2 mx-4 sm:mx-8'>
          <div className='flex flex-wrap items-center gap-3'>
            <div className='px-3 py-2 bg-gray-200 rounded-full animate-pulse w-16'></div>
            <div className='px-4 py-2 bg-gray-200 rounded-full animate-pulse w-24'></div>
            <div className='px-4 py-2 bg-gray-200 rounded-full animate-pulse w-32'></div>
            <div className='px-4 py-2 bg-gray-200 rounded-full animate-pulse w-32'></div>
          </div>
        </div>
        <div className='m-4 sm:m-8'>
          <div className='flex justify-between items-center mb-6'>
            <div className='h-6 bg-gray-200 rounded w-32 animate-pulse'></div>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className='relative rounded-md overflow-hidden bg-gray-200 aspect-[3.5/5] animate-pulse'
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-full flex flex-col items-center justify-center p-4 sm:p-8'>
        <h2 className='text-lg sm:text-xl font-semibold text-red-600 mb-4'>
          Error Loading Cards
        </h2>
        <p className='text-gray-700 mb-4'>{error}</p>
        <button
          className='px-4 sm:px-6 py-2 bg-purple-600 text-white rounded-sm hover:bg-purple-700'
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <div className='flex flex-wrap items-center justify-between mb-8 border-b py-2 mx-4 sm:mx-8'>
        <div className='flex overflow-x-auto items-center gap-3'>
          <button
            className={`px-4 py-2 ${
              type === 'all' && 'rounded-full bg-purple-600 text-white'
            } text-sm`}
            onClick={() => setType('all')}
          >
            All
          </button>
          {cardData.map(category => (
            <button
              key={category.type}
              className={`px-4 py-2 ${
                type === category.type &&
                'rounded-full bg-purple-600 text-white'
              } text-sm whitespace-nowrap`}
              onClick={() => setType(category.type)}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>
      {filteredData.map((category, key) => (
        <div className='m-4 sm:m-8' key={key}>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-md sm:text-lg font-semibold text-gray-900'>
              {category?.title}
            </h2>
          </div>
          <div className='overflow-x-auto'>
            <div className='flex space-x-4'>
              {category?.cards.map(card => (
                <div
                  key={card.id}
                  className={`relative rounded-md overflow-hidden group bg-white shadow-sm hover:shadow-md transition-all duration-300 flex-none ${
                    category?.title === 'Save Date'
                      ? 'w-60 aspect-square'
                      : 'w-44 aspect-[3.5/5]'
                  }`}
                >
                  <img
                    src={card.image_url || '/placeholder.svg'}
                    alt={category?.title || 'Wedding card'}
                    className='absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100 group-hover:via-black/60 transition-all duration-300' />

                  <div className='relative z-10 flex flex-col items-center justify-center flex-grow h-full'>
                    <button
                      className='mb-3 px-4 sm:px-6 py-2 bg-purple-600 text-white text-sm rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-purple-700'
                      onClick={() => router.push(`wedding-cards/${card.id}`)}
                    >
                      Remix it
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
