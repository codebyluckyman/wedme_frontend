export default function Loading() {
  return (
    <div className='flex flex-col items-center justify-center h-full space-y-4'>
      {/* Animated spinner */}
      <div className='relative w-10 h-10'>
        <div className='absolute w-full h-full border-4 border-gray-200 rounded-full'></div>
        <div className='absolute w-full h-full border-4 border-transparent border-t-purple-600 rounded-full animate-spin'></div>
      </div>
      {/* Loading text */}
      <p className='text-sm text-muted-foreground animate-pulse'>Loading...</p>
    </div>
  );
}
