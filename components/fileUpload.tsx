import React, { useRef, ChangeEvent } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className='space-y-4'>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={onChange}
        className='hidden'
      />
      <button
        type='button'
        onClick={handleClick}
        className='w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-primary/20 rounded-lg hover:border-primary/40 bg-primary/5 hover:bg-primary/10 transition-all duration-200'
      >
        <Upload className='w-5 h-5 text-primary' />
        <span className='text-primary font-medium'> Choose Room Layout </span>
      </button>
    </div>
  );
};

export default FileUpload;
