import React, { useState } from 'react';
import type { DreamInputFormProps } from '../types';

const languages = [
  { code: 'ar', name: 'العربية (Arabic)' },
  { code: 'zh-CN', name: '简体中文 (Chinese, Simplified)' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'de', name: 'Deutsch (German)' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'it', name: 'Italiano (Italian)' },
  { code: 'ja', name: '日本語 (Japanese)' },
  { code: 'pt', name: 'Português (Portuguese)' },
  { code: 'si', name: 'සිංහල (Sinhala)' },
  { code: 'es', name: 'Español (Spanish)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
];

const DreamInputForm: React.FC<DreamInputFormProps> = ({ onSubmit, isLoading, selectedLanguage, onLanguageChange }) => {
  const [dream, setDream] = useState('');
  const [isLucidInterest, setIsLucidInterest] = useState(false);
  const [generateImage, setGenerateImage] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!dream.trim()) {
      alert("Please describe your dream before submitting.");
      return;
    }
    onSubmit(dream, isLucidInterest, selectedLanguage, generateImage);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
      <div>
        <label htmlFor="dream" className="block text-lg font-semibold text-indigo-300 dark:text-indigo-400 mb-2">
          Describe Your Dream
        </label>
        <textarea
          id="dream"
          name="dream"
          rows={8}
          className="block w-full p-4 bg-slate-700/50 dark:bg-slate-800/70 border border-purple-500/50 dark:border-indigo-500/60 rounded-lg shadow-md focus:ring-2 focus:ring-purple-400 dark:focus:ring-violet-400 focus:border-purple-400 dark:focus:border-violet-400 text-slate-100 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-base transition-all duration-200 ease-in-out"
          placeholder="E.g., I was flying over a city made of clouds, and a giant talking cat offered me tea..."
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          disabled={isLoading}
          required
          aria-required="true"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            id="lucidDreamInterest"
            name="lucidDreamInterest"
            type="checkbox"
            className="h-5 w-5 text-purple-500 bg-slate-700/50 border-purple-400/70 rounded focus:ring-2 focus:ring-purple-400 dark:focus:ring-violet-400 focus:ring-offset-slate-800 disabled:opacity-50 cursor-pointer"
            checked={isLucidInterest}
            onChange={(e) => setIsLucidInterest(e.target.checked)}
            disabled={isLoading}
          />
          <label htmlFor="lucidDreamInterest" className="ml-3 block text-sm font-medium text-slate-300 dark:text-slate-300 cursor-pointer">
            Tick if this was a lucid dream or you're interested in achieving lucidity.
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="generateImage"
            name="generateImage"
            type="checkbox"
            className="h-5 w-5 text-purple-500 bg-slate-700/50 border-purple-400/70 rounded focus:ring-2 focus:ring-purple-400 dark:focus:ring-violet-400 focus:ring-offset-slate-800 disabled:opacity-50 cursor-pointer"
            checked={generateImage}
            onChange={(e) => setGenerateImage(e.target.checked)}
            disabled={isLoading}
          />
          <label htmlFor="generateImage" className="ml-3 block text-sm font-medium text-slate-300 dark:text-slate-300 cursor-pointer">
            Generate an image for this dream? (Experimental)
          </label>
        </div>
      </div>
      
      <div>
        <label htmlFor="language" className="block text-sm font-semibold text-indigo-300 dark:text-indigo-400 mb-1">
          Interpretation Language
        </label>
        <select
          id="language"
          name="language"
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          disabled={isLoading}
          className="block w-full p-3 bg-slate-700/50 dark:bg-slate-800/70 border border-purple-500/50 dark:border-indigo-500/60 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 dark:focus:ring-violet-400 focus:border-purple-400 dark:focus:border-violet-400 text-slate-100 dark:text-slate-100 text-base transition-all duration-200 ease-in-out disabled:opacity-50"
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code} className="bg-slate-700 dark:bg-slate-800 text-slate-100">{lang.name}</option>
          ))}
        </select>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3.5 px-6 border border-transparent rounded-lg shadow-xl text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 ease-in-out group button-pulse-glow transform hover:scale-105 active:scale-95"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Interpreting...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 group-hover:text-yellow-300 transition-colors">
                <path d="M10.001 2a1.5 1.5 0 011.061.44l5.158 5.157a1.5 1.5 0 010 2.122l-2.26 2.258a.75.75 0 000 1.06l.002.003 2.258 2.26a1.5 1.5 0 010 2.12l-5.157 5.159a1.5 1.5 0 01-2.122 0L4.842 15.62a1.5 1.5 0 010-2.122l2.26-2.258a.75.75 0 00-1.06-1.06l-.003.002L3.78 12.44a1.5 1.5 0 010-2.122l5.16-5.158A1.5 1.5 0 0110.002 2z" />
                <path d="M8.94 6.558a.75.75 0 00-1.06 1.06l.001.002 2.257 2.26a1.5 1.5 0 010 2.12l-2.258 2.259-.002.002a.75.75 0 101.06 1.06l.003-.002 2.259-2.258a1.5 1.5 0 010-2.122L9.998 7.62a.75.75 0 00-1.059-1.062z" />
              </svg>
              Interpret My Dream
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default DreamInputForm;