'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Heart,
  Crown,
  Flower2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface TemplateItem {
  id: string;
  prompt: string;
  image: string;
}

interface TemplateCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  items: TemplateItem[];
  color: string;
  gradient: string;
}

const templateCategories: TemplateCategory[] = [
  {
    id: 'aisle',
    name: 'Aisle Designs',
    icon: <Heart className='w-5 h-5' />,
    description: 'Elegant walkways for your perfect entrance',
    color: 'rose',
    gradient: 'from-rose-500 to-pink-500',
    items: [
      {
        id: 'aisle1',
        prompt: 'Marble aisle with gold trim',
        image: '/images/aisle_1.png',
      },
      {
        id: 'aisle2',
        prompt: 'Velvet runner with cascading florals',
        image: '/images/aisle_2.png',
      },
      {
        id: 'aisle3',
        prompt: 'Gold-accented aisle, lush floral borders',
        image: '/images/aisle_3.png',
      },
      {
        id: 'aisle4',
        prompt: 'Mirror aisle with white rose petals for a beach wedding',
        image: '/images/aisle_4.png',
      },
    ],
  },
  {
    id: 'backdrop',
    name: 'Backdrops',
    icon: <Crown className='w-5 h-5' />,
    description: 'Stunning ceremony and photo backdrops',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    items: [
      {
        id: 'backdrop1',
        prompt: 'Beige and red floral wall with monogram for a backdrop',
        image: '/images/backdrop_1.png',
      },
      {
        id: 'backdrop2',
        prompt:
          'Traditional Gold and Ivory: A classic Desi wedding backdrop in gold and ivory with rich fabrics and ornate patterns',
        image: '/images/backdrop_2.png',
      },
      {
        id: 'backdrop3',
        prompt: 'Backdrop design based on peacock motif and floral detailing',
        image: '/images/backdrop_3.png',
      },
      {
        id: 'backdrop4',
        prompt: 'All-white roses, crystal chandelier arch backdrop',
        image: '/images/backdrop_4.png',
      },
    ],
  },
  {
    id: 'centerpieces',
    name: 'Center Pieces',
    icon: <Flower2 className='w-5 h-5' />,
    description: 'Exquisite table centerpieces and decorations',
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-500',
    items: [
      {
        id: 'centerpiece1',
        prompt: 'Rose centerpiece with gold accents',
        image: '/images/center_pieces_1.png',
      },
      {
        id: 'centerpiece2',
        prompt: 'Velvet base, high floral tower',
        image: '/images/center_pieces_2.png',
      },
      {
        id: 'centerpiece3',
        prompt: 'Minimalist gold stand, overflowing florals',
        image: '/images/center_pieces_3.png',
      },
      {
        id: 'centerpiece4',
        prompt: 'Gold candelabra with ivory roses',
        image: '/images/center_pieces_4.png',
      },
    ],
  },
];

export default function WeddingTemplateShowcase() {
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState(templateCategories[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeCategory.items.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeCategory.items.length, isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % activeCategory.items.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prev =>
      prev === 0 ? activeCategory.items.length - 1 : prev - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className='min-h-screen pb-32'>
      <div className='max-w-7xl mx-auto px-4 md:px-6'>
        <div className='text-center mb-16'>
          <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-6'>
            Talk to wedme to personalize <br />
            your dream designs
          </h1>

          <button
            className='bg-[#6b21a8] hover:bg-[#9527fd] text-white px-8 py-2 rounded-lg transition-colors'
            onClick={() => router.push('/signup')}
          >
            Explore
          </button>
        </div>

        {/* Category Selection */}
        <div className='flex justify-center mb-16'>
          <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20'>
            <div className='flex flex-col sm:flex-row gap-2'>
              {templateCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category)}
                  className={`group relative flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 min-w-[200px] ${
                    activeCategory.id === category.id
                      ? 'bg-gradient-to-r from-[#6b21a8] to-[#9333ea] text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      activeCategory.id === category.id
                        ? 'bg-white/20'
                        : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}
                  >
                    {category.icon}
                  </div>
                  <div className='text-left'>
                    <div className='font-semibold'>{category.name}</div>
                    <div
                      className={`text-sm ${activeCategory.id === category.id ? 'text-white/80' : 'text-gray-500'}`}
                    >
                      {category.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Showcase */}
        <div className='relative'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            {/* Featured Image */}
            <div className='relative'>
              <div className='relative group'>
                <div className='absolute inset-0 bg-gradient-to-r from-rose-500/20 to-amber-500/20 rounded-3xl blur-xl transform group-hover:scale-110 transition-transform duration-500'></div>
                <Card className='relative overflow-hidden rounded-3xl shadow-2xl border-0 bg-white/90 backdrop-blur-sm'>
                  <CardContent className='p-0'>
                    <div className='aspect-[4/5] relative overflow-hidden'>
                      <img
                        src={
                          activeCategory.items[currentIndex]?.image ||
                          '/placeholder.svg'
                        }
                        alt={activeCategory.items[currentIndex]?.prompt}
                        className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent' />

                      {/* Overlay Content */}
                      <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
                        <div className='inline-flex items-center gap-2 bg-gradient-to-r from-[#6b21a8] to-[#9333ea] px-3 py-1 rounded-full text-sm font-medium mb-3'>
                          {activeCategory.icon}
                          {activeCategory.name}
                        </div>
                        <h3 className='text-xl font-semibold mb-2 leading-tight'>
                          {activeCategory.items[currentIndex]?.prompt}
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Content & Navigation */}
            <div className='space-y-8'>
              <div>
                <h2 className='text-3xl md:text-4xl font-bold mb-4 text-gray-800'>
                  Discover {activeCategory.name}
                </h2>
                <p className='text-lg text-gray-600 leading-relaxed'>
                  {activeCategory.description}. Each design is carefully crafted
                  to bring elegance and beauty to your special day.
                </p>
              </div>

              {/* Thumbnail Navigation */}
              <div className='grid grid-cols-2 gap-4'>
                {activeCategory.items.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => goToSlide(index)}
                    className={`group relative overflow-hidden rounded-xl transition-all duration-300 ${
                      index === currentIndex
                        ? 'ring-4 ring-purple-500 shadow-lg transform scale-105'
                        : 'hover:shadow-md hover:scale-102'
                    }`}
                  >
                    <div className='aspect-[4/3] relative'>
                      <img
                        src={item.image || '/placeholder.svg'}
                        alt={item.prompt}
                        className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                      />
                      <div
                        className={`absolute inset-0 transition-opacity duration-300 ${
                          index === currentIndex
                            ? 'bg-gradient-to-r from-[#6b21a8] to-[#9333ea] opacity-20'
                            : 'bg-black/20 group-hover:bg-black/10'
                        }`}
                      />
                    </div>
                    <div className='absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent'>
                      <p className='text-white text-sm font-medium line-clamp-2'>
                        {item.prompt}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation Controls */}
              <div className='flex items-center justify-between'>
                <div className='flex gap-3'>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={prevSlide}
                    className='w-12 h-12 rounded-full border-2 hover:bg-gray-50 transition-all duration-300'
                  >
                    <ChevronLeft className='w-5 h-5' />
                  </Button>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={nextSlide}
                    className='w-12 h-12 rounded-full border-2 hover:bg-gray-50 transition-all duration-300'
                  >
                    <ChevronRight className='w-5 h-5' />
                  </Button>
                </div>

                <div className='flex gap-2'>
                  {activeCategory.items.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? 'bg-gradient-to-r from-[#6b21a8] to-[#9333ea] w-8'
                          : 'bg-gray-300 w-2 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
