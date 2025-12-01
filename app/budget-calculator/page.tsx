'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Layout/Sidebar';
import { usePDF } from 'react-to-pdf';
import { addRecentActivity } from '@/utils/activity';
import { Menu as MenuIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { validateForm, FormErrors } from '@/utils/budgetValidation';
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  MapPinIcon,
  CalendarIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

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

export default function WeddingBudgetCalculator() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [totalBudget, setTotalBudget] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [location, setLocation] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [venueType, setVenueType] = useState('');
  const [generatedBudget, setGeneratedBudget] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({
    totalBudget: '',
    guestCount: '',
    location: '',
    weddingDate: '',
    venueType: '',
  });

  const { toPDF, targetRef } = usePDF({
    filename: 'wedding_budget_breakdown.pdf',
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const saveBudgetAsPDF = () => {
    const budgetElement = document.getElementById('budget-breakdown');
    if (budgetElement) {
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} with value: ${value}`); // Debug log
    switch (name) {
      case 'totalBudget':
        setTotalBudget(value);
        break;
      case 'guestCount':
        setGuestCount(value);
        break;
      case 'location':
        setLocation(value);
        break;
      case 'weddingDate':
        setWeddingDate(value);
        break;
      case 'venueType':
        setVenueType(value);
        break;
    }
  };

  const handleCalculateBudget = async () => {
    const errors = validateForm({
      totalBudget,
      guestCount,
      location,
      weddingDate,
      venueType,
    });
    setFormErrors(errors);

    if (Object.values(errors).some(error => error !== '')) {
      setError('Please correct the errors in the form.');
      setOpenSnackbar(true);
      return;
    }

    if (remainingCredits === null || remainingCredits < 1) {
      setError(
        'Insufficient credits. You need at least 1 credit to calculate a budget. Would you like to purchase more?'
      );
      setOpenSnackbar(true);
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/budget-calculator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalBudget,
          guestCount,
          location,
          weddingDate,
          venueType,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedBudget(data.budgetBreakdown);
      setRemainingCredits(data.remainingCredits);

      await addRecentActivity({
        type: 'budget',
        title: 'Wedding Budget Calculated',
        description: `Calculated budget for a ${venueType} wedding in ${location}`,
      });
    } catch (err) {
      console.error('Error details:', err);
      setError(
        `An error occurred while calculating the budget: ${err instanceof Error ? err.message : String(err)}`
      );
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const venueTypes = [
    'Indoor Banquet Hall',
    'Outdoor Garden',
    'Beach',
    'Rustic Barn',
    'Urban Loft',
    'Hotel Ballroom',
    'Vineyard',
    'Historic Mansion',
    'Mountain Resort',
    'Cruise Ship',
  ];

  const inputClassName =
    'w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900';

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
              <div className='px-8 py-8'>
                <h2 className='text-4xl font-serif text-white mb-4'>
                  Wedding Budget Calculator
                </h2>
                <p className='text-purple-100 text-lg max-w-2xl'>
                  Plan your perfect wedding with our smart budget allocation
                  tool
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className='max-w-7xl mx-auto p-8'>
            {/* Budget Calculator Form */}
            <div className='bg-white rounded-2xl shadow-lg border border-purple-100 p-8 space-y-6'>
              <div>
                <label className='text-lg font-semibold text-purple-900 block mb-2'>
                  Total Budget($)
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none'>
                    <CurrencyDollarIcon className='h-5 w-5 text-purple-400' />
                  </div>
                  <input
                    type='text'
                    name='totalBudget'
                    value={totalBudget}
                    onChange={handleInputChange}
                    className={`${inputClassName} pl-12`}
                    placeholder='Enter your total budget'
                  />
                </div>
                {formErrors.totalBudget && (
                  <p className='mt-2 text-sm text-red-600'>
                    {formErrors.totalBudget}
                  </p>
                )}
              </div>

              <div>
                <label className='text-lg font-semibold text-purple-900 block mb-2'>
                  Number of Guests
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none'>
                    <UserGroupIcon className='h-5 w-5 text-purple-400' />
                  </div>
                  <input
                    type='text'
                    name='guestCount'
                    value={guestCount}
                    onChange={handleInputChange}
                    className={`${inputClassName} pl-12`}
                    placeholder='Enter number of guests'
                  />
                </div>
                {formErrors.guestCount && (
                  <p className='mt-2 text-sm text-red-600'>
                    {formErrors.guestCount}
                  </p>
                )}
              </div>

              <div>
                <label className='text-lg font-semibold text-purple-900 block mb-2'>
                  Wedding Location
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none'>
                    <MapPinIcon className='h-5 w-5 text-purple-400' />
                  </div>
                  <input
                    type='text'
                    name='location'
                    value={location}
                    onChange={handleInputChange}
                    className={`${inputClassName} pl-12`}
                    placeholder='Enter wedding location'
                  />
                </div>
                {formErrors.location && (
                  <p className='mt-2 text-sm text-red-600'>
                    {formErrors.location}
                  </p>
                )}
              </div>

              <div>
                <label className='text-lg font-semibold text-purple-900 block mb-2'>
                  Wedding Date
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none'>
                    <CalendarIcon className='h-5 w-5 text-purple-400' />
                  </div>
                  <input
                    type='date'
                    name='weddingDate'
                    value={weddingDate}
                    onChange={handleInputChange}
                    className={`${inputClassName} pl-12`}
                  />
                </div>
                {formErrors.weddingDate && (
                  <p className='mt-2 text-sm text-red-600'>
                    {formErrors.weddingDate}
                  </p>
                )}
              </div>

              <div>
                <label className='text-lg font-semibold text-purple-900 block mb-2'>
                  Venue Type
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none'>
                    <HomeIcon className='h-5 w-5 text-purple-400' />
                  </div>
                  <select
                    name='venueType'
                    value={venueType}
                    onChange={handleInputChange}
                    className={`${inputClassName} pl-12`}
                  >
                    <option value=''>Select a venue type...</option>
                    {venueTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                {formErrors.venueType && (
                  <p className='mt-2 text-sm text-red-600'>
                    {formErrors.venueType}
                  </p>
                )}
              </div>

              <div className='flex justify-center pt-4'>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCalculateBudget}
                  className='w-full px-6 py-3 text-white bg-purple-900 rounded-full hover:bg-purple-800 transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
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
                      <span>Calculating...</span>
                    </>
                  ) : (
                    <>
                      <CurrencyDollarIcon className='h-5 w-5' />
                      <span>Calculate Budget</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Generated Budget */}
            {generatedBudget && (
              <div className='mt-8 space-y-6'>
                <h2 className='text-2xl font-serif text-purple-900'>
                  Your Wedding Budget Breakdown
                </h2>
                <div
                  className='bg-white rounded-2xl shadow-lg border border-purple-100 p-8 relative group'
                  ref={targetRef}
                >
                  <pre className='whitespace-pre-wrap text-gray-600'>
                    {generatedBudget}
                  </pre>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toPDF()}
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
