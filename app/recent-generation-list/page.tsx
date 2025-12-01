'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, Clock, Download, Loader2, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/app/utils/supabase/client';
import { useAuthStore } from '@/app/store/authStore';
import { useRouter } from 'next/navigation';
import { handleSaveImage } from '../utils/image_download';

type CardType = 'all' | string;

type CardItem = {
  id: string;
  image_url: string;
  type: string;
  prompt: string;
  created_at: string;
  card_type: number;
};

type CardCategory = {
  type: string;
  title: string;
  cards: CardItem[];
};

export default function RecentGenerationsList() {
  const { user } = useAuthStore();
  const router = useRouter();
  const supabase = createClient();
  const [activeType, setActiveType] = useState<CardType>('all');
  const [cardData, setCardData] = useState<CardCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;

      setIsLoading(true);
      setError(null);

      try {
        const { data: cards, error: cardError } = await supabase
          .from('recent_generations')
          .select(`*, type:wedding_card_type(*)`)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

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
              created_at: card.created_at,
              card_type: card.card_type,
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
  }, [user?.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const filteredData =
    activeType === 'all'
      ? cardData
      : cardData.filter(category => category.type === activeType);

  const cardTypes = [
    { id: 'all', label: 'All' },
    ...cardData.map(category => ({
      id: category.type,
      label: category.title,
    })),
  ];

  if (isLoading) {
    return (
      <div className='min-h-[80vh] w-full flex flex-col items-center justify-center p-6'>
        <div className='relative'>
          <Loader2 className='h-12 w-12 animate-spin text-primary mb-4' />
          <div className='absolute inset-0 h-12 w-12 animate-ping rounded-full bg-primary/20'></div>
        </div>
        <p className='text-muted-foreground text-lg mt-4'>
          Loading your recent generations...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-[80vh] flex flex-col items-center justify-center p-8 text-center w-full'>
        <div className='bg-muted/30 rounded-full p-6 mb-6'>
          <ImageIcon className='h-12 w-12 text-muted-foreground' />
        </div>
        <h2 className='text-2xl font-semibold mb-3'>No Generations Found</h2>
        <p className='text-muted-foreground max-w-md mb-8'>{error}</p>
        <Link
          href='/wedding-cards'
          className='px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2'
        >
          <ImageIcon className='h-4 w-4' />
          Create Your First Card
        </Link>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-7xl'>
      <div className='flex items-center justify-between mb-8 sm:space-y-4 space-y-0'>
        <Link
          href='/wedding-cards'
          className='inline-flex items-center text-muted-foreground hover:text-foreground transition-colors'
        >
          <ChevronLeft className='md:h-4 md:w-4 h-3 w-3 mr-1' />
          Back to Home
        </Link>
        <h1 className='md:text-2xl text-xl font-bold text-center sm:text-left'>
          Recent Generations
        </h1>
        <div className='lg:w-24 w-0'></div>
      </div>

      <div className='mb-8 overflow-x-auto pb-2'>
        <div className='flex space-x-2 min-w-max'>
          {cardTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeType === type.id
                  ? 'bg-[#6B21A8] text-white shadow-md shadow-[#6B21A8]/20'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className='text-center py-12 w-full'>
          <p className='text-muted-foreground'>
            No generations found for this category.
          </p>
        </div>
      ) : (
        <div className='space-y-12 overflow-x-auto'>
          {filteredData.map((category, index) => (
            <div key={index} className='space-y-4'>
              <h2 className='text-xl font-semibold border-b border-muted/40 pb-2 flex items-center'>
                <span className='bg-[#6B21A8]/10 text-[#6B21A8] rounded-full w-8 h-8 inline-flex items-center justify-center mr-2'>
                  {category.title.charAt(0)}
                </span>
                {category.title}
              </h2>

              <div className='flex space-x-6 overflow-x-auto'>
                {category.cards.map(card => {
                  const isSquare = category.type === 'save_date';

                  return (
                    <div
                      key={card.id}
                      className='group bg-white dark:bg-gray-900 rounded-lg overflow-hidden transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl flex-shrink-0'
                      style={{ width: isSquare ? '168px' : '224px' }}
                    >
                      <div
                        className={`relative ${
                          isSquare ? 'aspect-square' : 'aspect-[3/4]'
                        } overflow-hidden`}
                      >
                        <img
                          src={card.image_url || ''}
                          alt={`${category.title} generation`}
                          className='w-full h-full transition-transform duration-500 group-hover:scale-105'
                        />

                        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4'>
                          <div className='text-white space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300'>
                            <div className='flex items-center text-sm'>
                              <Clock className='h-3.5 w-3.5 mr-1.5' />
                              <span>{formatDate(card.created_at)}</span>
                            </div>

                            <div className='flex space-x-2 pt-2'>
                              <button
                                className='flex-1 flex items-center justify-center bg-[#6B21A8] backdrop-blur-sm text-white text-sm py-1.5 rounded hover:bg-[#6B21A8]/80 transition-colors'
                                onClick={() =>
                                  handleSaveImage(card?.image_url, index)
                                }
                              >
                                <Download className='h-3.5 w-3.5 mr-1.5' />
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
