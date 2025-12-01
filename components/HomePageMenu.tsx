import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

type ActivityItem = {
  type: 'menu' | 'venue' | 'search';
  title: string;
  description: string;
  date: string;
};

interface HomePageMenuProps {
  recentActivity: ActivityItem[];
}

const HomePageMenu: React.FC<HomePageMenuProps> = ({ recentActivity }) => {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'menu':
        return '🍽️';
      case 'venue':
        return '🏰';
      case 'search':
        return '🔍';
      default:
        return '📌';
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-lg p-6'>
      <h2 className='text-xl font-semibold mb-4 text-gray-800'>
        Recent Activity
      </h2>
      <div className='space-y-4'>
        {recentActivity.slice(0, 5).map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className='flex items-center space-x-4 p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors'
          >
            <span className='text-2xl'>{getIcon(item.type)}</span>
            <div>
              <h3 className='font-semibold text-indigo-800'>{item.title}</h3>
              <p className='text-sm text-gray-600'>{item.description}</p>
              <p className='text-xs text-gray-500 mt-1'>{item.date}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default HomePageMenu;
