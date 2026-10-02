import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Wind,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Timer
} from 'lucide-react';
import { ExerciseItem } from '../../types';
import { getPoseById } from '../../data/yogaPoses';
import { speakClinicalText, stopSpeaking } from '../../utils/speechUtils';
import { YogaPoseIllustration } from './YogaPoseIllustration';

interface YogaTutorialModalProps {
  asana: ExerciseItem | null;
  onClose: () => void;
  selectedLanguage: string;
}

export const YogaTutorialModal: React.FC<YogaTutorialModalProps> = ({
  asana,
  onClose,
  selectedLanguage
}) => {
  if (!asana) return null;

  const poseDef = getPoseById(asana.imageUrl || asana.name);
  const videoEmbedId = asana.videoEmbedId || poseDef?.videoEmbedId || 'E1xym-F_B84';
  const holdTargetSeconds = poseDef?.recommendedHoldSeconds || 60;

  // View mode: video vs visualizer
  const [viewMode, setViewMode] = useState<'video' | 'visualizer'>('video');

  // Hold Timer state
  const [secondsRemaining, setSecondsRemaining] = useState<number>(holdTargetSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio guidance state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Checked alignment steps
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setSecondsRemaining(holdTargetSeconds);
    setIsTimerRunning(false);
    setCompletedSteps({});
    stopSpeaking();
    setIsSpeaking(false);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopSpeaking();
    };
  }, [asana, holdTargetSeconds]);

  // Timer Tick
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            // Play gentle browser beep when timer finishes
            try {
              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 pleasant chime
              gain.gain.setValueAtTime(0.2, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start();
              osc.stop(ctx.currentTime + 1.2);
            } catch (e) {
              console.warn('Audio chime failed', e);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const toggleTimer = () => {
    if (secondsRemaining === 0) setSecondsRemaining(holdTargetSeconds);
    setIsTimerRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setSecondsRemaining(holdTargetSeconds);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      const speechText = `${asana.name}. ${asana.breathingCue ? 'Breathing guidance: ' + asana.breathingCue + '. ' : ''}${asana.instructions}. Key benefits: ${asana.benefits?.join(', ')}`;
      speakClinicalText({
        text: speechText,
        speechCode: selectedLanguage || 'en',
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
    }
  };

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const alignmentSteps =
    poseDef?.alignmentCheckpoints ||
    asana.instructions.split('. ').filter((s) => s.trim().length > 0);

  const timerProgress = ((holdTargetSeconds - secondsRemaining) / holdTargetSeconds) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">{asana.name}</h2>
                {asana.sanskritName && (
                  <span className="hidden sm:inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    {asana.sanskritName}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {asana.category || 'Therapeutic Yoga'} • {asana.intensityLevel || 'Gentle'} • {asana.durationMinutes || 8} mins recommended
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Hands-free Audio Button */}
            <button
              onClick={toggleSpeech}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-medium ${
                isSpeaking
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
              title={isSpeaking ? 'Stop voice readout' : 'Listen to voice instructions'}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden md:inline">{isSpeaking ? 'Mute Guide' : 'Voice Guide'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Video Player & Timer Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video / Visualizer Container (2 cols on large) */}
            <div className="lg:col-span-2 space-y-2">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-1.5 bg-slate-800/70 p-1 rounded-xl border border-slate-700/60 text-xs">
                  <button
                    onClick={() => setViewMode('video')}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      viewMode === 'video'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Video Tutorial
                  </button>
                  <button
                    onClick={() => setViewMode('visualizer')}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      viewMode === 'visualizer'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Pose Visualizer
                  </button>
                </div>

                <a
                  href={`https://www.youtube.com/watch?v=${videoEmbedId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30 text-xs font-semibold transition"
                >
                  <span>Watch on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {viewMode === 'video' ? (
                <div className="space-y-2">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg group">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${videoEmbedId}?rel=0&modestbranding=1`}
                      title={`${asana.name} Video Tutorial`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Verified Instructional Video</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-500 font-mono">ID: {videoEmbedId}</span>
                    </div>
                    <button
                      onClick={() => setViewMode('visualizer')}
                      className="text-emerald-400 hover:text-emerald-300 underline font-medium text-xs"
                    >
                      Use Pose Visualizer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg flex items-center justify-center p-4">
                  <YogaPoseIllustration poseId={asana.imageUrl || asana.name} className="w-full h-full max-h-64" />
                </div>
              )}
            </div>

            {/* Practice Hold Timer Card */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
                    <Timer className="w-4 h-4 text-emerald-400" /> Pose Hold Timer
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Target: {holdTargetSeconds}s</span>
                </div>

                {/* Circular / Radial Progress Counter */}
                <div className="relative flex flex-col items-center justify-center my-4">
                  <div className="text-4xl font-extrabold font-mono tracking-tight text-white">
                    {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60).toString().padStart(2, '0')}
                  </div>
                  <span className="text-xs text-slate-400 mt-1">
                    {secondsRemaining === 0 ? '✨ Pose Complete!' : isTimerRunning ? 'Hold & breathe...' : 'Ready when you are'}
                  </span>

                  {/* Progress bar line */}
                  <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        secondsRemaining === 0 ? 'bg-emerald-400' : 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                      }`}
                      style={{ width: `${timerProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={toggleTimer}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition ${
                    isTimerRunning
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                      : 'bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isTimerRunning ? 'Pause Hold' : secondsRemaining === 0 ? 'Restart Hold' : 'Start Hold'}
                </button>
                <button
                  onClick={resetTimer}
                  className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Pranayama & Breath Cue Banner */}
          {asana.breathingCue && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-transparent border border-sky-500/30 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-sky-500/20 text-sky-300 mt-0.5">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-sky-200">Pranayama / Breath Synchronization</h4>
                <p className="text-sm text-sky-100/90 mt-0.5">{asana.breathingCue}</p>
              </div>
            </div>
          )}

          {/* Alignment Checklist */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Step-by-Step Alignment Checklist
            </h3>
            <div className="space-y-2.5">
              {alignmentSteps.map((step, idx) => {
                const isDone = !!completedSteps[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isDone
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                        : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-colors ${
                        isDone ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    />
                    <div className="flex-1 text-sm leading-relaxed">
                      <span className="font-medium mr-1 text-slate-200">Step {idx + 1}:</span>
                      {step}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Benefits & Precautions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Clinical Benefits */}
            {asana.benefits && asana.benefits.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-500/20">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                  <Heart className="w-4 h-4" /> Clinical Benefits
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {asana.benefits.map((ben, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Medical Precautions */}
            {asana.precautions && asana.precautions.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-amber-500/20">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Orthopedic Precautions
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {asana.precautions.map((prec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                      <span>{prec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <span>AI Healthcare Copilot • Clinical Yoga Therapy</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition"
          >
            Finished Practice
          </button>
        </div>
      </div>
    </div>
  );
};
