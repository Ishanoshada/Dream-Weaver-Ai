import React from 'react';

interface HeaderProps {
  // Props removed
}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="py-6 sm:py-8 text-center relative">
      <div className="inline-flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-400 mr-2 sm:mr-3 animate-float-icon">
          <path fillRule="evenodd" d="M12.554 1.35A1.331 1.331 0 0 0 11.446 1.35C9.068 2.04 6.93 3.318 5.25 5.001C3.443 6.808 2.196 9.113 1.58 11.606c-.17.702.298 1.394 1.01 1.394h17.82c.712 0 1.18-.692 1.01-1.394C20.804 9.113 19.557 6.808 17.75 5.001C16.07 3.318 13.932 2.04 11.554 1.352zM4.128 15.001C4.588 18.038 7.042 20.4 10.13 20.916a1.331 1.331 0 0 0 1.348-0.438l.565-.848a1.332 1.332 0 0 1 2.025-.261l.15.125a1.331 1.331 0 0 0 1.685-.096C18.201 18.574 20 16.05 20 13.5H3c0 2.551 1.799 5.074 4.128 6.001z" clipRule="evenodd" />
        </svg>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-rose-500 bg-clip-text text-transparent">
            Dream Weaver AI
        </h1>
      </div>
      <p className="mt-2 sm:mt-3 text-lg sm:text-xl text-slate-300 dark:text-slate-400">Unravel the mysteries of your subconscious.</p>
    </header>
  );
};

export default Header;