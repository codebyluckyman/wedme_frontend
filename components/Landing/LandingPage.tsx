'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  UserCircle,
  ChevronDown,
  ArrowRight,
  SparklesIcon,
  Users,
  Search,
} from 'lucide-react';
import { WeddingRingsLogo } from '../icons';
import WeddingTemplateShowcase from '../weddingTemplateShow';
import WeddingVendorShowcase from '../weddingVendorshow';

const LandingPage = () => {
  const router = useRouter();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: 'Who we are ?',
      answer:
        'We’re a team of creators, engineers, and problem solvers building the future of wedding planning with AI.',
    },
    {
      question: 'What do we do?',
      answer:
        'Wedme.ai helps couples find personalized and transparent vendor pricing using AI. We also offer tools to design wedding elements like backdrops and aisles.',
    },
    {
      question: 'Is wedme.ai free?',
      answer: 'Yes, it’s free to use while we’re in beta.',
    },
    {
      question: 'How are we different?',
      answer:
        'We’ve collected data from 10,000+ vendors to deliver pricing transparency, personalized planning, and culturally aware designs—all powered by AI.',
    },
    {
      question: 'What locations does Wedme.ai support?',
      answer:
        'Our tools work globally, but our smart vendor search is currently optimized for the U.S. and India.',
    },
    {
      question: 'Can vendors sign up?',
      answer: (
        <>
          Yes! Vendors can sign up using this{' '}
          <Link
            href='https://docs.google.com/forms/d/e/1FAIpQLSf1wGnyve5_EdT8GFpnssK0M4E4EyPk9LN4KkM31N6L7PNyZA/viewform'
            target='_blank'
            className='text-purple-700 hover:text-purple-900 underline'
          >
            form
          </Link>
          .
        </>
      ),
    },
    {
      question: 'How do i get the pdf prices for vendors?',
      answer:
        'Head to the wedding-assistant to talk to wedme in natural language to get the pdf prices; we have a database of 10,000 + vendors if you do not recieve a result it is safe to assume we do not have it yet.',
    },
  ];

  const designTemplates = [
    '/images/wedding_bridal_shower_1.png',
    '/images/wedding_bridal_shower_2.png',
    '/images/wedding_bridal_shower_3.png',
    '/images/wedding_bridal_shower_4.png',
    '/images/wedding_bridal_shower_5.png',
    '/images/wedding_bridal_shower_6.png',
  ];

  const templatePrompts = [
    'CREATE A RUSTIC WEDDING INVITATION WITH FLORAL ELEMENTS',
    'DESIGN AN ELEGANT BLACK-TIE WEDDING CARD',
    'GENERATE A BEACH-THEMED WEDDING INVITATION',
    'MAKE A MINIMALIST MODERN WEDDING ANNOUNCEMENT',
    'CREATE A TRADITIONAL WEDDING CARD WITH GOLD ACCENTS',
    'DESIGN A VINTAGE-STYLE WEDDING INVITATION',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Add these helper functions
  const nextSlide = () => {
    setCurrentIndex(prev =>
      prev === designTemplates.length - 3 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex(prev =>
      prev === 0 ? designTemplates.length - 3 : prev - 1
    );
  };

  return (
    <div className='w-full'>
      <div className='bg-gradient-to-b from-[#f5e6ff] to-[#ffffff]'>
        <nav className='flex items-center justify-between px-4 py-4 max-w-[66rem] mx-auto '>
          <div className='flex items-center'>
            <h1 className='text-2xl font-semibold text-[#6B21A8]'>wedme.ai</h1>
            <div className='flex justify-center items-center'>
              <WeddingRingsLogo />
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <button
              className='px-6 py-2 bg-[#6b21a8] text-white text-md font-medium rounded-xl hover:bg-[#6b21a8]/90 transition-colors md:block hidden'
              onClick={() => router.push('/signup')}
            >
              Get started
            </button>

            <button
              onClick={() => router.push('/signin')}
              className='px-6 py-2 bg-transparent text-black text-md font-medium rounded-xl border-2 border-[#6b21a8] hover:bg-transparent/5 transition-colors'
            >
              Sign in
            </button>

            <Link
              target='_blank'
              href='https://forms.gle/YMjBUZmN5UXenEgd9'
              className='px-6 py-2 bg-transparent text-black text-md font-medium rounded-xl border-2 border-[#6b21a8] hover:bg-transparent/5 transition-colors md:flex items-center gap-2 hidden'
            >
              <UserCircle className='w-6 h-6' strokeWidth={2} />
              Vendors
            </Link>
          </div>
        </nav>

        <main className='flex flex-col items-center px-4 pt-20 text-center md:pt-32 max-w-6xl mx-auto'>
          <div className='inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff00ff] to-[#9527fd] px-4 py-2 text-sm text-white'>
            <Sparkles className='h-4 w-4' />
            AI Powered Wedding Planning Assistant
          </div>

          <h2 className='mt-8 max-w-4xl text-3xl font-bold tracking-tight text-[#0e001b] md:text-4xl lg:text-5xl'>
            Your AI Wedding Planner.
          </h2>
          <h2 className='mt-4 max-w-4xl text-3xl font-bold tracking-tight text-[#0e001b] md:text-4xl lg:text-5xl'>
            10x Faster. Stress-Free.
          </h2>

          <p className='mt-6 max-w-2xl text-lg text-[#05000A]'>
            Get personalized venue and vendor suggestions
            <br />
            from <span className='font-semibold'>10,000+ options.</span>
          </p>

          <div className='flex gap-3'>
            <button
              className='mt-8 rounded-lg bg-[#6b21a8] px-8 w-[220px] py-2 text-lg text-white hover:bg-[#9527fd] transition-colors'
              onClick={() => router.push('/signup')}
            >
              Try It Now
            </button>
          </div>

          {/* AI Chat Examples */}
          <div className='mt-16 flex flex-wrap justify-center gap-4 max-w-6xl'>
            {[
              'Find beach venues in LA under $15k',
              'Suggest Indian cateres in NYC',
              "What's the best season for an outdoor wedding?",
              'Suggest make up artist specialized in jewish weddings',
              "Find me DJ's that have experience with Mexican weddings",
              'Find me pdf prices of venues that are in Longisland, NY with my budget of 30,000k USD',
            ].map((text, index) => (
              <div
                key={index}
                className='group bg-[#ECD2FF36]/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-gray-700 border border-[#6B21A833] relative flex items-center gap-2'
              >
                <Search className='w-4 h-4 text-purple-600 opacity-0 hidden group-hover:block group-hover:opacity-100 transition-opacity duration-300' />
                <span className='group-hover:translate-x-1 transition-transform duration-300 ease-in-out'>
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* Statistics Cards */}
          <div className='mt-20 flex flex-col md:flex-row gap-8 w-full max-w-2xl'>
            <div className='bg-white rounded-2xl p-8 shadow-lg flex-1 flex'>
              <div className='flex items-center gap-4 my-auto'>
                <div className='w-[56px] h-[56px] bg-[#B6ADE7] rounded-md flex items-center justify-center'>
                  <SparklesIcon className='w-6 h-6 text-white' fill='white' />
                </div>
                <div className='text-left'>
                  <div className='text-4xl font-extrabold text-gray-900'>
                    22,000+
                  </div>
                  <div className='text-gray-600'>AI interactions</div>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-2xl p-8 shadow-lg flex-1 flex'>
              <div className='flex items-center gap-4 my-auto'>
                <div className='min-w-[56px] h-[56px] bg-[#FFEADD] rounded-md flex items-center justify-center'>
                  <Users className='w-6 h-6 text-[#FF741A]' fill='#FF741A' />
                </div>
                <div className='text-left'>
                  <div className='text-4xl font-extrabold text-gray-900'>
                    10,000+
                  </div>
                  <div className='text-gray-600'>
                    Vetted vendors across 30+ cities.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Vendor Discovery Section */}
      <section className='max-w-6xl mx-auto mt-20 mb-32 md:px-0 px-6'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Discover vendors the smart,
            <br />
            transparent, and personal way.
          </h2>
        </div>

        <WeddingVendorShowcase />
      </section>

      <WeddingTemplateShowcase />

      <div className='min-h-screen'>
        {/* How it works section */}
        <section className='max-w-6xl mx-auto mb-20 md:px-0 px-6'>
          <h2 className='text-3xl md:text-4xl font-bold text-center mb-4'>
            How it works
          </h2>
          <p className='text-center mb-8'>
            Talk to wedme.ai, to generate invitations, find <br />
            vendors and budgets.
          </p>
          <div className='flex justify-center'>
            <Link
              href='https://calendly.com/deepakorani/wedme-ai-consultation'
              target='_blank'
              rel='noopener noreferrer'
              className='bg-[#6b21a8] hover:bg-[#9527fd] text-white px-8 py-3 rounded-lg transition-colors'
            >
              Schedule a demo
            </Link>
          </div>
        </section>

        <div className='flex flex-col text-center pb-20  text-black max-w-screen-md mx-auto md:px-0 px-6'>
          <div className='aspect-w-18 aspect-h-12'>
            <iframe
              className='w-full aspect-video rounded-lg shadow-lg'
              src='https://www.youtube.com/embed/nYDtor8Hz0o'
              title='wedme.ai Beta Video'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          </div>
        </div>

        {/* Plan your dream wedding section */}
        <div className='w-full bg-[#8F19FF] flex flex-col justify-center pt-20'>
          <div className='flex md:flex-row flex-col items-center justify-center w-full'>
            <div className='w-full'>
              <div className='max-w-[480px] ml-auto md:text-start text-center md:pr-10 pr-0 md:mb-0 mb-10'>
                <h2 className='text-3xl md:text-4xl font-bold mb-4 text-white md:text-start text-center'>
                  Find Vendors in <br /> minutes
                </h2>
                <p className='text-white md:text-start text-center'>
                  With wedme.ai, you can now envision to find vendors
                  <br className='md:block hidden' />
                  smartly and efficiently
                </p>
                <div className='flex md:justify-start justify-center'>
                  <button
                    className='bg-white hover:bg-[white]/80 px-8 py-3 rounded-lg transition-colors mt-6'
                    onClick={() => router.push('/signup')}
                  >
                    Get started it's free
                  </button>
                </div>
              </div>
            </div>
            <div className='w-full'>
              <img src='/images/Rectangle 391.png' className='w-full' />
            </div>
          </div>
        </div>

        {/* Ready to get started section */}
        <div className='w-full py-32 flex flex-col justify-center md:px-0 px-6'>
          <section className='w-full my-auto relative'>
            <div className='flex md:flex-row flex-col items-center justify-center md:gap-20 gap-10'>
              <div>
                <h2 className='text-3xl md:text-4xl font-bold mb-4 md:text-start text-center'>
                  Ready to get <br className='md:block hidden' /> started ?
                </h2>
                <p className='md:text-start text-center'>
                  We have a generous free tier available to get you
                  <br className='md:block hidden' />
                  started right away.
                </p>
              </div>
              <img
                src='/images/landing_ready.png'
                className='md:max-w-[500px]'
              />
            </div>
          </section>
        </div>

        {/* FAQ Section */}
        <section className='max-w-4xl mx-auto mb-32 md:px-0 px-6 mt-10'>
          <h2 className='text-3xl md:text-4xl font-bold text-center mb-16 animate-fade-in'>
            Frequently Asked
            <br />
            Questions
          </h2>

          <div className='space-y-4'>
            {faqData.map((faq, index) => (
              <div
                key={index}
                className='border border-gray-200 rounded-2xl overflow-hidden animate-slide-up'
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className='w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-300'
                >
                  <span className='font-medium text-lg'>{faq.question}</span>
                  <div
                    className={`w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center transition-transform duration-300 ${
                      openFAQ === index ? 'rotate-180' : ''
                    }`}
                  >
                    <ChevronDown className='w-4 h-4' />
                  </div>
                </button>
                {openFAQ === index && (
                  <div className='px-6 pb-4 text-gray-600 animate-fade-down'>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <footer className='bg-[#040008] text-white py-16 w-full'>
          <div className='container mx-auto px-4 md:px-40 my-auto relative'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
              {/* Legal Section */}
              <div className='space-y-6'>
                <h3 className='text-xl font-semibold mb-4'>Legal</h3>
                <nav className='flex flex-col space-y-4'>
                  <Link
                    href='https://www.termsfeed.com/live/9c69fce9-ddcf-4b51-ba49-1b49d600abca'
                    className='text-white/80 hover:text-white transition-colors'
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href='https://www.termsfeed.com/live/2f6c05f5-0c00-45d6-9328-575f4e615a50'
                    className='text-white/80 hover:text-white transition-colors'
                  >
                    Terms of service
                  </Link>
                </nav>
              </div>

              {/* Subscribe Section */}
              <div className='space-y-6'>
                <h2 className='text-2xl font-semibold leading-tight max-w-md'>
                  Subscribe our waitlist to get updates on new feature releases.
                </h2>
                <div className='flex flex-col sm:flex-row gap-3 max-w-md'>
                  <input
                    type='email'
                    placeholder='Enter your email address'
                    className='w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg 
                         text-white placeholder:text-white/50 focus:outline-none focus:ring-2 
                         focus:ring-[#6b21a8] focus:border-transparent'
                  />
                  <button
                    className='px-6 py-2.5 bg-[#6b21a8] hover:bg-[#6b21a8]/90 text-white 
                         rounded-lg transition-colors duration-200 font-medium
                         focus:outline-none focus:ring-2 focus:ring-[#6b21a8] focus:ring-offset-2 
                         focus:ring-offset-[#040008]'
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
