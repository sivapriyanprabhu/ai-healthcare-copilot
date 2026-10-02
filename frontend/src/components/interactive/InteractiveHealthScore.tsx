import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Heart, Activity, ShieldCheck, Sparkles, TrendingUp, Info } from 'lucide-react';

interface InteractiveHealthScoreProps {
  score?: number;
  onExploreMetrics?: () => void;
}

export default function InteractiveHealthScore({ score = 84, onExploreMetrics }: InteractiveHealthScoreProps) {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'cardio' | 'glucose' | 'activity' | 'lifestyle'>('cardio');

  // Breakdown sub-scores
  const breakdown = {
    cardio: {
      title: 'Cardiovascular Health',
      score: 88,
      status: 'Optimal Range',
      statusClass: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
      tip: 'Your resting blood pressure (120/80) and heart rate are well-balanced.',
      icon: Heart,
      iconColor: 'text-rose-500'
    },
    glucose: {
      title: 'Glycemic Balance',
      score: 82,
      status: 'Healthy',
      statusClass: 'text-teal-600 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800',
      tip: 'Fasting glucose is in the normal target zone (95 mg/dL).',
      icon: Activity,
      iconColor: 'text-sky-500'
    },
    activity: {
      title: 'Physical Vitality',
      score: 79,
      status: 'Good Target',
      statusClass: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
      tip: 'Reaching 150 mins of moderate aerobic exercise weekly will boost this to 90+.',
      icon: TrendingUp,
      iconColor: 'text-amber-500'
    },
    lifestyle: {
      title: 'Rest & Resilience',
      score: 86,
      status: 'Excellent',
      statusClass: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800',
      tip: '7.5 hours of restorative sleep maintains healthy evening cortisol levels.',
      icon: ShieldCheck,
      iconColor: 'text-purple-500'
    }
  };

  const activeItem = breakdown[activeCategory];
  const CurrentIcon = activeItem.icon;

  // SVG circle calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * score) / 100;

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xl relative overflow-hidden transition-all">
      {/* Decorative ambient gradient glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-teal-500/15 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 animate-pulse-slow" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-200/60 dark:border-teal-800 inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />
            AI Wellness Index
          </span>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1">
            Overall Health Calibration
          </h2>
        </div>

        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Sync
        </span>
      </div>

      {/* Center Score Ring & Quick Metrics */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
        {/* Animated Circular Gauge */}
        <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              className="text-slate-100 dark:text-slate-800/80"
              fill="transparent"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="url(#healthGradient)"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ filter: 'drop-shadow(0 0 6px rgba(20, 184, 166, 0.45))' }}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              {score}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">
              out of 100
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-0.5">
              <span>●</span> Optimal State
            </span>
          </div>
        </div>

        {/* Interactive Breakdown Pills */}
        <div className="flex-1 w-full space-y-2">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Tap a domain to inspect:
          </p>

          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(breakdown) as Array<keyof typeof breakdown>).map((key) => {
              const item = breakdown[key];
              const isSelected = activeCategory === key;
              const Icon = item.icon;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveCategory(key)}
                  className={`p-2.5 rounded-2xl border text-left transition-all active:scale-[0.98] flex items-center justify-between ${
                    isSelected
                      ? 'border-teal-600 dark:border-teal-400 bg-teal-50/80 dark:bg-teal-950/60 shadow-xs'
                      : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${item.iconColor}`} />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {item.title.split(' ')[0]}
                    </span>
                  </div>
                  <span className="text-xs font-black text-teal-700 dark:text-teal-400">
                    {item.score}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Domain Insight Pill */}
          <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5">
            <CurrentIcon className={`w-4 h-4 shrink-0 mt-0.5 ${activeItem.iconColor}`} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {activeItem.title}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeItem.statusClass}`}>
                  {activeItem.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                {activeItem.tip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
