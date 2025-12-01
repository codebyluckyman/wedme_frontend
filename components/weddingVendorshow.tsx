'use client';

import Image from 'next/image';
import { ArrowUpRight, Target, Zap, Users, Camera, Music } from 'lucide-react';

export default function WeddingVendorShowcase() {
  const vendorCategories = [
    {
      title: 'Venues',
      prompt:
        'Find outdoor wedding venues in sanfrancisco for a price range of 30,000 USD',
      images: [
        '/images/temiscal_beach_house_venue.jpg',
        '/images/Stern-Grove-Wedding-Tracadero-Clubhouse-San-Francisco-Wedding-Photographer-Hazelphoto_0048-1024x687.jpg',
        '/images/FortMasonCenter06.jpg',
      ],
      icon: Target,
      metrics: '92% Match Rate',
      gradient: 'from-slate-900 to-slate-700',
    },
    {
      title: 'Caterers',
      prompt:
        'Find me wedding caterers in Miami that specialize in Mexican food',
      images: [
        '/images/taqueria-el-mexicano.jpeg',
        '/images/Taco-Rico-Menu-scaled.png',
        '/images/a-mari-mix.png',
      ],
      icon: Users,
      metrics: '89% Accuracy',
      gradient: 'from-gray-900 to-gray-700',
    },
    // {
    //   title: 'Decorators',
    //   prompt: 'Looking for a boho-chic ceremony setup with neutral tones.',
    //   images: [
    //     '/placeholder.svg?height=300&width=400',
    //     '/placeholder.svg?height=300&width=400',
    //     '/placeholder.svg?height=300&width=400',
    //   ],
    //   icon: Zap,
    //   metrics: '95% Style Match',
    //   category: 'Aesthetic Analysis',
    //   gradient: 'from-zinc-900 to-zinc-700',
    // },
    {
      title: 'Photographers',
      prompt: 'Suggest photographers specialized in Desi weddings in New York.',
      images: [
        '/images/shaan_photography.png',
        '/images/virdee_films_photography.png',
        '/images/channa_photography.png',
      ],
      icon: Camera,
      metrics: '88% Budget Fit',
      gradient: 'from-neutral-900 to-neutral-700',
    },
    {
      title: 'DJs',
      prompt:
        "Find wedding reception DJ's in austin; who can mix country and pop",
      images: [
        '/images/DJ_AndrewBrown.png',
        '/images/HillCountry_DJ.png',
        '/images/DJ_Brian_Weber.png',
      ],
      icon: Music,
      metrics: '91% Genre Match',
      gradient: 'from-stone-900 to-stone-700',
    },
  ];

  return (
    <div className='min-h-screen bg-white'>
      <div className='max-w-7xl mx-auto px-6 py-20'>
        <div className='space-y-8'>
          {vendorCategories.map((category, index) => {
            const IconComponent = category.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`group relative ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } flex flex-col lg:flex gap-12 items-center opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards] transition-all duration-500`}
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <div className='flex-1 space-y-6 transform translate-x-0 transition-transform duration-700 group-hover:translate-x-1'>
                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-[#6b21a8] group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300'>
                      <IconComponent className='w-6 h-6' />
                    </div>
                    <div>
                      <h3 className='text-2xl font-bold text-gray-900'>
                        {category.title}
                      </h3>
                    </div>
                  </div>

                  <div className='relative'>
                    <div className='bg-gray-50 border border-gray-200 rounded-2xl p-6 group-hover:border-[#6b21a8]/30 group-hover:bg-[#6b21a8]/5 group-hover:scale-[1.02] transition-all duration-300'>
                      <div className='flex items-start gap-4'>
                        <div className='w-8 h-8 bg-gradient-to-br from-[#6b21a8] to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 animate-pulse'>
                          <div className='w-3 h-3 bg-white rounded-sm'></div>
                        </div>
                        <div className='flex-1'>
                          <div className='text-xs font-medium text-gray-500 uppercase tracking-wider mb-2'>
                            Natural Language Input
                          </div>
                          <p className='text-gray-900 font-medium text-lg leading-relaxed'>{`"${category.prompt}"`}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center justify-between pt-4'>
                    <div className='flex items-center gap-6'>
                      <div className='transform transition-transform duration-300 group-hover:scale-105'>
                        <div className='text-sm font-medium text-gray-900'>
                          {category.metrics}
                        </div>
                        <div className='text-xs text-gray-500'>
                          Success Rate
                        </div>
                      </div>
                      <div className='w-px h-8 bg-gray-200'></div>
                      <div className='transform transition-transform duration-300 group-hover:scale-105'>
                        <div className='text-sm font-medium text-gray-900'>
                          {'< 3s'}
                        </div>
                        <div className='text-xs text-gray-500'>
                          Processing Time
                        </div>
                      </div>
                    </div>
                    <button className='flex items-center gap-2 text-gray-600 hover:text-[#6b21a8] transition-all duration-200 group/btn hover:scale-105'>
                      <span className='text-sm font-medium'>View Analysis</span>
                      <ArrowUpRight className='w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-200' />
                    </button>
                  </div>
                </div>

                <div className='flex-1 max-w-lg transform transition-transform duration-700 group-hover:-translate-x-1'>
                  <div className='relative'>
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.gradient} rounded-3xl transform rotate-3 opacity-20 group-hover:rotate-6 group-hover:scale-105 transition-all duration-500`}
                    ></div>
                    <div className='relative bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm group-hover:shadow-xl group-hover:border-[#6b21a8]/20 group-hover:scale-[1.02] transition-all duration-300'>
                      <div className='p-4'>
                        <div className='grid grid-cols-2 gap-3 mb-3'>
                          <div className='col-span-2 relative aspect-[4/3] rounded-2xl overflow-hidden opacity-0 animate-[fadeIn_0.6s_ease-out_0.3s_forwards] group-hover:scale-[1.02] transition-transform duration-300'>
                            <Image
                              src={category.images[0] || '/placeholder.svg'}
                              alt={`${category.title} result 1`}
                              width={400}
                              height={300}
                              className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>
                          </div>

                          <div className='relative aspect-[4/3] rounded-xl overflow-hidden opacity-0 animate-[fadeIn_0.6s_ease-out_0.5s_forwards] hover:scale-105 transition-all duration-300'>
                            <Image
                              src={category.images[1] || '/placeholder.svg'}
                              alt={`${category.title} result 2`}
                              width={400}
                              height={300}
                              className='w-full h-full object-cover transition-transform duration-500 hover:scale-110'
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/10 to-transparent'></div>
                          </div>

                          <div className='relative aspect-[4/3] rounded-xl overflow-hidden opacity-0 animate-[fadeIn_0.6s_ease-out_0.7s_forwards] hover:scale-105 transition-all duration-300'>
                            <Image
                              src={category.images[2] || '/placeholder.svg'}
                              alt={`${category.title} result 3`}
                              width={400}
                              height={300}
                              className='w-full h-full object-cover transition-transform duration-500 hover:scale-110'
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/10 to-transparent'></div>

                            <div className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300'>
                              <div className='text-white text-sm font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full transform scale-75 group-hover:scale-100 transition-transform duration-300'>
                                +5 More
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className='bg-gray-50/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 transform transition-all duration-300 group-hover:bg-[#6b21a8]/5 group-hover:border-[#6b21a8]/20'>
                          <div className='flex items-center justify-between'>
                            <div>
                              <div className='text-sm font-semibold text-gray-900'>
                                AI Analysis Complete
                              </div>
                              <div className='text-xs text-gray-600'>
                                Processing: Natural Language → Structured Data
                              </div>
                            </div>
                            <div className='flex items-center gap-2'>
                              <div className='text-xs font-medium text-[#6b21a8] animate-[countUp_1s_ease-out_1s_forwards]'>
                                8 Results
                              </div>
                              <div className='w-8 h-8 bg-[#6b21a8]/10 rounded-full flex items-center justify-center'>
                                <div className='w-3 h-3 bg-[#6b21a8] rounded-full animate-[pulse_2s_ease-in-out_infinite]'></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shimmer {
          0%,
          100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
        }

        @keyframes countUp {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
