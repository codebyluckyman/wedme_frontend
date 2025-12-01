// Card.tsx
import Link from 'next/link';
import React from 'react';

interface CardProps {
  title: string;
  description: string;
  link: string;
}

const Card: React.FC<CardProps> = ({ title, description, link }) => {
  return (
    <div className='bg-white shadow-md rounded-lg p-6 w-full hover:shadow-lg transition-shadow duration-300'>
      <h3 className='text-xl font-semibold mb-3 text-gray-800'>{title}</h3>
      <p className='text-gray-600 mb-4'>{description}</p>
      <Link
        href={link}
        className='text-purple-600 hover:text-purple-800 font-medium transition-colors duration-300'
      >
        Go to {title} &rarr;
      </Link>
    </div>
  );
};

export default Card;
