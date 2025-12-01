'use client';

import { useState } from 'react';
import { FileText, ExternalLink, X } from 'lucide-react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface PDFPreviewCardProps {
  url: string;
}

const PDFPreviewCard = ({ url }: PDFPreviewCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const getFilenameFromUrl = (url: string) => {
    try {
      const pathname = new URL(url).pathname;
      const filename = pathname.split('/').pop() || 'document.pdf';
      return filename;
    } catch (e) {
      return 'document.pdf';
    }
  };

  const filename = getFilenameFromUrl(url);
  const proxyUrl = `/api/fetch-pdf?url=${encodeURIComponent(url)}`;

  if (expanded) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4'>
        <div className='relative w-full max-w-4xl h-[80vh] bg-white rounded-lg overflow-hidden'>
          <div className='flex items-center justify-between p-3 border-b'>
            <h3 className='font-medium text-gray-900 flex items-center'>
              <FileText className='h-4 w-4 mr-2 text-purple-600' />
              {filename}
            </h3>
            <button
              onClick={() => setExpanded(false)}
              className='rounded-full p-1 text-gray-500 hover:bg-gray-100 transition-colors'
            >
              <X className='h-5 w-5' />
            </button>
          </div>
          <div className='h-[calc(100%-56px)]'>
            <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js'>
              <Viewer
                fileUrl={proxyUrl}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-purple-200'>
      <div className='flex items-center gap-2 p-4 border-b border-gray-100'>
        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-purple-100'>
          <FileText className='h-4 w-4 text-purple-700' />
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='font-medium text-gray-900 truncate'>{filename}</h3>
          <p className='text-xs text-gray-500'>PDF Document</p>
        </div>
      </div>
      <div className='p-4'>
        <div
          className='h-40 bg-gray-50 rounded-lg flex items-center justify-center cursor-pointer'
          onClick={() => setExpanded(true)}
        >
          <div className='text-center p-4'>
            <FileText className='h-10 w-10 text-purple-300 mx-auto mb-2' />
            <p className='text-sm text-gray-600 font-medium'>
              Click to preview PDF
            </p>
          </div>
        </div>
        <div className='mt-3 flex justify-between'>
          <button
            onClick={() => setExpanded(true)}
            className='inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 transition-colors hover:bg-purple-100'
          >
            Preview
          </button>
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100'
          >
            Open in new tab
            <ExternalLink className='ml-0.5 h-3 w-3' />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewCard;
