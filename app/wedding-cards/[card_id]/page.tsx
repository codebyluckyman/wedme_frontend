'use client';

import { useEffect, useRef, useState, use } from 'react';
import { CalendarIcon, MapPin, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/app/utils/supabase/client';
import { useAuthStore } from '@/app/store/authStore';
import { useRouter } from 'next/navigation';
import { handleSaveImage } from '@/app/utils/image_download';

export default function WeddingCardCreator({
  params: paramsPromise,
}: {
  params: Promise<{ card_id: string }>;
}) {
  const supabase = createClient();
  const params = use(paramsPromise);
  const { user } = useAuthStore();
  const router = useRouter();

  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [selectedColor, setSelectedColor] = useState('#F8BBD0'); // Default pink
  const [additionalInstructions, setAdditionalInstructions] = useState('');

  // Add states for remix functionality
  const [isRemixing, setIsRemixing] = useState(false);
  const [remixedOptions, setRemixedOptions] = useState<string[]>([]);
  const [showRemixOptions, setShowRemixOptions] = useState(false);

  const [recentGenerations, setRecentGenerations] = useState<any[]>([]);
  const [mayAlsoLike, setMayAlsoLike] = useState<any[]>([]);
  const skeletonrecentGenerations = Array(6).fill(null);
  const [isRecentGenerations, setIsRecentGenerations] = useState(false);

  const colorOptions = [
    { value: '#F8BBD0', label: 'Pink' },
    { value: '#C8E6C9', label: 'Light Green' },
    { value: '#9C27B0', label: 'Purple' },
    { value: '#FF9800', label: 'Orange' },
    { value: '#000000', label: 'Black' },
  ];

  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleOpenDatePicker = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    } else {
      console.error('Date input reference is not available');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const [card, setCard] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCardDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch card details with type information
        const { data, error } = await supabase
          .from('wedding_card')
          .select('*, wedding_card_type:type(*)')
          .eq('id', params?.card_id)
          .single();

        if (error) throw error;

        setCard(data);

        // Pre-fill form with data if available
        if (data) {
          if (data.groom_name) setGroomName(data.groom_name);
          if (data.bride_name) setBrideName(data.bride_name);
          if (data.event_date) setDate(data.event_date);
          if (data.location) setLocation(data.location);
          if (data.color) setSelectedColor(data.color);
          if (data.additional_instructions)
            setAdditionalInstructions(data.additional_instructions);
        }

        const { data: mayAlsoLikeData, error: mayAlsoLikeError } =
          await supabase
            .from('wedding_card')
            .select('*, wedding_card_type!inner(type)')
            .eq(
              'wedding_card_type.type',
              data?.wedding_card_type?.type === 'save_date'
                ? 'bridal_shower'
                : data?.wedding_card_type?.type === 'bridal_shower'
                  ? 'receptions'
                  : 'save_date'
            )
            .limit(6);
        if (mayAlsoLikeError) throw mayAlsoLikeError;

        if (mayAlsoLikeData) {
          setMayAlsoLike(mayAlsoLikeData);
        }
      } catch (err) {
        console.error('Error fetching wedding card:', err);
        setError(
          'Failed to load wedding card details. Please try again later.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (params?.card_id) {
      fetchCardDetails();
    }
  }, [params?.card_id]);

  // Function to handle remix button click
  const handleRemixCard = async () => {
    if (!card?.image_url) {
      setError('No image available to remix');
      return;
    }

    setIsRemixing(true);
    setError(null);

    try {
      // Generate a basic prompt from the card data
      const basePrompt =
        card?.prompt && card.prompt.trim() !== ''
          ? card.prompt
          : 'elegant, professional wedding invitation design';

      // Format the date if available (safely handle empty or undefined date)
      const formattedDate = date && date.trim() !== '' ? formatDate(date) : '';

      // Format couple names if available
      const coupleNames =
        groomName && brideName ? `${groomName} and ${brideName}` : '';

      // Call the Ideogram Remix API with all the necessary details
      const response = await fetch('/api/ideogram-remix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: card.image_url,
          prompt: basePrompt,
          aspectRatio:
            card?.wedding_card_type?.type === 'save_date'
              ? 'ASPECT_1_1'
              : 'ASPECT_10_16', // Using 1:1 aspect ratio for wedding cards
          imageWeight: 50, // Balance between original image and new prompt
          coupleNames: coupleNames, // Pass names for prompt enhancement
          eventDate: formattedDate, // Pass date for prompt enhancement
          location: location, // Pass location for prompt enhancement
          additionalInstructions: additionalInstructions, // Pass additional instructions
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to remix card');
      }

      const data = await response.json();

      if (!data.variations || data.variations.length === 0) {
        throw new Error('No remix variations were generated');
      }

      if (data.enhancedPrompt) {
        console.log('Used enhanced prompt for remix');
      }

      // Set the remixed options
      setRemixedOptions(data.variations);
      selectRemixOption(data.variations[0]);
      setShowRemixOptions(true);
    } catch (err) {
      console.error('Error remixing card:', err);
      setError(
        typeof err === 'string'
          ? err
          : err instanceof Error
            ? err.message
            : 'Failed to remix your card. Please try again later.'
      );
    } finally {
      setIsRemixing(false);
    }
  };

  // No need for these functions anymore as they are handled in the API
  // generateEnhancedPrompt and generateBasicPrompt have been removed

  // Function to select a remixed option
  const selectRemixOption = async (imageUrl: string) => {
    try {
      const response = await fetch(
        `/api/image_url?url=${encodeURIComponent(imageUrl)}`
      );
      if (!response.ok) throw new Error('Failed to fetch image');
      const imageBlob = await response.blob();

      // Generate a unique file name
      const timestamp = Date.now();
      const fileName = `invitation_${timestamp}.jpg`;

      // Upload the image to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('remix-card')
        .upload(`images/${fileName}`, imageBlob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
        });

      if (uploadError) throw uploadError;

      // Get the public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('remix-card')
        .getPublicUrl(`images/${fileName}`);

      const supabaseImageUrl = publicUrlData.publicUrl;
      // Update the current card with the selected remix
      const { data: remix_card_data, error } = await supabase
        .from('remix_wedding_card')
        .insert({
          remix_image_url: supabaseImageUrl,
          groom_name: groomName,
          bride_name: brideName,
          event_date: date,
          location: location,
          color: selectedColor,
          additional_instructions: additionalInstructions,
          created_at: new Date().toISOString(),
        })
        .single();
      // .eq('id', params?.card_id);

      if (error) throw error;

      // Update local state
      setCard({
        ...card,
        image_url: supabaseImageUrl,
      });

      // Hide remix options
      setShowRemixOptions(false);

      // Add to recent generations
      saveToRecentGenerations(supabaseImageUrl, card?.type);
    } catch (err) {
      console.error('Error updating card:', err);
      setError('Failed to update your card. Please try again later.');
    }
  };

  // Function to save to recent generations
  const saveToRecentGenerations = async (imageUrl: string, type: number) => {
    try {
      // Save to recent generations table
      await supabase.from('recent_generations').insert({
        user_id: user?.id, // Assuming user_id is stored in card
        image_url: imageUrl,
        card_type: type,
        // wedding_card_id: card?.id,
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error saving to recent generations:', err);
    }
  };

  const handleFetchRecentGenerations = async () => {
    setIsRecentGenerations(true);
    const { data, error } = await supabase
      .from('recent_generations')
      .select(`*, wedding_card_type (*)`)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) console.log('error', error);

    if (data) setRecentGenerations(data);
    setIsRecentGenerations(false);
  };

  useEffect(() => {
    handleFetchRecentGenerations();
    const recentGenerationRealtime = supabase
      .channel('recent_generations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recent_generations',
          filter: `user_id=eq.${user?.id}`,
        },
        payload => {
          console.log('Database change detected:', payload);
          handleFetchRecentGenerations();
        }
      )
      .subscribe();

    return () => {
      recentGenerationRealtime.unsubscribe();
    };
  }, []);

  return (
    <div className='m-6 flex flex-col items-center mx-auto max-w-7xl'>
      <div className='flex flex-col md:flex-row gap-8 p-6 max-w-6xl mx-auto'>
        <div className='md:w-1/3 flex justify-center'>
          <div className='relative w-full max-w-md'>
            {isLoading ? (
              <div className='aspect-auto rounded-md bg-gray-200 animate-pulse min-w-[300px] min-h-[500px] w-full'></div>
            ) : remixedOptions.length > 0 ? (
              remixedOptions.map((imageUrl, index) => (
                <div key={index} className='relative cursor-pointer'>
                  <img
                    src={imageUrl}
                    alt={`Remix option ${index + 1}`}
                    className={`rounded-md hover:ring-2 hover:ring-purple-500 ${
                      card?.wedding_card_type?.type === 'save_date'
                        ? 'aspect-square'
                        : 'aspect-auto min-w-[300px] min-h-[500px]'
                    }`}
                    onError={e => {
                      console.error(`Failed to load image: ${imageUrl}`);
                      e.currentTarget.src = '/placeholder-image.jpg';
                      e.currentTarget.alt = 'Image failed to load';
                    }}
                  />
                  <div className='absolute top-2 left-2 bg-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium'>
                    {index + 1}
                  </div>
                </div>
              ))
            ) : (
              <></>
            )}

            {!isLoading && remixedOptions.length === 0 && (
              <img
                src={card?.image_url}
                alt='Wedding Card Preview'
                className={`rounded-md ${
                  card?.wedding_card_type?.type === 'save_date'
                    ? 'aspect-square'
                    : 'aspect-auto min-w-[300px] min-h-[500px]'
                }`}
              />
            )}
          </div>
        </div>

        <div className='md:w-2/3'>
          <h1 className='text-2xl font-bold mb-6'>Wedding Card</h1>

          <div className='mb-6'>
            <label className='block mb-2 text-sm font-medium'>
              Couples name
            </label>
            <div className='flex flex-col sm:flex-row gap-4'>
              <input
                type='text'
                placeholder='Enter groom name'
                value={groomName}
                onChange={e => setGroomName(e.target.value)}
                className='w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400'
              />
              <input
                type='text'
                placeholder='Enter bride name'
                value={brideName}
                onChange={e => setBrideName(e.target.value)}
                className='w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400'
              />
            </div>
          </div>

          <div className='flex flex-col sm:flex-row gap-4 mb-6'>
            <div className='sm:w-1/2'>
              <label
                htmlFor='date-picker'
                className='block mb-2 text-sm font-medium'
              >
                Event Date
              </label>
              <div className='relative' onClick={handleOpenDatePicker}>
                <div className='w-full flex items-center gap-2 px-4 py-3 rounded-2xl border border-gray-300 focus-within:ring-1 focus-within:ring-gray-400 cursor-pointer'>
                  <CalendarIcon className='h-5 w-5 text-gray-500' />
                  <span
                    className={`flex-1 text-left ${
                      date ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {date ? formatDate(date) : 'Choose date'}
                  </span>
                </div>
                <input
                  id='date-picker'
                  type='date'
                  ref={dateInputRef}
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className='absolute opacity-0 pointer-events-none'
                  aria-label='Choose date'
                />
              </div>
            </div>
            <div className='sm:w-1/2'>
              <label className='block mb-2 text-sm font-medium'>Location</label>
              <div className='w-full flex items-center gap-2 px-4 py-3 rounded-2xl border border-gray-300 focus-within:ring-1 focus-within:ring-gray-400'>
                <MapPin className='w-5 h-5 text-gray-500' />
                <input
                  type='text'
                  placeholder='Enter location'
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className='flex-1 border-none focus:outline-none p-0'
                />
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className='mb-6'>
            <label className='block mb-2 text-sm font-medium'>
              Color palette
            </label>
            <div className='flex gap-2'>
              {colorOptions.map(color => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-8 h-8 rounded-md ${
                    selectedColor === color.value
                      ? 'ring-2 ring-offset-2 ring-gray-400'
                      : ''
                  }`}
                  style={{ backgroundColor: color.value }}
                  aria-label={`Select ${color.label} color`}
                />
              ))}
            </div>
          </div>

          {/* Additional Instructions */}
          <div className='mb-6'>
            <label className='block mb-2 text-sm font-medium'>
              Additional instructions
            </label>
            <div className='border border-gray-300 rounded-2xl p-4'>
              <p className='font-medium mb-2'>Additional instructions</p>
              <textarea
                value={additionalInstructions}
                onChange={e => setAdditionalInstructions(e.target.value)}
                placeholder='Write additional instruction for your card'
                className='w-full h-32 resize-none border-none focus:outline-none p-0 text-gray-500'
              />
            </div>
          </div>

          {/* Show error message if any */}
          {error && (
            <div className='mb-4 p-3 bg-red-100 text-red-700 rounded-md'>
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4'>
            <button
              onClick={handleRemixCard}
              disabled={isRemixing}
              className='justify-center px-6 py-3 bg-[#6B21A8] text-white rounded-md hover:bg-purple-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2'
            >
              {isRemixing ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Remixing...
                </>
              ) : (
                'Remix Your Card'
              )}
            </button>
            <button
              className='px-6 py-3 border border-[#6B21A8] rounded-md hover:bg-gray-50 transition-colors'
              onClick={() => handleSaveImage(card?.image_url, Date.now())}
            >
              Download Your Card
            </button>
          </div>
        </div>
      </div>

      {/* Recent Generations Section */}
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h2 className='text-lg font-bold mb-4'>Recent Generations</h2>
          <div className='flex overflow-x-auto gap-4'>
            {isRecentGenerations
              ? skeletonrecentGenerations
                  .slice(0, 5)
                  .map((_, index) => (
                    <div
                      key={`recent-${index}`}
                      className='w-[168px] h-[224px] bg-slate-200 rounded-md cursor-pointer flex-shrink-0'
                    />
                  ))
              : recentGenerations
                  .slice(0, 6)
                  .map((data, index) => (
                    <img
                      src={data?.image_url}
                      alt={`Generation-${index}`}
                      key={`image-${index}`}
                      className={`rounded-md cursor-pointer flex-shrink-0 ${
                        data?.wedding_card_type?.type === 'save_date'
                          ? 'w-[168px] h-[168px] aspect-square'
                          : 'w-[168px] h-[224px]'
                      }`}
                    />
                  ))}
          </div>
        </div>

        {/* View More Button */}
        <div className='flex justify-center mb-12'>
          <button
            className='border border-gray-300 rounded-md px-6 py-2 text-sm hover:bg-gray-50 transition-colors'
            onClick={() => router.push('/recent-generation-list')}
          >
            View more
          </button>
        </div>

        {/* You May Also Like Section */}
        <div className='mb-8'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-lg font-bold'>You may also like</h2>
            <Link href='#' className='text-sm'>
              View all
            </Link>
          </div>
          <div className='flex overflow-x-auto gap-4'>
            {mayAlsoLike.map((data, index) => (
              <img
                src={data?.image_url}
                alt={`Generation-${index}`}
                key={`image-${index}`}
                className={`rounded-md cursor-pointer flex-shrink-0 ${
                  data?.wedding_card_type?.type === 'save_date'
                    ? 'w-[168px] h-[168px] aspect-square'
                    : 'w-[168px] h-[224px]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
