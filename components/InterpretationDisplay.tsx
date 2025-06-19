import React from 'react';

interface InterpretationDisplayProps {
  interpretationText: string | null;
}

const InterpretationDisplay: React.FC<InterpretationDisplayProps> = ({ interpretationText }) => {
  if (!interpretationText) return null;

  const processContent = (text: string | null) => {
    if (!text) return [];
    return text.split(/\n+/).map(line => {
      if (line.startsWith('### ')) {
        return { type: 'h3', content: line.substring(4) };
      } else if (line.startsWith('## ')) {
        return { type: 'h2', content: line.substring(3) };
      } else if (line.trim() !== '') {
        return { type: 'p', content: line };
      }
      return null;
    }).filter(item => item !== null) as { type: 'h2' | 'h3' | 'p'; content: string }[];
  };

  const mainContentParts = processContent(interpretationText);

  return (
    <div 
      className="mt-10 p-6 sm:p-8 rounded-xl shadow-2xl bg-gradient-to-br from-indigo-700/70 via-purple-800/60 to-pink-700/50 dark:from-indigo-900/80 dark:via-purple-900/70 dark:to-pink-900/60 border border-indigo-500/30"
    >
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 bg-gradient-to-r from-purple-300 via-pink-400 to-rose-400 bg-clip-text text-transparent">
        Your Dream's Tapestry:
      </h2>
      <div className="space-y-4 text-slate-200 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
        {mainContentParts.map((part, index) => {
          if (part.type === 'h2') {
            return <h2 key={`main-h2-${index}`} className="text-2xl sm:text-3xl font-bold mt-6 mb-3 bg-gradient-to-r from-teal-300 via-cyan-400 to-sky-400 bg-clip-text text-transparent">{part.content}</h2>;
          } else if (part.type === 'h3') {
            return <h3 key={`main-h3-${index}`} className="text-xl sm:text-2xl font-semibold mt-4 mb-2 bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent">{part.content}</h3>;
          }
          return <p key={`main-p-${index}`}>{part.content}</p>;
        })}
      </div>
    </div>
  );
};

export default InterpretationDisplay;