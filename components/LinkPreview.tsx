// import { ExternalLink, Globe } from 'lucide-react';

// interface LinkPreview {
//   title: string;
//   description: string;
//   image: string;
//   url: string;
//   favicon?: string;
//   domain?: string;
// }

// const LinkPreviewCard = ({ preview }: { preview: LinkPreview }) => {
//   return (
//     <div className='overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-purple-200'>
//       <div className='relative'>
//         {preview.image && (
//           <div className='aspect-video w-full overflow-hidden bg-gray-100'>
//             <img
//               src={preview.image || '/placeholder.svg'}
//               alt={preview.title}
//               className='h-full w-full object-cover transition-transform duration-500 hover:scale-105'
//             />
//           </div>
//         )}
//         <div className='absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-sm'>
//           {preview.favicon ? (
//             <img
//               src={preview.favicon || '/placeholder.svg'}
//               alt=''
//               className='h-3.5 w-3.5'
//             />
//           ) : (
//             <Globe className='h-3.5 w-3.5 text-white' />
//           )}
//           <span className='text-xs font-medium text-white'>
//             {preview.domain ||
//               new URL(preview.url).hostname.replace('www.', '')}
//           </span>
//         </div>
//       </div>
//       <div className='p-4'>
//         <h3 className='mb-1 line-clamp-2 font-semibold text-gray-800'>
//           {preview.title}
//         </h3>
//         <p className='mb-3 line-clamp-2 text-sm text-gray-600'>
//           {preview.description}
//         </p>
//         <a
//           href={preview.url}
//           target='_blank'
//           rel='noopener noreferrer'
//           className='inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 transition-colors hover:bg-purple-100'
//         >
//           Visit site
//           <ExternalLink className='ml-0.5 h-3 w-3' />
//         </a>
//       </div>
//     </div>
//   );
// };

// export default LinkPreviewCard;

'use client';

import { Globe, ArrowUpRight, Image } from 'lucide-react';
import { useState } from 'react';

interface LinkPreview {
  title: string;
  description: string;
  image: string;
  url: string;
  favicon?: string;
  domain?: string;
}

const ImageSkeleton = () => (
  <div className='md:w-1/3 flex-shrink-0 bg-gray-100 animate-pulse relative'>
    <div className='h-[200px] w-full flex items-center justify-center'>
      <Image className='w-10 h-10 text-gray-300' strokeWidth={1.5} />
    </div>
  </div>
);

const LinkPreviewCard = ({ preview }: { preview: LinkPreview }) => {
  const [imageError, setImageError] = useState(false);
  const domain =
    preview.domain || new URL(preview.url).hostname.replace('www.', '');

  return (
    <div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md group'>
      <div className='flex flex-col md:flex-row'>
        {preview.image ? (
          !imageError ? (
            <div className='md:w-1/3 flex-shrink-0 overflow-hidden bg-gray-50 relative'>
              <img
                src={preview.image || '/placeholder.svg'}
                alt=''
                className='h-[200px] w-full object-cover transition-transform duration-500 group-hover:scale-105'
                onError={() => setImageError(true)}
                loading='lazy'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            </div>
          ) : (
            <ImageSkeleton />
          )
        ) : (
          <ImageSkeleton />
        )}

        <div
          className={`flex-1 flex flex-col p-4 ${preview.image && !imageError ? 'md:p-5' : 'p-4'}`}
        >
          <div className='flex items-center gap-2 mb-2'>
            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200'>
              {preview.favicon ? (
                <img
                  src={preview.favicon || '/placeholder.svg'}
                  alt=''
                  className='h-full w-full'
                  onError={e => (e.currentTarget.src = '')}
                />
              ) : (
                <Globe className='h-3 w-3 text-gray-600' />
              )}
            </div>
            <span className='text-xs font-medium text-gray-600'>{domain}</span>
          </div>

          <h3 className='text-base font-semibold text-gray-900 mb-1.5 line-clamp-2 group-hover:text-purple-700 transition-colors'>
            {preview.title}
          </h3>
          <p className='text-sm text-gray-600 line-clamp-2 mb-3 flex-grow'>
            {preview.description}
          </p>

          <div className='flex items-center justify-between mt-auto'>
            <a
              href={preview.url}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors group/link'
            >
              Visit site
              <ArrowUpRight className='h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5' />
            </a>
            <span className='text-xs text-gray-400'>{domain}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkPreviewCard;
