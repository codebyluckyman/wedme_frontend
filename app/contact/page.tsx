'use client';

import { useRef } from 'react';
import {
  Mail,
  MessageSquare,
  Phone,
  Clock,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className='bg-gradient-to-br from-slate-50 to-white w-full'>
      <div className='py-12 px-6 md:px-8 max-w-7xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-12 text-center'
        >
          <h2 className='text-3xl md:text-4xl font-bold text-slate-800 mb-4'>
            Get in Touch
          </h2>
          <p className='text-slate-600 max-w-2xl mx-auto'>
            We're here to help make your wedding planning journey smooth and
            enjoyable. Reach out to us with any questions or concerns.
          </p>
        </motion.div>

        <motion.div
          ref={containerRef}
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className='bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-100 transition-all duration-300'
          >
            <div className='p-6 md:p-8 space-y-5'>
              <div className='flex items-center space-x-4'>
                <div className='w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center transition-all duration-300 group-hover:bg-purple-100'>
                  <Mail className='w-6 h-6 text-[#6B21A8]' />
                </div>
                <h3 className='text-xl font-semibold text-slate-800'>
                  General Support
                </h3>
              </div>
              <p className='text-slate-600 text-sm leading-relaxed'>
                Get help with your wedding planning needs and general inquiries
              </p>
              <a
                href={`mailto:teamsupport@wedme.ai`}
                className='group w-full py-3 px-4 bg-white border-2 border-[#6B21A8] text-[#6B21A8] rounded-lg hover:bg-[#6B21A8] hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 font-medium'
              >
                <span>Send Email</span>
                <ArrowRight className='w-4 h-4 transition-transform duration-300 group-hover:translate-x-1' />
              </a>
            </div>
          </motion.div>
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className='bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-100 transition-all duration-300'
          >
            <div className='p-6 md:p-8 space-y-5'>
              <div className='flex items-center space-x-4'>
                <div className='w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center transition-all duration-300 group-hover:bg-purple-100'>
                  <Mail className='w-6 h-6 text-[#6B21A8]' />
                </div>
                <h3 className='text-xl font-semibold text-slate-800'>
                  Business Inquiries
                </h3>
              </div>
              <p className='text-slate-600 text-sm leading-relaxed'>
                For partnerships, collaborations, and business opportunities
              </p>
              <a
                href='https://forms.gle/YMjBUZmN5UXenEgd9'
                target='_blank'
                className='group w-full py-3 px-4 bg-white border-2 border-[#6B21A8] text-[#6B21A8] rounded-lg hover:bg-[#6B21A8] hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 font-medium'
              >
                <span>Vendors</span>
                <ArrowRight className='w-4 h-4 transition-transform duration-300 group-hover:translate-x-1' />
              </a>
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className='mt-10'
        >
          <div className='bg-gradient-to-r from-purple-50 to-slate-50 rounded-xl shadow-sm border border-slate-100 transition-all duration-300'>
            <div className='p-6 md:p-8'>
              <div className='flex flex-col md:flex-row md:items-center gap-4'>
                <div className='w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center'>
                  <Clock className='w-6 h-6 text-[#6B21A8]' />
                </div>
                <div className='flex-1'>
                  <h3 className='text-xl font-semibold text-slate-800'>
                    Fast Response Time
                  </h3>
                  <p className='text-slate-600 mt-2 leading-relaxed'>
                    We typically respond within 24 hours. Thank you for being a
                    valued part of the wedme.ai community. We look forward to
                    assisting you with your wedding planning needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className='mt-16 text-center text-slate-500 text-sm'
        >
          <p>© {new Date().getFullYear()} wedme.ai. All rights reserved.</p>
        </motion.footer>
      </div>
    </div>
  );
}
