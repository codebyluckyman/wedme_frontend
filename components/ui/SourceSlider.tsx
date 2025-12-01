import { LinkPreview } from '@/app/@types';
import { ExternalLink, Globe, Link2, Search, X } from 'lucide-react';
import { LoadingRingsIcon } from '../icons';
import PDFPreviewCard from '../pdfPreview';
import LinkPreviewCard from '../LinkPreview';

export const SourcesSlider = ({
  sources,
  isOpen,
  onClose,
  linkPreviews,
  isLoading,
}: {
  sources: string[];
  isOpen: boolean;
  onClose: () => void;
  linkPreviews: Record<string, LinkPreview>;
  isLoading: boolean;
}) => {
  const isPDF = (url: string) => {
    return (
      url.toLowerCase().endsWith('.pdf') || url.toLowerCase().includes('/pdf/')
    );
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className='sticky top-0 z-10 bg-white border-b border-gray-100'>
        <div className='flex items-center justify-between p-4'>
          <h3 className='font-semibold text-lg flex items-center text-gray-900'>
            <Link2 className='h-5 w-5 mr-2 text-purple-600' />
            Sources & References
          </h3>
          <button
            onClick={onClose}
            className='rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors'
            aria-label='Close sources panel'
          >
            <X className='h-5 w-5' />
          </button>
        </div>
        <div className='px-4 pb-3'>
          <p className='text-sm text-gray-500'>
            {sources.length} {sources.length === 1 ? 'source' : 'sources'} found
            to support this response
          </p>
        </div>
      </div>
      <div className='p-4 overflow-y-auto max-h-[calc(100vh-120px)]'>
        {isLoading ? (
          <div className='flex flex-col items-center justify-center py-12 gap-3'>
            <LoadingRingsIcon />
            <p className='text-sm text-gray-500'>Loading source previews...</p>
          </div>
        ) : sources.length > 0 ? (
          <div className='space-y-4'>
            {sources.map((source, index) => (
              <div key={index} className='animate-fadeIn'>
                {isPDF(source) ? (
                  <PDFPreviewCard url={source} />
                ) : linkPreviews[source] ? (
                  <LinkPreviewCard preview={linkPreviews[source]} />
                ) : (
                  <div className='overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-purple-200'>
                    <div className='flex items-center gap-2 mb-2'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-purple-100'>
                        <Globe className='h-4 w-4 text-purple-700' />
                      </div>
                      <div>
                        <h3 className='font-medium text-gray-900'>
                          {new URL(source).hostname.replace('www.', '')}
                        </h3>
                        <p className='text-xs text-gray-500'>
                          External reference
                        </p>
                      </div>
                    </div>
                    <a
                      href={source}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='mt-2 block truncate text-sm text-purple-600 hover:underline'
                    >
                      {source}
                    </a>
                    <div className='mt-3 flex justify-end'>
                      <a
                        href={source}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 transition-colors hover:bg-purple-100'
                      >
                        Open link
                        <ExternalLink className='ml-0.5 h-3 w-3' />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='mb-3 rounded-full bg-gray-100 p-3'>
              <Search className='h-6 w-6 text-gray-400' />
            </div>
            <h3 className='text-lg font-medium text-gray-900'>
              No sources available
            </h3>
            <p className='mt-1 text-sm text-gray-500'>
              This response doesn't have any linked sources or references.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
