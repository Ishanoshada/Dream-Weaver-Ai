import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import DreamInputForm from './components/DreamInputForm';
import InterpretationDisplay from './components/InterpretationDisplay';
import ErrorMessage from './components/ErrorMessage';
import BinauralBeatPlayer from './components/BinauralBeatPlayer'; 
import ImageDisplay from './components/ImageDisplay';
import { interpretDream, generateDreamImage } from './services/geminiService';
import type { DreamInterpretationResponse } from './types'; 

const App: React.FC = () => {
  const [interpretation, setInterpretation] = useState<DreamInterpretationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);


  const handleDreamSubmit = useCallback(async (dreamDescription: string, isLucidInterest: boolean, language: string, generateImageRequest: boolean) => {
    setIsLoading(true);
    setError(null);
    setImageError(null); 
    setInterpretation(null);
    setGeneratedImageUrl(null); 
    setShowResults(false);

    try {
      const result = await interpretDream(dreamDescription, isLucidInterest, language);
      setInterpretation(result);
      setShowResults(true); // Trigger animation for new results

      if (generateImageRequest) {
        try {
          const imageUrl = await generateDreamImage(dreamDescription);
          setGeneratedImageUrl(imageUrl);
          if (!imageUrl) {
             setImageError("The AI couldn't generate an image for this dream, or the result was empty. Try a different description.");
          }
        } catch (imgErr: any) {
          setImageError(imgErr.message || "An unexpected error occurred during image generation.");
        }
      }

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLanguageChange = useCallback((language: string) => {
    setSelectedLanguage(language);
  }, []);

  return (
    <div className="flex flex-col flex-1 transition-colors duration-300"> {/* Changed min-h-screen to flex-1 */}
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
        <div className="bg-slate-800/60 dark:bg-slate-900/70 backdrop-blur-xl p-6 sm:p-10 rounded-2xl shadow-2xl border border-indigo-500/30 transition-all duration-300">
          <DreamInputForm 
            onSubmit={handleDreamSubmit} 
            isLoading={isLoading}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />
          {error && <ErrorMessage message={error} />}
          {imageError && !error && <ErrorMessage message={`Image Generation: ${imageError}`} />}
          
          {interpretation && !isLoading && (
             <div className={showResults ? "animate-content-appear" : ""}>
              <InterpretationDisplay 
                interpretationText={interpretation.interpretationText}
              />
              {generatedImageUrl && (
                <ImageDisplay imageUrl={generatedImageUrl} dreamDescription={interpretation.interpretationText.substring(0,50)} />
              )}
              {interpretation.suggestedHz !== null && interpretation.suggestedHz > 0 && (
                <BinauralBeatPlayer 
                  targetFrequency={interpretation.suggestedHz} 
                  durationMinutes={15} 
                />
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;