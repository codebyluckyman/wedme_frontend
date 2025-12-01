'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu as MenuIcon } from 'lucide-react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import FileUpload from '@/components/fileUpload';
import CircularProgressWithLabel from '@/pages/circular-progress';

// Add WeddingRingsLogo component
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

export default function GenerateVenueDesigns() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [eventType, seteventType] = useState('');
  const [eventTheme, seteventTheme] = useState('');
  const [colorScheme, setColorScheme] = useState('');
  // const [textPrompt, setTextPrompt] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isImageUpload, setIsImageUpload] = useState(true);
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [savedImages, setSavedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const session = useSession();
  const supabase = useSupabaseClient();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    fetchRemainingCredits();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (loading) {
      interval = setInterval(() => {
        setProgress(prevProgress => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prevProgress + 1;
        });
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL
    }
  };

  const handleSaveImage = (imageUrl: string, index: number) => {
    const isBase64 = imageUrl.startsWith('data:image');
    let downloadUrl = imageUrl;
    if (!isBase64) {
      downloadUrl = `/api/image_url?url=${encodeURIComponent(imageUrl)}`;
    }
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `generated_invitation_${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSavedImages(prev => [...prev, imageUrl]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setImageUrls([]);

    const formData = new FormData();
    if (isImageUpload && imageFile) {
      formData.append('room-image', imageFile!);
    }
    formData.append('event-type', eventType);
    formData.append('event-theme', eventTheme);
    formData.append('color-scheme', colorScheme);

    try {
      const response = await fetch('/api/generate_designs', {
        method: 'POST',
        body: formData,
      });
      setProgress(100);

      if (!response.ok) {
        throw new Error('Failed to generate designs');
      }
      const data = await response.json();
      setImageUrls(data?.image_urls);
      setRemainingCredits(prev => (prev !== null ? prev - 1 : null)); // Decrement credits
      setProgress(0);
    } catch (error) {
      console.error('Error generating designs:', error);
      setError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
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
                  <h1 className='text-3xl font-serif text-purple-900'>wedme.ai</h1>
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
                  Dream Venue Creator
                </h2>
                <p className='text-purple-100 text-lg max-w-2xl'>
                  Transform your venue ideas into stunning visualizations
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className='max-w-7xl mx-auto p-8'>
            <motion.form
              onSubmit={handleSubmit}
              className='bg-white rounded-2xl shadow-lg border border-purple-100 p-8 space-y-6'
            >
              {/* Input Method Selection */}
              {/*
              <div className='space-y-4'>
                <label className='text-lg font-semibold text-purple-900'>
                  Choose Input Method
                </label>
                <div className='flex gap-4'>
                  <label className='flex items-center space-x-2 text-gray-600'>
                    <input
                      type='radio'
                      checked={isImageUpload}
                      onChange={() => setIsImageUpload(true)}
                      className='text-purple-600'
                    />
                    <span>Upload Image</span>
                  </label>
                  <label className='flex items-center space-x-2 text-gray-600'>
                    <input
                      type='radio'
                      checked={!isImageUpload}
                      onChange={() => setIsImageUpload(false)}
                      className='text-purple-600'
                    />
                    <span>Enter Text Prompt</span>
                  </label>
                </div>
              </div>
              */}
              {/* Image Upload */}
              <div className='space-y-4'>
                <label className='text-lg font-semibold text-purple-900'>
                  Upload Room Layout
                </label>
                <FileUpload onChange={handleImageUpload} />
                {imageFile && (
                  <p className='text-gray-600'>
                    Selected File: {imageFile.name}
                  </p>
                )}
                {imagePreview && (
                  <div className='mt-4'>
                    <img
                      src={imagePreview}
                      alt='Uploaded Room Layout'
                      className='w-full h-auto rounded-lg border border-purple-100'
                    />
                  </div>
                )}
              </div>
              {/* Event Details Fields */}
              <div className='space-y-4'>
                <div>
                  <label className='text-lg font-semibold text-purple-900'>
                    Event Type
                  </label>
                  <input
                    type='text'
                    required
                    className='w-full px-6 py-3 border border-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-900 bg-purple-50'
                    placeholder='e.g., Haldi, Mehendi, Sangeet, Reception, Classic Wedding'
                    onChange={e => seteventType(e.target.value)}
                  />
                </div>

                <div>
                  <label className='text-lg font-semibold text-purple-900'>
                    Event Theme
                  </label>
                  <select
                    required
                    className='w-full px-6 py-3 border border-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-900 bg-purple-50'
                    onChange={e => seteventTheme(e.target.value)}
                  >
                    <option value=''>Select a theme</option>
                    <option value='modern'>Modern</option>
                    <option value='classic'>Classic</option>
                    <option value='traditional'>Traditional</option>
                    <option value='minimalist'>Minimalist</option>
                    <option value='chique'>Chique</option>
                  </select>
                </div>

                <div>
                  <label className='text-lg font-semibold text-purple-900'>
                    Color Scheme
                  </label>
                  <select
                    required
                    className='w-full px-6 py-3 border border-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-900 bg-purple-50'
                    onChange={e => setColorScheme(e.target.value)}
                  >
                    <option value=''>Select a color scheme</option>
                    <option value='light'>Light</option>
                    <option value='dark'>Dark</option>
                    <option value='neutral'>Neutral</option>
                    <option value='vibrant'>Vibrant</option>
                  </select>
                </div>
              </div>

              {/* Generate Button */}
              <div className='flex justify-center pt-4'>
                {loading ? (
                  <CircularProgressWithLabel value={progress} />
                ) : (
                  <button
                    type='submit'
                    className='w-full px-6 py-3 text-white bg-purple-900 rounded-full hover:bg-purple-800 transition-colors duration-200 shadow-lg hover:shadow-xl'
                  >
                    Generate Design
                  </button>
                )}
              </div>
            </motion.form>

            {/* Generated Images */}
            {imageUrls.length > 0 && (
              <div className='mt-8 space-y-6'>
                <h3 className='text-2xl font-serif text-purple-900'>
                  Generated Designs
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  {imageUrls.map((url, index) => (
                    <div
                      key={index}
                      className='bg-white rounded-2xl shadow-lg border border-purple-100 p-6 space-y-4'
                    >
                      <img
                        src={url}
                        alt={`Generated design ${index + 1}`}
                        className='w-full h-auto rounded-lg'
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className='w-full px-6 py-3 text-white bg-purple-900 rounded-full hover:bg-purple-800 transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:hover:bg-purple-900'
                        onClick={() => handleSaveImage(url, index)}
                        disabled={savedImages.includes(url)}
                      >
                        {savedImages.includes(url) ? 'Saved' : 'Save Design'}
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Snackbar */}
      {openSnackbar && error && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className='fixed bottom-4 right-4 bg-purple-900 text-white px-6 py-3 rounded-full shadow-lg z-50'
        >
          {error}
          <button
            onClick={() => setOpenSnackbar(false)}
            className='ml-2 text-white hover:text-purple-200 focus:outline-none'
          >
            Close
          </button>
        </motion.div>
      )}
    </div>
  );
}
