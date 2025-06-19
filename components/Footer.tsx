
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 mt-12 text-center text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700/50 transition-colors duration-300">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Dream Weaver AI. Crafted by 
        <a 
          href="https://github.com/Ishanoshada/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-indigo-600 dark:text-indigo-400 hover:underline ml-1"
        >
          Ishanoshada
        </a>. All rights reserved.
      </p>
      <p className="text-xs mt-1">Interpretations are for entertainment and insight, not professional advice.</p>
    </footer>
  );
};

export default Footer;