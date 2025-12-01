'use client';

import {
  Heart,
  MapPin,
  SlidersHorizontal,
  Star,
  UserCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// export const dynamic = 'force-dynamic';

// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Menu as MenuIcon } from 'lucide-react';
// import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
// import FileUpload from '@/components/fileUpload';
// import CircularProgressWithLabel from '@/pages/circular-progress';

// // Add WeddingRingsLogo component
// const WeddingRingsLogo = () => (
//   <svg
//     width='32'
//     height='32'
//     viewBox='0 0 32 32'
//     fill='none'
//     xmlns='http://www.w3.org/2000/svg'
//   >
//     <circle
//       cx='13'
//       cy='16'
//       r='6'
//       stroke='currentColor'
//       strokeWidth='2'
//       className='text-primary/80'
//       fill='none'
//     />
//     <circle
//       cx='19'
//       cy='16'
//       r='6'
//       stroke='currentColor'
//       strokeWidth='2'
//       className='text-primary'
//       fill='none'
//     />
//   </svg>
// );

// export default function GenerateVenueDesigns() {
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [eventType, seteventType] = useState('');
//   const [eventTheme, seteventTheme] = useState('');
//   const [colorScheme, setColorScheme] = useState('');
//   // const [textPrompt, setTextPrompt] = useState('');
//   const [imageUrls, setImageUrls] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [isImageUpload, setIsImageUpload] = useState(true);
//   const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
//   const [savedImages, setSavedImages] = useState<string[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [progress, setProgress] = useState<number>(0);

//   const session = useSession();
//   const supabase = useSupabaseClient();

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   useEffect(() => {
//     fetchRemainingCredits();
//   }, []);

//   useEffect(() => {
//     let interval: NodeJS.Timeout | undefined;

//     if (loading) {
//       interval = setInterval(() => {
//         setProgress(prevProgress => {
//           if (prevProgress >= 100) {
//             clearInterval(interval);
//             return 100;
//           }
//           return prevProgress + 1;
//         });
//       }, 500);
//     }

//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [loading]);

//   const fetchRemainingCredits = async () => {
//     try {
//       const response = await fetch('/api/credits');
//       if (!response.ok) {
//         throw new Error('Failed to fetch credits');
//       }
//       const data = await response.json();
//       setRemainingCredits(data.credits);
//     } catch (error) {
//       console.error('Error fetching credits:', error);
//     }
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file)); // Create a preview URL
//     }
//   };

//   const handleSaveImage = (imageUrl: string, index: number) => {
//     const isBase64 = imageUrl.startsWith('data:image');
//     let downloadUrl = imageUrl;
//     if (!isBase64) {
//       downloadUrl = `/api/image_url?url=${encodeURIComponent(imageUrl)}`;
//     }
//     const link = document.createElement('a');
//     link.href = downloadUrl;
//     link.download = `generated_invitation_${index + 1}.jpg`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     setSavedImages(prev => [...prev, imageUrl]);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setImageUrls([]);

//     const formData = new FormData();
//     if (isImageUpload && imageFile) {
//       formData.append('room-image', imageFile!);
//     }
//     formData.append('event-type', eventType);
//     formData.append('event-theme', eventTheme);
//     formData.append('color-scheme', colorScheme);

//     try {
//       const response = await fetch('/api/generate_designs', {
//         method: 'POST',
//         body: formData,
//       });
//       setProgress(100);

//       if (!response.ok) {
//         throw new Error('Failed to generate designs');
//       }
//       const data = await response.json();
//       setImageUrls(data?.image_urls);
//       setRemainingCredits(prev => (prev !== null ? prev - 1 : null)); // Decrement credits
//       setProgress(0);
//     } catch (error) {
//       console.error('Error generating designs:', error);
//       setError(
//         error instanceof Error ? error.message : 'An unknown error occurred'
//       );
//       setOpenSnackbar(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className='min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 w-full'>
//       <div className='flex-1 min-h-screen'>
//         <div className={`transition-all duration-300 ease-in-out`}>
//           {/* Updated Header */}
//           {/* <div className='sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-purple-100 shadow-sm'>
//             <header className='py-4 px-8'>
//               <div className='max-w-7xl mx-auto flex items-center justify-between'>
//                 <div className='flex items-center gap-3'>
//                   <h1 className='text-3xl font-serif text-purple-900'>wedme.ai</h1>
//                   <WeddingRingsLogo />
//                 </div>
//                 {remainingCredits !== null && (
//                   <div className='bg-purple-100 px-6 py-2 rounded-full'>
//                     <p className='text-sm font-medium text-purple-700'>
//                       Available Credits:{' '}
//                       <span className='font-bold'>{remainingCredits}</span>
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </header>
//           </div> */}

//           {/* Title Section */}
//           <div className='max-w-7xl mx-auto px-8 pt-8'>
//             <div className='bg-purple-900 rounded-3xl shadow-lg overflow-hidden'>
//               <div className='px-8 py-12'>
//                 <h2 className='text-4xl font-serif text-white mb-4'>
//                   Dream Venue Creator
//                 </h2>
//                 <p className='text-purple-100 text-lg max-w-2xl'>
//                   Transform your venue ideas into stunning visualizations
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Main Content Area */}
//           <div className='max-w-7xl mx-auto p-8'>
//             <motion.form
//               onSubmit={handleSubmit}
//               className='bg-white rounded-2xl shadow-lg border border-purple-100 p-8 space-y-6'
//             >
//               {/* Input Method Selection */}
//               {/*
//               <div className='space-y-4'>
//                 <label className='text-lg font-semibold text-purple-900'>
//                   Choose Input Method
//                 </label>
//                 <div className='flex gap-4'>
//                   <label className='flex items-center space-x-2 text-gray-600'>
//                     <input
//                       type='radio'
//                       checked={isImageUpload}
//                       onChange={() => setIsImageUpload(true)}
//                       className='text-purple-600'
//                     />
//                     <span>Upload Image</span>
//                   </label>
//                   <label className='flex items-center space-x-2 text-gray-600'>
//                     <input
//                       type='radio'
//                       checked={!isImageUpload}
//                       onChange={() => setIsImageUpload(false)}
//                       className='text-purple-600'
//                     />
//                     <span>Enter Text Prompt</span>
//                   </label>
//                 </div>
//               </div>
//               */}
//               {/* Image Upload */}
//               <div className='space-y-4'>
//                 <label className='text-lg font-semibold text-purple-900'>
//                   Upload Room Layout
//                 </label>
//                 <FileUpload onChange={handleImageUpload} />
//                 {imageFile && (
//                   <p className='text-gray-600'>
//                     Selected File: {imageFile.name}
//                   </p>
//                 )}
//                 {imagePreview && (
//                   <div className='mt-4'>
//                     <img
//                       src={imagePreview}
//                       alt='Uploaded Room Layout'
//                       className='w-full h-auto rounded-lg border border-purple-100'
//                     />
//                   </div>
//                 )}
//               </div>
//               {/* Event Details Fields */}
//               <div className='space-y-4'>
//                 <div>
//                   <label className='text-lg font-semibold text-purple-900'>
//                     Event Type
//                   </label>
//                   <input
//                     type='text'
//                     required
//                     className='w-full px-6 py-3 border border-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-900 bg-purple-50'
//                     placeholder='e.g., Haldi, Mehendi, Sangeet, Reception, Classic Wedding'
//                     onChange={e => seteventType(e.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <label className='text-lg font-semibold text-purple-900'>
//                     Event Theme
//                   </label>
//                   <select
//                     required
//                     className='w-full px-6 py-3 border border-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-900 bg-purple-50'
//                     onChange={e => seteventTheme(e.target.value)}
//                   >
//                     <option value=''>Select a theme</option>
//                     <option value='modern'>Modern</option>
//                     <option value='classic'>Classic</option>
//                     <option value='traditional'>Traditional</option>
//                     <option value='minimalist'>Minimalist</option>
//                     <option value='chique'>Chique</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className='text-lg font-semibold text-purple-900'>
//                     Color Scheme
//                   </label>
//                   <select
//                     required
//                     className='w-full px-6 py-3 border border-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-900 bg-purple-50'
//                     onChange={e => setColorScheme(e.target.value)}
//                   >
//                     <option value=''>Select a color scheme</option>
//                     <option value='light'>Light</option>
//                     <option value='dark'>Dark</option>
//                     <option value='neutral'>Neutral</option>
//                     <option value='vibrant'>Vibrant</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Generate Button */}
//               <div className='flex justify-center pt-4'>
//                 {loading ? (
//                   <CircularProgressWithLabel value={progress} />
//                 ) : (
//                   <button
//                     type='submit'
//                     className='w-full px-6 py-3 text-white bg-purple-900 rounded-full hover:bg-purple-800 transition-colors duration-200 shadow-lg hover:shadow-xl'
//                   >
//                     Generate Design
//                   </button>
//                 )}
//               </div>
//             </motion.form>

//             {/* Generated Images */}
//             {imageUrls.length > 0 && (
//               <div className='mt-8 space-y-6'>
//                 <h3 className='text-2xl font-serif text-purple-900'>
//                   Generated Designs
//                 </h3>
//                 <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
//                   {imageUrls.map((url, index) => (
//                     <div
//                       key={index}
//                       className='bg-white rounded-2xl shadow-lg border border-purple-100 p-6 space-y-4'
//                     >
//                       <img
//                         src={url}
//                         alt={`Generated design ${index + 1}`}
//                         className='w-full h-auto rounded-lg'
//                       />
//                       <motion.button
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         className='w-full px-6 py-3 text-white bg-purple-900 rounded-full hover:bg-purple-800 transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:hover:bg-purple-900'
//                         onClick={() => handleSaveImage(url, index)}
//                         disabled={savedImages.includes(url)}
//                       >
//                         {savedImages.includes(url) ? 'Saved' : 'Save Design'}
//                       </motion.button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Error Snackbar */}
//       {openSnackbar && error && (
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: 50 }}
//           className='fixed bottom-4 right-4 bg-purple-900 text-white px-6 py-3 rounded-full shadow-lg z-50'
//         >
//           {error}
//           <button
//             onClick={() => setOpenSnackbar(false)}
//             className='ml-2 text-white hover:text-purple-200 focus:outline-none'
//           >
//             Close
//           </button>
//         </motion.div>
//       )}
//     </div>
//   );
// }

export default function GenerateVenueDesigns() {
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  const [favorites, setFavorites] = useState<number[]>([]);
  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const [type, setType] = useState<'all' | 'venue' | 'caterer'>('all');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');

  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        buttonRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='w-full'>
      <div className='mx-auto'>
        {/* Desktop and Tablet Navigation */}
        <div className='hidden sm:flex items-center justify-between mb-8 border-b py-2 px-4 md:px-8'>
          <div className='flex items-center gap-3'>
            <button
              className={`px-4 py-2 ${
                type === 'all' && 'rounded-full bg-purple-600 text-white'
              } text-sm transition-all`}
              onClick={() => setType('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-2 ${
                type === 'venue' && 'rounded-full bg-purple-600 text-white'
              } text-sm transition-all`}
              onClick={() => setType('venue')}
            >
              Venue Design
            </button>
            <button
              className={`px-4 py-2 ${
                type === 'caterer' && 'rounded-full bg-purple-600 text-white'
              } text-sm transition-all`}
              onClick={() => setType('caterer')}
            >
              Caterers
            </button>
          </div>

          <div className='flex items-center gap-4 relative'>
            <div className='flex items-center gap-2'>
              <MapPin className='h-4 w-4' />
              <span className='text-sm'>Boston, USA</span>
            </div>
            <button
              className='flex items-center gap-2 text-sm hover:text-purple-600 transition-colors'
              ref={buttonRef}
              onClick={() => setShowPopover(!showPopover)}
            >
              <SlidersHorizontal className='h-4 w-4' />
              Sort by
            </button>

            {showPopover && (
              <div
                ref={popoverRef}
                className='absolute right-0 z-40 w-80 mt-2 bg-white rounded-lg shadow-lg top-[32px]'
              >
                <div className='p-6 space-y-4'>
                  <h3 className='text-sm font-medium'>Budget range</h3>
                  <div className='flex items-center gap-2'>
                    <input
                      type='text'
                      placeholder='Min budget'
                      value={minBudget}
                      onChange={e => setMinBudget(e.target.value)}
                      className='flex-1 px-4 py-2 max-w-[120px] text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600'
                    />
                    <span className='text-sm text-gray-500'>To</span>
                    <input
                      type='text'
                      placeholder='Max budget'
                      value={maxBudget}
                      onChange={e => setMaxBudget(e.target.value)}
                      className='flex-1 px-4 py-2 max-w-[120px] text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600'
                    />
                  </div>
                  <button className='w-full px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors'>
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className='sm:hidden'>
          {/* Scrollable Types */}
          <div className='overflow-x-auto scrollbar-hide border-b'>
            <div className='flex items-center gap-3 px-4 py-2 min-w-max'>
              <button
                className={`px-4 py-2 ${
                  type === 'all' && 'rounded-full bg-purple-600 text-white'
                } text-sm whitespace-nowrap transition-all`}
                onClick={() => setType('all')}
              >
                All
              </button>
              <button
                className={`px-4 py-2 ${
                  type === 'venue' && 'rounded-full bg-purple-600 text-white'
                } text-sm whitespace-nowrap transition-all`}
                onClick={() => setType('venue')}
              >
                Venue Design
              </button>
              <button
                className={`px-4 py-2 ${
                  type === 'caterer' && 'rounded-full bg-purple-600 text-white'
                } text-sm whitespace-nowrap transition-all`}
                onClick={() => setType('caterer')}
              >
                Caterers
              </button>
            </div>
          </div>

          {/* Mobile Filter Bar */}
          <div className='flex items-center justify-between px-4 py-3 bg-white shadow-sm'>
            <div className='flex items-center gap-2'>
              <MapPin className='h-4 w-4' />
              <span className='text-sm'>Boston, USA</span>
            </div>
            <button
              onClick={() => setShowMobileFilter(true)}
              className='flex items-center gap-2 text-sm'
            >
              <SlidersHorizontal className='h-4 w-4' />
              Filters
            </button>
          </div>

          {/* Mobile Filter Sheet */}
          {showMobileFilter && (
            <div className='fixed inset-0 bg-black bg-opacity-50 z-50'>
              <div className='absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 animate-slide-up'>
                <div className='flex justify-between items-center mb-6'>
                  <h2 className='text-lg font-semibold'>Filters</h2>
                  <button
                    onClick={() => setShowMobileFilter(false)}
                    className='text-gray-500'
                  >
                    ✕
                  </button>
                </div>

                <div className='space-y-6'>
                  <div>
                    <h3 className='text-sm font-medium mb-4'>Budget range</h3>
                    <div className='flex items-center gap-2'>
                      <input
                        type='text'
                        placeholder='Min budget'
                        value={minBudget}
                        onChange={e => setMinBudget(e.target.value)}
                        className='flex-1 px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 min-w-[105px] sm:w-auto'
                      />
                      <span className='text-sm text-gray-500'>To</span>
                      <input
                        type='text'
                        placeholder='Max budget'
                        value={maxBudget}
                        onChange={e => setMaxBudget(e.target.value)}
                        className='flex-1 px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 min-w-[105px] sm:w-auto'
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setShowMobileFilter(false)}
                    className='w-full px-4 py-3 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors'
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='relative'>
        <div className='flex-1 relative mt-8 '>
          <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-95 backdrop-blur-sm z-[20]'>
            <div className='text-center space-y-4'>
              <h2 className='text-3xl font-bold text-gray-900'>Coming Soon!</h2>
              <p className='text-gray-600'>
                We're working hard to bring you amazing content.
              </p>
              <Link
                target='_blank'
                href='https://forms.gle/K2heh1GtenEkRVz17'
                className='px-6 py-2 bg-purple-600 w-fit mx-auto text-white text-md font-medium rounded-xl border-2 md:flex items-center gap-2 hidden'
              >
                <UserCircle className='w-6 h-6' strokeWidth={2} />
                Vendors
              </Link>

              <div className='animate-bounce mt-4'>
                <div className='w-2 h-2 bg-purple-600 rounded-full mx-auto'></div>
              </div>
            </div>
          </div>

          {/* Placeholder content - this will be replaced with actual content later */}
          <div>
            <div className='m-8'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-md font-semibold text-gray-900'>
                  Venue Design
                </h2>
                <button className='flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200'>
                  <span>View all</span>
                </button>
              </div>

              <div className='overflow-x-auto'>
                <div className='flex space-x-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
                  {venues.map(venue => (
                    <div
                      key={venue.id}
                      className='relative flex-shrink-0 w-72 sm:w-auto rounded-2xl overflow-hidden group bg-white shadow-sm hover:shadow-md transition-all duration-300 h-[280px]'
                    >
                      <img
                        src={venue.image}
                        alt={venue.location}
                        className='absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100 group-hover:via-black/60 transition-all duration-300' />
                      <button
                        className='absolute top-4 right-4 p-2.5 rounded-full bg-white/30 hover:bg-white/40 transition-all duration-200 backdrop-blur-md'
                        onClick={e => {
                          e.preventDefault();
                          toggleFavorite(venue.id);
                        }}
                      >
                        <svg
                          className={`h-5 w-5 transition-colors duration-200 ${
                            favorites.includes(venue.id)
                              ? 'text-red-500 fill-red-500'
                              : 'text-white'
                          }`}
                          xmlns='http://www.w3.org/2000/svg'
                          fill='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path d='M12 4.248c-3.148-5.402-12-3.04-12 3.733 0 3.527 2.613 6.839 8.55 11.676l1.45 1.292 1.451-1.293c5.936-4.836 8.549-8.148 8.549-11.675 0-6.773-8.852-9.135-12-3.733z' />
                        </svg>
                      </button>

                      <div className='relative z-10 flex flex-col items-center justify-center flex-grow h-full'>
                        <button className='mb-3 px-6 py-2 bg-[#6B21A8] text-white text-sm rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-purple-700'>
                          View details
                        </button>
                      </div>

                      <div className='absolute bottom-0 left-0 right-0 p-4 text-white'>
                        <div className='flex items-center justify-between mb-1'>
                          <span className='font-medium text-[14px]'>
                            {venue.location}
                          </span>
                          <div className='flex items-center space-x-1'>
                            <svg
                              className='h-4 w-4 fill-yellow-400 text-yellow-400'
                              xmlns='http://www.w3.org/2000/svg'
                              fill='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path d='M12 .587l3.668 7.568 8.332 1.151-6.064 5.851 1.52 8.281-7.456-3.917-7.456 3.917 1.52-8.281-6.064-5.851 8.332-1.151z' />
                            </svg>
                            <span>{venue.rating}</span>
                          </div>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <span className='font-semibold'>
                            ${venue.price.toLocaleString()}
                          </span>
                          <span className='text-sm line-through text-gray-300'>
                            ${venue.originalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='m-8'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-md font-semibold text-gray-900'>
                  Venue Design
                </h2>
                <button className='flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200'>
                  <span>View all</span>
                </button>
              </div>

              <div className='overflow-x-auto'>
                <div className='flex space-x-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
                  {venues.map(venue => (
                    <div
                      key={venue.id}
                      className='relative flex-shrink-0 w-72 sm:w-auto rounded-2xl overflow-hidden group bg-white shadow-sm hover:shadow-md transition-all duration-300 h-[280px]'
                    >
                      <img
                        src={venue.image}
                        alt={venue.location}
                        className='absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100 group-hover:via-black/60 transition-all duration-300' />
                      <button
                        className='absolute top-4 right-4 p-2.5 rounded-full bg-white/30 hover:bg-white/40 transition-all duration-200 backdrop-blur-md'
                        onClick={e => {
                          e.preventDefault();
                          toggleFavorite(venue.id);
                        }}
                      >
                        <svg
                          className={`h-5 w-5 transition-colors duration-200 ${
                            favorites.includes(venue.id)
                              ? 'text-red-500 fill-red-500'
                              : 'text-white'
                          }`}
                          xmlns='http://www.w3.org/2000/svg'
                          fill='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path d='M12 4.248c-3.148-5.402-12-3.04-12 3.733 0 3.527 2.613 6.839 8.55 11.676l1.45 1.292 1.451-1.293c5.936-4.836 8.549-8.148 8.549-11.675 0-6.773-8.852-9.135-12-3.733z' />
                        </svg>
                      </button>

                      <div className='relative z-10 flex flex-col items-center justify-center flex-grow h-full'>
                        <button className='mb-3 px-6 py-2 bg-[#6B21A8] text-white text-sm rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-purple-700'>
                          View details
                        </button>
                      </div>

                      <div className='absolute bottom-0 left-0 right-0 p-4 text-white'>
                        <div className='flex items-center justify-between mb-1'>
                          <span className='font-medium text-[14px]'>
                            {venue.location}
                          </span>
                          <div className='flex items-center space-x-1'>
                            <svg
                              className='h-4 w-4 fill-yellow-400 text-yellow-400'
                              xmlns='http://www.w3.org/2000/svg'
                              fill='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path d='M12 .587l3.668 7.568 8.332 1.151-6.064 5.851 1.52 8.281-7.456-3.917-7.456 3.917 1.52-8.281-6.064-5.851 8.332-1.151z' />
                            </svg>
                            <span>{venue.rating}</span>
                          </div>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <span className='font-semibold'>
                            ${venue.price.toLocaleString()}
                          </span>
                          <span className='text-sm line-through text-gray-300'>
                            ${venue.originalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
