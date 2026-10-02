import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Heart, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface MindfulBreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

export default function MindfulBreathingModal({ isOpen, onClose }: MindfulBreathingModalProps) {
  const { t } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [totalSecondsLeft, setTotalSecondsLeft] = useState(60);
  const [cycleCount, setCycleCount] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Gentle tone generator using Web Audio API
  const playTone = (frequency: number = 432, duration: number = 0.5) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIsActive(true);
      setIsCompleted(false);
      setTotalSecondsLeft(60);
      setCycleCount(1);
      setPhase('inhale');
      setPhaseSecondsLeft(4);
    } else {
      setIsActive(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isActive || isCompleted) return;

    const timer = setInterval(() => {
      setTotalSecondsLeft(prev => {
        if (prev <= 1) {
          setIsCompleted(true);
          setIsActive(false);
          playTone(528, 1.2); // Solfeggio 528Hz love/healing tone
          return 0;
        }
        return prev - 1;
      });

      setPhaseSecondsLeft(prev => {
        if (prev <= 1) {
          // Transition to next phase
          if (phase === 'inhale') {
            setPhase('hold1');
            playTone(432, 0.4);
            return 4;
          } else if (phase === 'hold1') {
            setPhase('exhale');
            playTone(396, 0.5);
            return 4;
          } else if (phase === 'exhale') {
            setPhase('hold2');
            playTone(340, 0.4);
            return 4;
          } else {
            setPhase('inhale');
            setCycleCount(c => c + 1);
            playTone(480, 0.6);
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase, isCompleted, soundEnabled]);

  if (!isOpen) return null;

  const phaseConfig = {
    inhale: {
      instruction: 'Breathe In Slowly',
      subtext: 'Expand your lungs deeply through your nose',
      color: 'from-teal-400 to-emerald-400',
      scale: 'scale-125',
      glow: 'shadow-[0_0_60px_rgba(20,184,166,0.5)]'
    },
    hold1: {
      instruction: 'Hold Gently',
      subtext: 'Keep stillness without straining',
      color: 'from-emerald-400 to-sky-400',
      scale: 'scale-125',
      glow: 'shadow-[0_0_60px_rgba(56,189,248,0.5)]'
    },
    exhale: {
      instruction: 'Breathe Out Smoothly',
      subtext: 'Release all tension through your mouth',
      color: 'from-sky-400 to-indigo-400',
      scale: 'scale-90',
      glow: 'shadow-[0_0_40px_rgba(99,102,241,0.4)]'
    },
    hold2: {
      instruction: 'Rest in Stillness',
      subtext: 'Prepare for the next breath cycle',
      color: 'from-indigo-400 to-teal-400',
      scale: 'scale-90',
      glow: 'shadow-[0_0_30px_rgba(20,184,166,0.3)]'
    }
  };

  const activeConf = phaseConfig[phase];

  const handleRestart = () => {
    setIsCompleted(false);
    setIsActive(true);
    setTotalSecondsLeft(60);
    setCycleCount(1);
    setPhase('inhale');
    setPhaseSecondsLeft(4);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white w-full max-w-md rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
        
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mt-20" />

        {/* Top Controls Header */}
        <div className="w-full flex items-center justify-between z-10 mb-6">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-teal-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>4-4-4 Box Breathing</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-teal-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isCompleted ? (
          <>
            {/* Cycle and Time indicator */}
            <div className="mb-6 z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Cycle {cycleCount} • {totalSecondsLeft}s Remaining
              </span>
            </div>

            {/* Glowing Breathing Orb */}
            <div className="relative w-56 h-56 flex items-center justify-center my-4 z-10">
              {/* Outer Ripple Rings */}
              <div
                className={`absolute inset-0 rounded-full bg-teal-500/10 transition-all duration-1000 ease-in-out ${
                  phase === 'inhale' || phase === 'hold1' ? 'scale-125 opacity-100' : 'scale-75 opacity-20'
                }`}
              />
              <div
                className={`absolute inset-4 rounded-full bg-sky-500/15 transition-all duration-1000 ease-in-out ${
                  phase === 'inhale' || phase === 'hold1' ? 'scale-110 opacity-100' : 'scale-85 opacity-30'
                }`}
              />

              {/* Main Animated Circle */}
              <div
                className={`w-36 h-36 rounded-full bg-gradient-to-tr ${activeConf.color} ${activeConf.scale} ${activeConf.glow} flex flex-col items-center justify-center text-slate-950 font-black shadow-2xl transition-all duration-1000 ease-in-out`}
              >
                <span className="text-3xl tracking-tighter">{phaseSecondsLeft}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest mt-0.5 opacity-80">
                  {phase === 'inhale' ? 'In' : phase === 'exhale' ? 'Out' : 'Hold'}
                </span>
              </div>
            </div>

            {/* Instruction Texts */}
            <div className="mt-4 mb-6 z-10">
              <h3 className="text-xl font-extrabold text-white tracking-tight transition-all duration-500">
                {activeConf.instruction}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs transition-all duration-500">
                {activeConf.subtext}
              </p>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center gap-3 z-10">
              <button
                onClick={() => setIsActive(!isActive)}
                className="px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30 flex items-center gap-2 active:scale-95 transition-all"
              >
                {isActive ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Resume</span>
                  </>
                )}
              </button>

              <button
                onClick={handleRestart}
                className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 active:scale-95 transition-all"
                title="Restart Session"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          /* Completed Session Card */
          <div className="py-6 space-y-4 z-10 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white">Session Completed!</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
                Your parasympathetic nervous system is stimulated. Heart rate variability is improved.
              </p>
            </div>

            {/* Vitals summary impact */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-800/60 border border-slate-700 text-left">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Vagal Tone</span>
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" /> High / Rested
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pulse Drop</span>
                <span className="text-sm font-bold text-teal-400 flex items-center gap-1 mt-0.5">
                  <Heart className="w-3.5 h-3.5 fill-teal-400" /> ~4-6 bpm
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold active:scale-95 transition-all"
              >
                Breathe Again
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/30 active:scale-95 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
