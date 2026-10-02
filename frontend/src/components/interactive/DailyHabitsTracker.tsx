import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Droplet, Footprints, Moon, Flame, Plus, RotateCcw, Check, Sparkles, Award } from 'lucide-react';

interface DailyHabits {
  waterMl: number;
  waterTargetMl: number;
  steps: number;
  stepsTarget: number;
  sleepHours: number;
  sleepTarget: number;
  streakDays: number;
  completedDays: boolean[];
}

const STORAGE_KEY = 'ai_healthcare_daily_habits';

const DEFAULT_HABITS: DailyHabits = {
  waterMl: 1750,
  waterTargetMl: 2500,
  steps: 6420,
  stepsTarget: 8000,
  sleepHours: 7.5,
  sleepTarget: 8.0,
  streakDays: 5,
  completedDays: [true, true, true, true, true, false, false] // Mon - Sun
};

export default function DailyHabitsTracker() {
  const { t } = useLanguage();
  const [habits, setHabits] = useState<DailyHabits>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEFAULT_HABITS;
  });

  const [waterSplash, setWaterSplash] = useState(false);
  const [stepSplash, setStepSplash] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch (e) {
      // ignore
    }
  }, [habits]);

  const addWater = (amount: number = 250) => {
    setWaterSplash(true);
    setTimeout(() => setWaterSplash(false), 500);
    setHabits(prev => ({
      ...prev,
      waterMl: Math.min(prev.waterTargetMl + 1000, prev.waterMl + amount)
    }));
  };

  const resetWater = () => {
    setHabits(prev => ({ ...prev, waterMl: 0 }));
  };

  const addSteps = (amount: number = 500) => {
    setStepSplash(true);
    setTimeout(() => setStepSplash(false), 500);
    setHabits(prev => ({
      ...prev,
      steps: Math.min(prev.stepsTarget + 5000, prev.steps + amount)
    }));
  };

  const waterPercent = Math.min(100, Math.round((habits.waterMl / habits.waterTargetMl) * 100));
  const stepsPercent = Math.min(100, Math.round((habits.steps / habits.stepsTarget) * 100));
  const sleepPercent = Math.min(100, Math.round((habits.sleepHours / habits.sleepTarget) * 100));

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xl relative overflow-hidden transition-all">
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16 animate-pulse-slow" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-200/60 dark:border-teal-800 inline-flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
            Daily Vitality
          </span>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1">
            Interactive Habits & Routine
          </h2>
        </div>

        {/* Streak Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/80 text-amber-700 dark:text-amber-300">
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
          <span className="text-xs font-black">{habits.streakDays} Day Streak</span>
        </div>
      </div>

      {/* Weekly Progress Dots */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 mb-5">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Weekly Goal</span>
        <div className="flex items-center gap-2">
          {daysOfWeek.map((day, idx) => {
            const isDone = habits.completedDays[idx];
            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-transform ${
                    isDone
                      ? 'bg-teal-600 text-white shadow-xs scale-105'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : day}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Main Interactive Habit Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* 1. Hydration Tracker */}
        <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-900/60 flex items-center justify-center text-sky-600 dark:text-sky-300">
                <Droplet className={`w-4 h-4 fill-sky-500 text-sky-500 transition-transform ${waterSplash ? 'scale-125' : ''}`} />
              </div>
              <button
                onClick={resetWater}
                title="Reset Water"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[10px]"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Hydration</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-extrabold text-sky-600 dark:text-sky-400">{habits.waterMl}</span>
              <span className="text-[11px] text-slate-400 font-medium">/ {habits.waterTargetMl} ml</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-sky-100 dark:bg-sky-950 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">{waterPercent}% completed</span>
          </div>

          <button
            onClick={() => addWater(250)}
            className="mt-3 w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+250ml Glass</span>
          </button>
        </div>

        {/* 2. Step Tracker */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
                <Footprints className={`w-4 h-4 text-emerald-600 transition-transform ${stepSplash ? 'scale-125' : ''}`} />
              </div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Daily Steps</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{habits.steps.toLocaleString()}</span>
              <span className="text-[11px] text-slate-400 font-medium">/ {habits.stepsTarget.toLocaleString()}</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-emerald-100 dark:bg-emerald-950 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${stepsPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">{stepsPercent}% of daily goal</span>
          </div>

          <button
            onClick={() => addSteps(500)}
            className="mt-3 w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+500 Steps</span>
          </button>
        </div>

        {/* 3. Sleep & Rest */}
        <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-purple-600 dark:text-purple-300">
                <Moon className="w-4 h-4 fill-purple-500 text-purple-500" />
              </div>
              <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 bg-purple-100/80 dark:bg-purple-900/50 px-2 py-0.5 rounded-full">
                Restful
              </span>
            </div>

            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Sleep Duration</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400">{habits.sleepHours}</span>
              <span className="text-[11px] text-slate-400 font-medium">/ {habits.sleepTarget} hrs</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-purple-100 dark:bg-purple-950 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${sleepPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">94% restorative sleep</span>
          </div>

          <div className="mt-3 py-2 px-3 rounded-xl bg-purple-100/60 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-center text-xs font-semibold">
            Optimal REM cycle achieved
          </div>
        </div>

      </div>
    </div>
  );
}
