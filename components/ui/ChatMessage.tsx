// import { ChatMessageInterface } from '@/app/@types';
// import { FileText, Heart, Link2 } from 'lucide-react';
// import { useState } from 'react';
// import { PdfPreviewModal } from './PdfPreviewModal';
// import ReactMarkdown from 'react-markdown';

// export const ChatMessage = ({
//   message,
//   onViewSources,
// }: {
//   message: ChatMessageInterface;
//   onViewSources: (sources: string[]) => void;
// }) => {
//   const isUser = message.role === 'user';

//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);

//   const handlePdfPreview = (url: string) => {
//     setPdfUrl(url);
//   };

//   const closePdfPreview = () => {
//     setPdfUrl(null);
//   };

//   return (
//     <div
//       className={`mb-6 ${isUser ? 'flex justify-end' : 'flex justify-start'}`}
//     >
//       <div
//         className={`max-w-[85%] overflow-hidden ${isUser ? 'rounded-t-2xl rounded-bl-2xl bg-purple-700 text-white' : 'rounded-t-2xl rounded-br-2xl bg-white border border-gray-200 shadow-sm'}`}
//       >
//         <div className='p-4'>
//           {!isUser && (
//             <div className='flex items-center gap-2 mb-2'>
//               <div className='flex h-7 w-7 items-center justify-center rounded-full bg-purple-100'>
//                 <Heart className='h-3.5 w-3.5 text-purple-700' />
//               </div>
//               <span className='font-medium text-sm text-gray-900'>
//                 Wedding Assistant
//               </span>
//             </div>
//           )}

//           <div
//             className={`prose max-w-none text-[15px] ${isUser ? 'prose-invert' : 'prose-neutral'}`}
//           >
//             <ReactMarkdown
//               components={{
//                 a: ({ node, ...props }) => {
//                   const href = props.href || '';
//                   const isPDF = href.toLowerCase().endsWith('.pdf');

//                   if (isPDF) {
//                     return (
//                       <button
//                         onClick={() => handlePdfPreview(href)}
//                         className={`cursor-pointer inline-flex items-center gap-1 ${
//                           isUser
//                             ? 'text-white underline'
//                             : 'text-blue-600 underline'
//                         }`}
//                       >
//                         <FileText className='h-4 w-4' />
//                         {props.children || 'View PDF'}
//                       </button>
//                     );
//                   }

//                   return (
//                     <a
//                       {...props}
//                       className={
//                         isUser
//                           ? 'text-white underline'
//                           : 'text-blue-600 underline'
//                       }
//                       target='_blank'
//                       rel='noopener noreferrer'
//                     >
//                       {props.children}
//                     </a>
//                   );
//                 },
//                 p: ({ node, ...props }) => (
//                   <p className='mb-4 last:mb-0' {...props} />
//                 ),
//                 ul: ({ node, ...props }) => (
//                   <ul className='list-disc pl-5 mb-4' {...props} />
//                 ),
//                 ol: ({ node, ...props }) => (
//                   <ol className='list-decimal pl-5 mb-4' {...props} />
//                 ),
//                 li: ({ node, ...props }) => <li className='mb-1' {...props} />,
//                 h1: ({ node, ...props }) => (
//                   <h1 className='text-xl font-bold mb-4' {...props} />
//                 ),
//                 h2: ({ node, ...props }) => (
//                   <h2 className='text-lg font-bold mb-3' {...props} />
//                 ),
//                 h3: ({ node, ...props }) => (
//                   <h3 className='text-md font-bold mb-2' {...props} />
//                 ),
//                 blockquote: ({ node, ...props }) => (
//                   <blockquote
//                     className={`border-l-4 ${isUser ? 'border-white/30' : 'border-gray-200'} pl-4 italic my-4`}
//                     {...props}
//                   />
//                 ),
//               }}
//             >
//               {Array.isArray(message.content)
//                 ? message.content.join('\n')
//                 : message.content || ''}
//             </ReactMarkdown>
//           </div>
//         </div>

//         {message.sources && message.sources.length > 0 && (
//           <div
//             className={`px-4 py-2 border-t flex items-center justify-between ${isUser ? 'border-white/10' : 'border-gray-100'}`}
//           >
//             <button
//               onClick={() => onViewSources(message.sources || [])}
//               className={`text-xs flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${isUser ? 'text-white/90 hover:text-white bg-white/10 hover:bg-white/20' : 'text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100'}`}
//             >
//               {message.sources.some(
//                 src =>
//                   src.toLowerCase().endsWith('.pdf') ||
//                   src.toLowerCase().includes('/pdf/')
//               ) ? (
//                 <FileText className='h-3.5 w-3.5' />
//               ) : (
//                 <Link2 className='h-3.5 w-3.5' />
//               )}
//               {message.sources.length}{' '}
//               {message.sources.length === 1 ? 'Source' : 'Sources'}
//             </button>

//             {/* <div className='text-xs text-gray-500'>
//               {message.timestamp && (
//                 <span>
//                   {message.timestamp.toLocaleTimeString([], {
//                     hour: '2-digit',
//                     minute: '2-digit',
//                   })}
//                 </span>
//               )}
//             </div> */}
//           </div>
//         )}
//       </div>
//       {pdfUrl && <PdfPreviewModal url={pdfUrl} onClose={closePdfPreview} />}
//     </div>
//   );
// };

'use client';

import type { ChatMessageInterface, LinkPreview } from '@/app/@types';
import {
  FileText,
  Heart,
  Link2,
  BookOpen,
  ChevronRight,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { useState } from 'react';
import { PdfPreviewModal } from './PdfPreviewModal';
import ReactMarkdown from 'react-markdown';
import PDFPreviewCard from '../pdfPreview';
import LinkPreviewCard from '../LinkPreview';

const SourcePreviewSkeleton = () => (
  <div className='overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm'>
    <div className='flex items-center gap-2 mb-2'>
      <div className='h-8 w-8 rounded-full bg-gray-100 animate-pulse' />
      <div className='space-y-2'>
        <div className='h-4 w-32 bg-gray-100 rounded animate-pulse' />
        <div className='h-3 w-24 bg-gray-100 rounded animate-pulse' />
      </div>
    </div>
    <div className='h-4 w-full bg-gray-100 rounded animate-pulse mt-2' />
    <div className='mt-3 flex justify-end'>
      <div className='h-6 w-24 bg-gray-100 rounded-full animate-pulse' />
    </div>
  </div>
);

export const ChatMessage = ({
  message,
  onViewSources,
  linkPreviews = {},
}: {
  message: ChatMessageInterface;
  onViewSources: (sources: string[]) => void;
  linkPreviews?: Record<string, LinkPreview>;
}) => {
  const isUser = message.role === 'user';
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isSourcesPreviewExpanded, setIsSourcesPreviewExpanded] =
    useState(false);
  const [activeSourceIndex, setActiveSourceIndex] = useState<number | null>(
    null
  );

  const handlePdfPreview = (url: string) => {
    setPdfUrl(url);
  };

  const closePdfPreview = () => {
    setPdfUrl(null);
  };

  const isPDF = (url: string) => {
    return (
      url.toLowerCase().endsWith('.pdf') || url.toLowerCase().includes('/pdf/')
    );
  };

  // Function to extract domain name from URL
  const getDomainFromUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain;
    } catch (e) {
      return url;
    }
  };

  return (
    <div
      className={`mb-6 ${isUser ? 'flex justify-end' : 'flex justify-start'}`}
    >
      <div
        className={`max-w-[85%] overflow-hidden ${isUser ? 'rounded-t-2xl rounded-bl-2xl bg-purple-700 text-white' : 'rounded-t-2xl rounded-br-2xl bg-white border border-gray-200 shadow-sm'}`}
      >
        <div className='p-4'>
          {!isUser && (
            <div className='flex items-center gap-2 mb-2'>
              <div className='flex h-7 w-7 items-center justify-center rounded-full bg-purple-100'>
                <Heart className='h-3.5 w-3.5 text-purple-700' />
              </div>
              <span className='font-medium text-sm text-gray-900'>
                Wedding Assistant
              </span>
            </div>
          )}

          <div
            className={`prose max-w-none text-[15px] ${isUser ? 'prose-invert' : 'prose-neutral'}`}
          >
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => {
                  const href = props.href || '';
                  const isPDF = href.toLowerCase().endsWith('.pdf');

                  if (isPDF) {
                    return (
                      <button
                        onClick={() => handlePdfPreview(href)}
                        className={`cursor-pointer inline-flex items-center gap-1 ${
                          isUser
                            ? 'text-white underline'
                            : 'text-blue-600 underline'
                        }`}
                      >
                        <FileText className='h-4 w-4' />
                        {props.children || 'View PDF'}
                      </button>
                    );
                  }

                  return (
                    <a
                      {...props}
                      className={
                        isUser
                          ? 'text-white underline'
                          : 'text-blue-600 underline'
                      }
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {props.children}
                    </a>
                  );
                },
                p: ({ node, ...props }) => (
                  <p className='mb-4 last:mb-0' {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className='list-disc pl-5 mb-4' {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className='list-decimal pl-5 mb-4' {...props} />
                ),
                li: ({ node, ...props }) => <li className='mb-1' {...props} />,
                h1: ({ node, ...props }) => (
                  <h1 className='text-xl font-bold mb-4' {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className='text-lg font-bold mb-3' {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className='text-md font-bold mb-2' {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className={`border-l-4 ${isUser ? 'border-white/30' : 'border-gray-200'} pl-4 italic my-4`}
                    {...props}
                  />
                ),
              }}
            >
              {Array.isArray(message.content)
                ? message.content.join('\n')
                : message.content || ''}
            </ReactMarkdown>
          </div>
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className='border-t border-gray-100'>
            {/* Professional Sources UI */}
            {!isSourcesPreviewExpanded ? (
              <div className='px-4 py-3'>
                {/* Collapsed view - professional button with clear indication */}
                <div className='flex flex-col gap-2'>
                  <button
                    onClick={() => {
                      onViewSources(message.sources || []);
                      setIsSourcesPreviewExpanded(true);
                    }}
                    className='flex items-center gap-2 py-1.5 px-3 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 rounded-md border border-purple-100 transition-all group'
                  >
                    <div className='flex items-center justify-center w-5 h-5 rounded-full bg-purple-100'>
                      <BookOpen className='h-3 w-3 text-purple-600' />
                    </div>
                    <span className='font-medium text-purple-700'>
                      {message.sources.length}{' '}
                      {message.sources.length === 1 ? 'source' : 'sources'}{' '}
                      cited
                    </span>
                    <ChevronRight className='h-3.5 w-3.5 text-purple-500 group-hover:translate-x-0.5 transition-transform' />
                  </button>

                  {/* Source preview pills */}
                  <div className='flex flex-wrap gap-1.5 ml-1'>
                    {message.sources.slice(0, 3).map((source, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setIsSourcesPreviewExpanded(true);
                          setActiveSourceIndex(index);
                        }}
                        className='flex items-center gap-1.5 max-w-[180px] px-2 py-1 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group'
                      >
                        <div className='w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0'>
                          {isPDF(source) ? (
                            <FileText className='w-3 h-3 text-gray-600' />
                          ) : (
                            <Globe className='w-3 h-3 text-gray-600' />
                          )}
                        </div>
                        <span className='truncate text-xs text-gray-700 group-hover:text-gray-900 transition-colors'>
                          {getDomainFromUrl(source)}
                        </span>
                      </div>
                    ))}
                    {message.sources.length > 3 && (
                      <div
                        onClick={() => setIsSourcesPreviewExpanded(true)}
                        className='flex items-center px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-600 cursor-pointer hover:bg-gray-200 transition-colors'
                      >
                        +{message.sources.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className='border border-gray-200 rounded-lg overflow-hidden shadow-lg animate-in fade-in zoom-in-95 duration-200 m-3'>
                <div className='bg-gradient-to-r from-purple-50 to-indigo-50 px-4 py-3 flex justify-between items-center border-b border-purple-100'>
                  <div className='flex items-center gap-2'>
                    <div className='flex items-center justify-center w-5 h-5 rounded-full bg-purple-100'>
                      <BookOpen className='h-3 w-3 text-purple-600' />
                    </div>
                    <span className='font-medium text-purple-700'>
                      {message.sources.length}{' '}
                      {message.sources.length === 1 ? 'source' : 'sources'}{' '}
                      cited in this response
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsSourcesPreviewExpanded(false);
                      setActiveSourceIndex(null);
                    }}
                    className='text-gray-500 hover:text-gray-700'
                  >
                    <span className='sr-only'>Close</span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M18 6 6 18' />
                      <path d='m6 6 12 12' />
                    </svg>
                  </button>
                </div>

                <div className='bg-white max-h-[300px] overflow-y-auto'>
                  <div className='space-y-3 p-3'>
                    {message.sources.map((source, index) => (
                      <div key={index} className='animate-fadeIn'>
                        {isPDF(source) ? (
                          <PDFPreviewCard url={source} />
                        ) : linkPreviews[source] ? (
                          <LinkPreviewCard preview={linkPreviews[source]} />
                        ) : (
                          <SourcePreviewSkeleton />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className='px-4 py-2.5 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between'>
                  <span>
                    Sources are provided to support the information in this
                    response
                  </span>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => setIsSourcesPreviewExpanded(false)}
                      className='text-gray-500 hover:text-gray-700 font-medium'
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {pdfUrl && <PdfPreviewModal url={pdfUrl} onClose={closePdfPreview} />}
    </div>
  );
};
