import React from 'react';

interface ImageDisplayProps {
  imageUrl: string | null;
  dreamDescription: string; 
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, dreamDescription }) => {
  if (!imageUrl) return null;

  const sanitizeFilename = (name: string) => {
    const shortName = name.split(/\s+/).slice(0, 5).join(' ');
    return shortName.replace(/[^a-z0-9\s-]/gi, '').replace(/\s+/g, '-').toLowerCase() || 'dream-image';
  };
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${sanitizeFilename(dreamDescription)}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="mt-10 p-6 sm:p-8 rounded-xl shadow-2xl bg-gradient-to-br from-sky-700/60 via-cyan-800/50 to-teal-700/60 dark:from-sky-900/80 dark:via-cyan-900/70 dark:to-teal-900/60 border border-cyan-500/30"
    >
      <div className="mb-6 rounded-lg overflow-hidden shadow-lg border border-slate-500/30">
        <img 
          src={imageUrl} 
          alt="AI generated representation of the dream" 
          className="w-full h-auto object-contain max-h-[65vh]" 
        />
      </div>
      <button
        onClick={handleDownload}
        className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-lg text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-400 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
          <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
          <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
        </svg>
        Download Image
      </button>
    </div>
  );
};

export default ImageDisplay;