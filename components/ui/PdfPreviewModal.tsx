import { FileText, X } from 'lucide-react';
import { useState } from 'react';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { Worker, Viewer } from '@react-pdf-viewer/core';

export const PdfPreviewModal = ({
  url,
  onClose,
}: {
  url: string;
  onClose: () => void;
}) => {
  // const defaultLayoutPluginInstance = defaultLayoutPlugin();
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

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4'>
      <div className='relative w-full max-w-4xl h-[80vh] bg-white rounded-lg overflow-hidden'>
        <div className='flex items-center justify-between p-3 border-b'>
          <h3 className='font-medium text-gray-900 flex items-center'>
            <FileText className='h-4 w-4 mr-2 text-purple-600' />
            {url.split('/').pop() || 'Document'}
          </h3>
          <button
            onClick={onClose}
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
};
