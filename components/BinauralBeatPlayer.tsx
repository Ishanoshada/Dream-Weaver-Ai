import React, { useState, useEffect, useRef, useCallback } from 'react';

interface BinauralBeatPlayerProps {
  targetFrequency: number;
  durationMinutes: number;
}

const BinauralBeatPlayer: React.FC<BinauralBeatPlayerProps> = ({ targetFrequency, durationMinutes }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [remainingTime, setRemainingTime] = useState(durationMinutes * 60);
  const [showLearnMore, setShowLearnMore] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorLeftRef = useRef<OscillatorNode | null>(null);
  const oscillatorRightRef = useRef<OscillatorNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const mergerRef = useRef<ChannelMergerNode | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  const baseFrequency = 100; 
  const volume = 0.15; 
  const prevPropsRef = useRef({ targetFrequency, durationMinutes });

  const stopAudio = useCallback((resetTimerState = true) => {
    if (oscillatorLeftRef.current) {
      oscillatorLeftRef.current.onended = null;
      try { oscillatorLeftRef.current.stop(); } catch (e) { /* ignore */ }
      try { oscillatorLeftRef.current.disconnect(); } catch (e) { /* ignore */ }
      oscillatorLeftRef.current = null;
    }
    if (oscillatorRightRef.current) {
      oscillatorRightRef.current.onended = null;
      try { oscillatorRightRef.current.stop(); } catch (e) { /* ignore */ }
      try { oscillatorRightRef.current.disconnect(); } catch (e) { /* ignore */ }
      oscillatorRightRef.current = null;
    }

    if (mergerRef.current) {
        try { mergerRef.current.disconnect(); } catch (e) { /* ignore */ }
        mergerRef.current = null;
    }
    if (masterGainRef.current) {
      try { masterGainRef.current.disconnect(); } catch (e) { /* ignore */ }
      masterGainRef.current = null;
    }
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (resetTimerState) {
        setRemainingTime(durationMinutes * 60);
    }
  }, [durationMinutes]);


  const playAudio = useCallback(async () => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const audioCtx = audioContextRef.current;

    try {
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
    } catch (e) {
      console.error("BBP: Error resuming AudioContext in playAudio:", e);
      setIsPlaying(false); 
      return; 
    }
    
    stopAudio(false); 

    let currentPlaybackTime = remainingTime;
    if (currentPlaybackTime <= 0) { 
        currentPlaybackTime = durationMinutes * 60;
        setRemainingTime(currentPlaybackTime); 
    }
    
    masterGainRef.current = audioCtx.createGain();
    masterGainRef.current.gain.setValueAtTime(volume, audioCtx.currentTime); 
    masterGainRef.current.connect(audioCtx.destination);

    mergerRef.current = audioCtx.createChannelMerger(2);
    mergerRef.current.connect(masterGainRef.current);

    oscillatorLeftRef.current = audioCtx.createOscillator();
    oscillatorLeftRef.current.type = 'sine';
    oscillatorLeftRef.current.frequency.setValueAtTime(baseFrequency, audioCtx.currentTime);
    oscillatorLeftRef.current.connect(mergerRef.current, 0, 0); 

    oscillatorRightRef.current = audioCtx.createOscillator();
    oscillatorRightRef.current.type = 'sine';
    oscillatorRightRef.current.frequency.setValueAtTime(baseFrequency + targetFrequency, audioCtx.currentTime);
    oscillatorRightRef.current.connect(mergerRef.current, 0, 1); 
    
    const playStartTime = audioCtx.currentTime;
    const actualDurationToPlay = Math.max(0, currentPlaybackTime); 

    oscillatorLeftRef.current.start(playStartTime);
    oscillatorRightRef.current.start(playStartTime);

    if (actualDurationToPlay > 0) {
        oscillatorLeftRef.current.stop(playStartTime + actualDurationToPlay);
        oscillatorRightRef.current.stop(playStartTime + actualDurationToPlay);
    } else {
         try { oscillatorLeftRef.current.stop(playStartTime); } catch(e){/*ignore*/}
         try { oscillatorRightRef.current.stop(playStartTime); } catch(e){/*ignore*/}
    }
    
    if(oscillatorRightRef.current) {
        oscillatorRightRef.current.onended = () => {
             if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                setIsPlaying(false); 
                setRemainingTime(0); 
                if (timerIntervalRef.current) {
                    clearInterval(timerIntervalRef.current);
                    timerIntervalRef.current = null;
                }
             }
        };
    }

    setIsPlaying(true);

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = window.setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime <= 1) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  }, [targetFrequency, durationMinutes, stopAudio, remainingTime, volume, setIsPlaying, setRemainingTime, baseFrequency]);

  const pauseAudio = useCallback(async () => {
    if (audioContextRef.current && audioContextRef.current.state === 'running' && isPlaying) {
      try {
        await audioContextRef.current.suspend();
        setIsPlaying(false);
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
      } catch (e) {
        console.error("BBP: Error suspending AudioContext:", e);
      }
    }
  }, [isPlaying, setIsPlaying]);

  const resumeAudio = useCallback(async () => {
     if (audioContextRef.current && audioContextRef.current.state === 'suspended' && !isPlaying && remainingTime > 0) {
        try {
            await audioContextRef.current.resume();
            setIsPlaying(true);
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = window.setInterval(() => {
                setRemainingTime(prevTime => {
                    if (prevTime <= 1) {
                       if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
                       return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } catch (e) {
            console.error("BBP: Error resuming AudioContext on resumeAudio:", e);
            setIsPlaying(false);
        }
    } else if (remainingTime <= 0 && !isPlaying) { 
        await playAudio(); 
    }
  }, [isPlaying, remainingTime, playAudio, setIsPlaying, setRemainingTime]);

  useEffect(() => {
    return () => { 
      stopAudio(true); 
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(e => console.warn("BBP: Error closing AudioContext on unmount:", e));
        audioContextRef.current = null;
      }
    };
  }, [stopAudio]);

  useEffect(() => {
    const { 
      targetFrequency: prevTargetFrequency, 
      durationMinutes: prevDurationMinutes 
    } = prevPropsRef.current;

    if (targetFrequency !== prevTargetFrequency || durationMinutes !== prevDurationMinutes) {
      setRemainingTime(durationMinutes * 60);
      if (isPlaying) {
          stopAudio(false); 
          setIsPlaying(false); 
      }
      prevPropsRef.current = { targetFrequency, durationMinutes };
    }
  }, [targetFrequency, durationMinutes, isPlaying, stopAudio, setIsPlaying, setRemainingTime]);


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      await pauseAudio();
    } else {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await resumeAudio();
      } else {
        await playAudio();
      }
    }
  };
  
  const handleStop = () => {
    stopAudio(true); 
    setIsPlaying(false); 
  };

  const toggleLearnMore = () => {
    setShowLearnMore(!showLearnMore);
  };

  const buttonBaseStyle = "flex-1 px-4 py-2.5 font-semibold rounded-lg shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95";
  const playButtonStyle = `${buttonBaseStyle} bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white focus:ring-teal-400`;
  const stopButtonStyle = `${buttonBaseStyle} bg-gradient-to-r from-pink-600 to-rose-700 hover:from-pink-700 hover:to-rose-800 text-white focus:ring-rose-500`;


  return (
    <div 
      className="mt-8 p-6 bg-slate-800/50 dark:bg-slate-900/60 backdrop-blur-md rounded-lg shadow-xl border border-purple-500/30 transition-colors duration-300"
    >
      <h3 className="text-xl font-semibold text-indigo-300 dark:text-indigo-400 mb-3">Binaural Beats Session</h3>
      <p className="text-slate-300 dark:text-slate-300 mb-1">
        Target Beat: <strong className="text-purple-300 dark:text-purple-300">{targetFrequency} Hz</strong>
      </p>
      <p className="text-slate-400 dark:text-slate-400 mb-4 text-sm">
        (L: {baseFrequency} Hz, R: {baseFrequency + targetFrequency} Hz)
      </p>
      <div className="text-3xl font-mono text-pink-400 dark:text-pink-400 mb-5" aria-live="polite" aria-atomic="true" aria-label="Remaining time">
        {formatTime(remainingTime)}
      </div>
      <div className="flex space-x-3">
        <button
          onClick={handlePlayPause}
          disabled={targetFrequency <= 0}
          aria-pressed={isPlaying}
          className={playButtonStyle}
        >
          {isPlaying ? 'Pause' : (remainingTime <=0 && !isPlaying ? 'Replay' : 'Play')}
        </button>
        <button
          onClick={handleStop}
          disabled={!isPlaying && remainingTime === durationMinutes * 60}
          className={stopButtonStyle}
        >
          Stop
        </button>
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-700/60 transition-colors duration-300">
        <button 
          onClick={toggleLearnMore} 
          className="text-indigo-400 hover:text-indigo-300 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium mb-2 focus:outline-none w-full text-left flex justify-between items-center"
          aria-expanded={showLearnMore}
        >
          <span>{showLearnMore ? 'Hide Details' : 'Learn More'} About Binaural Beats</span> 
          <span className={`ml-1 inline-block transform transition-transform duration-200 ${showLearnMore ? 'rotate-180' : 'rotate-0'}`}>▼</span>
        </button>
        {showLearnMore && (
          <div className="text-xs text-slate-400 dark:text-slate-400 space-y-2 mt-2 transition-colors duration-300">
            <p><strong>How they work:</strong> Binaural beats are an auditory illusion. When you listen to two slightly different frequencies (e.g., {baseFrequency} Hz in your left ear and {baseFrequency + targetFrequency} Hz in your right), your brain perceives a third, "beat" frequency—in this case, {targetFrequency} Hz (the difference).</p>
            <p><strong>Brainwave Entrainment:</strong> The theory is that your brain's electrical activity may try to synchronize with this perceived beat. This is called brainwave entrainment. Different brainwave frequencies are associated with different mental states:</p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li><strong>Delta (0.5-4 Hz):</strong> Deep, dreamless sleep, healing, and regeneration.</li>
              <li><strong>Theta (4-8 Hz):</strong> REM sleep, deep meditation, creativity, insight, and memory consolidation. Often associated with lucid dreaming.</li>
              <li><strong>Alpha (8-12 Hz):</strong> Relaxed wakefulness, calm focus, reduced stress, and light meditation. Can be a bridge to Theta.</li>
              <li><strong>Beta (12-38 Hz):</strong> Active thinking, problem-solving, focused attention, and alertness.</li>
              <li><strong>Gamma (38-100+ Hz):</strong> Higher-level cognitive processing, peak awareness, insight, and information processing.</li>
            </ul>
            <p>By choosing a specific binaural beat frequency ({targetFrequency} Hz in this case), the aim is to gently encourage the corresponding brainwave state using a standard base tone of {baseFrequency} Hz.</p>
          </div>
        )}
      </div>

      <div className={`mt-4 ${showLearnMore ? 'pt-4 border-t border-slate-700/60' : 'pt-0' } transition-all duration-300`}>
        <p className="text-xs text-slate-500 dark:text-slate-500 transition-colors duration-300">
          <strong>Important:</strong> Use headphones for the binaural effect. Listen at a comfortable, low volume. 
          These beats are for relaxation and exploration, not medical treatment. Do not use while driving or operating machinery. 
          Consult a healthcare professional for any health concerns.
        </p>
      </div>
    </div>
  );
};

export default BinauralBeatPlayer;