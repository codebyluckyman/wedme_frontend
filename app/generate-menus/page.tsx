'use client';

import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import { usePDF } from 'react-to-pdf';
import { addRecentActivity } from '@/utils/activity';
import { Menu as MenuIcon, Check, ChevronDown } from 'lucide-react';
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
interface MultiSelectOption {
  value: string;
  label: string;
}

const MultiSelectDropdown: React.FC<{
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
}> = ({ options, selected, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='relative' ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className='w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 flex items-center justify-between cursor-pointer'
      >
        <div className='flex-1'>
          {selected.length > 0 ? (
            <span>
              {selected
                .map(s => options.find(o => o.value === s)?.label)
                .join(', ')}{' '}
            </span>
          ) : (
            <span className='text-gray-500'> {placeholder} </span>
          )}
        </div>
        <div className='flex items-center gap-2'>
          {selected.length > 0 && (
            <span className='text-xs bg-primary/10 text-primary px-2 py-1 rounded'>
              {selected.length} selected
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {isOpen && (
        <div className='absolute z-50 w-full mt-1 bg-white border border-purple-200 rounded-lg shadow-lg max-h-60 overflow-auto'>
          <div className='p-2 text-xs text-gray-500 border-b border-gray-100'>
            Select multiple items
          </div>
          {options.map(option => (
            <label
              key={option.value}
              className='flex items-center px-4 py-2 hover:bg-primary/5 cursor-pointer'
            >
              <input
                type='checkbox'
                checked={selected.includes(option.value)}
                onChange={() => {
                  const updatedSelected = selected.includes(option.value)
                    ? selected.filter(item => item !== option.value)
                    : [...selected, option.value];
                  onChange(updatedSelected);
                }}
                className='mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
              />
              <span className='text-gray-900'> {option.label} </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default function GenerateMenus() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [generatedMenus, setGeneratedMenus] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const { toPDF, targetRef } = usePDF({ filename: 'wedding_menus.pdf' });

  const cuisineOptions = [
    { value: 'indian', label: 'Indian' },
    { value: 'american', label: 'American' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'thai', label: 'Thai' },
    { value: 'mexican', label: 'Mexican' },
    { value: 'italian', label: 'Italian' },
    { value: 'mediterranean', label: 'Mediterranean' },
  ];

  const dietaryOptions = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten-free', label: 'Gluten-Free' },
    { value: 'dairy-free', label: 'Dairy-Free' },
    { value: 'nut-free', label: 'Nut-Free' },
    { value: 'halal', label: 'Halal' },
    { value: 'kosher', label: 'Kosher' },
    { value: 'low-carb', label: 'Low-Carb' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const saveMenuAsPDF = (menuIndex: number) => {
    const menuElement = document.getElementById(`menu-${menuIndex}`);
    if (menuElement) {
      toPDF();
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error redirecting to Stripe:', error);
      setError(
        'An error occurred while trying to redirect to checkout. Please try again.'
      );
      setOpenSnackbar(true);
    }
  };

  const handleGenerateMenus = async () => {
    if (cuisines.length === 0) {
      setError('Please select at least one cuisine.');
      setOpenSnackbar(true);
      return;
    }

    if (remainingCredits === null || remainingCredits < 2) {
      setError(
        'Insufficient credits. You need at least 2 credits to generate a menu. Would you like to purchase more?'
      );
      setOpenSnackbar(true);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formattedDietaryRestrictions = dietaryRestrictions
        .map(value => dietaryOptions.find(opt => opt.value === value)?.label)
        .join(', ');

      const response = await fetch('/api/generatemenu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cuisines,
          dietaryRestrictions: formattedDietaryRestrictions,
          additionalInstructions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          'Error response:',
          response.status,
          response.statusText,
          errorData
        );
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.menu_option1 || !data.menu_option2) {
        console.error('Unexpected response format:', data);
        throw new Error('Unexpected response format from the server');
      }

      setGeneratedMenus([data.menu_option1, data.menu_option2]);

      // Update credits (decrement by 2)
      const creditResponse = await fetch('/api/credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'decrement', amount: 2 }),
      });
      if (!creditResponse.ok) {
        throw new Error('Failed to update credits');
      }
      const creditData = await creditResponse.json();
      setRemainingCredits(creditData.credits);

      await addRecentActivity({
        type: 'menu',
        title: 'New Menu Generated',
        description: `Generated a menu for ${cuisines.join(', ')} cuisine(s)`,
      });
    } catch (err) {
      console.error('Error details:', err);
      setError(
        `An error occurred while generating the menus: ${err instanceof Error ? err.message : String(err)}`
      );
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 w-full'>
      <div className='flex-1 min-h-screen'>
        <div className={`transition-all duration-300 ease-in-out`}>
          {/* Header */}
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
                  Wedding Menu Generator
                </h2>
                <p className='text-purple-100 text-lg max-w-2xl'>
                  Create perfect wedding menus tailored to your preferences
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className='max-w-7xl mx-auto p-8'>
            <div className='bg-white rounded-2xl shadow-lg border border-purple-100 p-8 space-y-6'>
              <div>
                <label className='text-lg font-semibold text-purple-900 block mb-2'>
                  Select Cuisines
                </label>
                <MultiSelectDropdown
                  options={cuisineOptions}
                  selected={cuisines}
                  onChange={setCuisines}
                  placeholder='Select cuisines...'
                />
              </div>

              <div>
                <label className='text-lg font-semibold text-purple-900 block mb-2'>
                  Dietary Restrictions
                </label>
                <MultiSelectDropdown
                  options={dietaryOptions}
                  selected={dietaryRestrictions}
                  onChange={setDietaryRestrictions}
                  placeholder='Select dietary restrictions...'
                />
              </div>

              <div>
                <label className='text-lg font-semibold text-purple-900 block mb-2'>
                  Additional Instructions
                </label>
                <textarea
                  className='w-full px-6 py-3 border border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 text-purple-900'
                  rows={4}
                  value={additionalInstructions}
                  onChange={e => setAdditionalInstructions(e.target.value)}
                  placeholder='Please add additional instructions here...'
                />
              </div>

              {/* Quick Suggestions */}
              <div>
                <h3 className='text-lg font-semibold text-purple-900 mb-4'>
                  Quick Suggestions
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {[
                    'Fusion American-Chinese wedding feast',
                    'Vegetarian Indian Street Food bonanza',
                    'Gourmet Food Truck Inspired Menu',
                    'Organic Vegan Mexican Cuisine',
                  ].map((suggestion, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className='px-6 py-3 bg-purple-50 text-purple-900 rounded-xl border border-purple-100 text-sm hover:bg-purple-100 transition-colors duration-200'
                      onClick={() => setAdditionalInstructions(suggestion)}
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className='flex justify-center pt-4'>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateMenus}
                  className='w-full px-6 py-3 text-white bg-purple-900 rounded-full hover:bg-purple-800 transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50'
                  disabled={isLoading}
                >
                  {isLoading ? 'Generating...' : 'Generate Menus'}
                </motion.button>
              </div>
            </div>

            {/* Generated Menus */}
            {generatedMenus.length > 0 && (
              <div className='mt-8 space-y-6'>
                <h2 className='text-2xl font-serif text-purple-900'>
                  Your Generated Menus
                </h2>
                <div className='grid grid-cols-1 gap-8'>
                  {generatedMenus.map((menu, index) => (
                    <div
                      key={index}
                      className='bg-white rounded-2xl shadow-lg border border-purple-100 p-6 relative group'
                    >
                      <div
                        id={`menu-${index}`}
                        ref={index === 0 ? targetRef : undefined}
                        className='pr-10'
                      >
                        <h3 className='text-xl font-semibold text-purple-900 mb-4'>
                          Menu Option {index + 1}
                        </h3>
                        <pre className='whitespace-pre-wrap text-gray-600'>
                          {menu}
                        </pre>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => saveMenuAsPDF(index)}
                        className='absolute top-4 right-4 p-3 rounded-full bg-purple-900 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-purple-800'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4'
                          />
                        </svg>
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
      {openSnackbar && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className='fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50'
        >
          {error}
          {error.includes('Insufficient credits') && (
            <button
              onClick={redirectToStripeCheckout}
              className='ml-4 bg-white text-red-500 px-2 py-1 rounded-md hover:bg-red-100 transition-colors duration-200'
            >
              Purchase Credits
            </button>
          )}
          <button
            onClick={() => setOpenSnackbar(false)}
            className='ml-2 text-white hover:text-gray-200 focus:outline-none'
          >
            <span className='sr-only'> Close </span>
            <svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </motion.div>
      )}
    </div>
  );
}
