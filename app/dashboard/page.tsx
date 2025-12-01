'use client';

import { useState, useRef, useEffect } from 'react';
import { Heart, Star, ArrowRight, Gift } from 'lucide-react';
import {
  AddIcon,
  AudioIcon,
  BudgetTrackerIcon,
  FileIcon,
  PhotoIcon,
  VenueDesignIcon,
} from '@/components/icons';
import { useRouter } from 'next/navigation';
import { useCreateAssistantRoom } from '@/utils/useCreateAssistantRoom';
import { createClient } from '../utils/supabase/client';
import { useAuthStore } from '../store/authStore';

export default function Home() {
  const router = useRouter();
  const supabase = createClient();
  const { user } = useAuthStore();

  const { handleFirstSubmit } = useCreateAssistantRoom();

  const [showPopover, setShowPopover] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFirstSubmit(inputValue);
    }
  };

  useEffect(() => {
    const fetchOnbodardingData = async () => {
      const { data: userInfoData } = await supabase
        .from('onboarding_userInfo')
        .select('*')
        .eq('id', user?.id)
        .single();

      setUserInfo(userInfoData);
    };
    fetchOnbodardingData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        buttonRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [inputValue]);

  const venues = [
    {
      id: 1,
      image: '/images/trend_1.png',
      location: 'Las Vegas, USA',
      rating: 4.9,
      price: 12200,
      originalPrice: 20000,
      description: 'Luxury Wedding Venue with Panoramic Views',
    },
    {
      id: 2,
      image: '/images/trend_2.png',
      location: 'New York, USA',
      rating: 4.8,
      price: 15000,
      originalPrice: 25000,
      description: 'Historic Manhattan Ballroom',
    },
    {
      id: 3,
      image: '/images/trend_3.png',
      location: 'Miami, USA',
      rating: 4.7,
      price: 9800,
      originalPrice: 15000,
      description: 'Beachfront Wedding Paradise',
    },
    {
      id: 4,
      image: '/images/trend_4.png',
      location: 'Los Angeles, USA',
      rating: 4.9,
      price: 18500,
      originalPrice: 30000,
      description: 'Modern Hollywood Hills Estate',
    },
    {
      id: 5,
      image: '/images/trend_5.png',
      location: 'San Francisco, USA',
      rating: 4.8,
      price: 16300,
      originalPrice: 28000,
      description: 'Bay Area Garden Venue',
    },
  ];

  const categories = [
    {
      icon: <BudgetTrackerIcon />,
      label: 'Budget Tracker',
      prompt: `Plan the budget breakdown for my wedding if my total expendeniture is ${
        userInfo?.estimate_budget
          ? `$${Number(userInfo.estimate_budget.replace(/,/g, '')).toLocaleString()}`
          : 'a flexible budget'
      }`,
    },
    {
      icon: <VenueDesignIcon />,
      label: 'Vendor Search',
      prompt: `Find me vendors based on my total budget expenditure of my wedding of ${
        userInfo?.estimate_budget
          ? `$${Number(userInfo.estimate_budget.replace(/,/g, '')).toLocaleString()}`
          : 'a flexible budget'
      } and the location is ${userInfo?.wedding_location ? userInfo.wedding_location : 'anywhere'}`,
    },
    // {
    //   icon: <MenuPlanningIcon />,
    //   label: 'Menu Planning',
    // },
    // {
    //   icon: <Gift />,
    //   label: 'Wedding card',
    // },
  ];

  const [favorites, setFavorites] = useState<number[]>([]);
  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFirstSubmit(inputValue);
  };

  return (
    <div className='w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10'>
      <div className='mb-12 text-center'>
        <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
          Plan Your Perfect Wedding
        </h1>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
          Expert tools and guidance to create the wedding of your dreams
        </p>
      </div>

      <div className='relative mb-12 max-w-3xl mx-auto'>
        <form
          onSubmit={handleSubmit}
          className='rounded-2xl border border-gray-200 bg-white p-5 shadow-lg transition-shadow duration-300 hover:shadow-xl'
        >
          <div className='mb-3'>
            <textarea
              ref={textareaRef}
              value={inputValue}
              onKeyDown={handleKeyDown}
              onChange={e => setInputValue(e.target.value)}
              placeholder='Tell us about your wedding vision...'
              className='w-full resize-none border-0 bg-transparent p-0 placeholder-gray-400 focus:ring-0 focus:outline-none text-md leading-relaxed transition-all duration-200 max-h-[calc(1.5rem*5)] overflow-y-auto'
              rows={2}
              style={{ border: 'none', outline: 'none' }}
            />
          </div>
          <div className='flex items-center justify-between pt-3 border-t border-gray-100'>
            <div
              className='relative flex items-center w-2/4'
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <button
                type='button'
                ref={buttonRef}
                disabled
                className='rounded-full p-2 text-purple-700 hover:bg-purple-50 transition-colors duration-200 cursor-not-allowed opacity-50'
              >
                <AddIcon />
              </button>
              <button
                type='button'
                disabled
                className='rounded-full p-2 text-purple-700 hover:bg-purple-50 transition-colors duration-200 cursor-not-allowed opacity-50'
              >
                <AudioIcon />
              </button>

              {isHovered && (
                <div className='absolute top-14 left-0 bg-gray-800 text-white w-full z-30 text-sm rounded-md p-2 shadow-lg'>
                  <div className='relative'>
                    <div
                      className='absolute top-0 left-[40px] transform -translate-x-1/2 -translate-y-full w-3 h-3 bg-gray-800 rotate-45'
                      style={{ marginTop: '-0.2.5rem' }}
                    ></div>
                    This feature will be available in the next version. Stay
                    tuned for updates!
                  </div>
                </div>
              )}
            </div>
            <button
              type='submit'
              className='rounded-full bg-purple-700 text-white px-6 py-2.5 hover:bg-purple-800 transition-colors shadow-md hover:shadow-lg text-sm font-medium flex items-center gap-1.5'
              disabled={!inputValue.trim()}
            >
              Ask Assistant
            </button>
          </div>
        </form>

        {showPopover && (
          <div
            ref={popoverRef}
            className='absolute bottom-20 left-0 md:left-10 bg-white rounded-xl shadow-2xl p-3 flex space-x-4 border border-gray-100 animate-in fade-in slide-in-from-bottom duration-300 z-10'
          >
            <button className='flex flex-col items-center p-4 hover:bg-purple-50 rounded-lg transition-colors duration-200'>
              <div className='text-purple-700 mb-2'>
                <PhotoIcon />
              </div>
              <span className='text-sm font-medium text-gray-700'>Photo</span>
            </button>
            <button className='flex flex-col items-center p-4 hover:bg-purple-50 rounded-lg transition-colors duration-200'>
              <div className='text-purple-700 mb-2'>
                <FileIcon />
              </div>
              <span className='text-sm font-medium text-gray-700'>Files</span>
            </button>
          </div>
        )}
      </div>

      <div className='mb-20'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6 px-4'>
          Planning Tools
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 px-4'>
          {categories.map((category, index) => {
            return (
              <div
                key={index}
                className='relative overflow-hidden group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100'
              >
                <div className='p-6 flex flex-col items-center text-center'>
                  <div className='p-3 bg-purple-50 rounded-full mb-4 text-purple-700'>
                    {category.icon}
                  </div>
                  <h3 className='font-semibold text-gray-900'>
                    {category.label}
                  </h3>
                  <p className='text-sm text-gray-500 mt-2'>
                    {category.label === 'Budget Tracker' &&
                      'Plan and monitor your wedding expenses'}
                    {category.label === 'Vendor Search' &&
                      'Find vendors based on your budget'}
                    {category.label === 'Dream Venue' && 
                      'Wedding venue design ideas based on your personalized mood board'}
                    {category.label === 'Menu Planning' &&
                      'Create the perfect wedding menu'}
                    {category.label === 'Wedding card' &&
                      'Design beautiful wedding invitations'}
                  </p>
                  <div>
                    <div className='mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <div className='flex items-center justify-center'>
                        <button
                          className='text-purple-700 font-medium text-sm flex items-center gap-1'
                          onClick={() => handleFirstSubmit(category?.prompt)}
                        >
                          Explore <ArrowRight className='h-4 w-4' />
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

      {/* Top Trends Section - Redesigned */}
      <div className='mb-16'>
        <div className='flex justify-between items-center mb-6 px-4'>
          <h2 className='text-2xl font-bold text-gray-900'>Top Trends</h2>
          <button className='flex items-center space-x-1 text-purple-700 hover:text-purple-800 transition-colors duration-200 font-medium'>
            <span>View all</span>
            <ArrowRight className='h-4 w-4' />
          </button>
        </div>

        <div className='overflow-x-auto px-4'>
          <div className='flex sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
            {venues.map(venue => (
              <div
                key={venue.id}
                className='relative w-full sm:w-auto flex-shrink-0 sm:flex-shrink h-[340px] rounded-xl overflow-hidden group bg-white shadow-md hover:shadow-xl transition-all duration-300'
              >
                <div className='absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 z-10'></div>
                <img
                  src={venue.image || '/placeholder.svg'}
                  alt={venue.location}
                  className='absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700'
                />

                <button
                  className='absolute top-3 right-3 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-200 z-20 shadow-md'
                  onClick={e => {
                    e.preventDefault();
                    toggleFavorite(venue.id);
                  }}
                >
                  <Heart
                    className={`h-5 w-5 transition-colors duration-200 ${
                      favorites.includes(venue.id)
                        ? 'text-red-500 fill-red-500'
                        : 'text-gray-400'
                    }`}
                  />
                </button>

                <div className='absolute bottom-0 left-0 right-0 p-4 bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-200 z-20'>
                  <div className='flex items-center justify-between mb-1'>
                    <span className='font-bold text-gray-900'>
                      {venue.location}
                    </span>
                    <div className='flex items-center space-x-1 bg-yellow-400 text-white rounded-md px-1.5 py-0.5 text-xs'>
                      <Star className='h-3 w-3 fill-white' />
                      <span className='font-medium'>{venue.rating}</span>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span className='font-semibold text-purple-700'>
                      ${venue.price.toLocaleString()}
                    </span>
                    <span className='text-xs line-through text-gray-400'>
                      ${venue.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className='text-xs text-gray-600 mt-1 line-clamp-1'>
                    {venue.description}
                  </p>

                  <button
                    className='w-full mt-2 py-1.5 bg-purple-700 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-purple-800'
                    onClick={() =>
                      handleFirstSubmit(
                        `Tell me more about ${venue.description} in ${venue.location} venue for wedding with $${venue.price} budget`
                      )
                    }
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section - New Addition */}
      <div className='bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 mb-16'>
        <h2 className='text-2xl font-bold text-gray-900 mb-8 text-center'>
          What Our Couples Say
        </h2>

        <div className='overflow-x-auto'>
          <div className='grid grid-flow-col auto-cols-[90%] md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[
              {
                quote:
                  'The planning tools made organizing our big day so much easier. Highly recommend!',
                author: 'Sarah & Michael',
                location: 'Las Vegas Wedding',
              },
              {
                quote:
                  'Found our dream venue through this platform. The virtual tours saved us so much time.',
                author: 'Jessica & David',
                location: 'New York Wedding',
              },
              {
                quote:
                  "The AI wedding assistant gave us ideas we hadn't even thought about. Game changer!",
                author: 'Emma & James',
                location: 'Miami Beach Wedding',
              },
            ].map((testimonial, idx) => (
              <div key={idx} className='bg-white p-6 rounded-xl shadow-md'>
                <div className='text-purple-500 mb-3'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className='inline-block h-4 w-4 fill-yellow-400'
                    />
                  ))}
                </div>
                <p className='text-gray-700 mb-4 italic'>
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className='font-semibold text-gray-900'>
                    {testimonial.author}
                  </p>
                  <p className='text-sm text-gray-500'>
                    {testimonial.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
