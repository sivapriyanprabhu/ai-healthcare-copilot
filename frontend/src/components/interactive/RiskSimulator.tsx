import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Sliders,
  TrendingDown,
  Sparkles,
  Heart,
  Activity,
  Droplet,
  Moon,
  RotateCcw,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface RiskSimulatorProps {
  baselineRisk?: number;
  conditionName?: string;
}

export default function RiskSimulator({ baselineRisk = 68, conditionName = 'Cardiovascular' }: RiskSimulatorProps) {
  const { t } = useLanguage();

  // Baseline sliders
  const [systolicBp, setSystolicBp] = useState<number>(138);
  const [exerciseMins, setExerciseMins] = useState<number>(60);
  const [glucose, setGlucose] = useState<number>(115);
  const [sleepHours, setSleepHours] = useState<number>(6.0);

  // Compute simulated risk score dynamically based on clinical heuristics
  // Baseline is centered at systolic 138, exercise 60, glucose 115, sleep 6.0
  const computeSimulatedRisk = (): number => {
    let score = baselineRisk;

    // Blood pressure impact (120 is optimal)
    const bpDelta = systolicBp - 120;
    score += bpDelta * 0.45;

    // Exercise impact (150 mins is optimal)
    const exerciseDelta = exerciseMins - 60;
    score -= (exerciseDelta / 30) * 3.5;

    // Glucose impact (95 is optimal)
    const glucoseDelta = glucose - 95;
    score += glucoseDelta * 0.3;

    // Sleep impact (7.5 is optimal)
    if (sleepHours < 7) {
      score += (7 - sleepHours) * 4;
    } else if (sleepHours > 9) {
      score += (sleepHours - 9) * 2;
    } else {
      score -= 3; // restorative zone
    }

    return Math.max(8, Math.min(96, Math.round(score)));
  };

  const simulatedRisk = computeSimulatedRisk();
  const riskReduction = baselineRisk - simulatedRisk;

  const handleReset = () => {
    setSystolicBp(138);
    setExerciseMins(60);
    setGlucose(115);
    setSleepHours(6.0);
  };

  const getRiskCategory = (score: number) => {
    if (score < 30) return { label: 'Low Risk', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800', bar: 'bg-emerald-500' };
    if (score < 60) return { label: 'Moderate Risk', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800', bar: 'bg-amber-500' };
    return { label: 'Elevated Risk', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800', bar: 'bg-rose-500' };
  };

  const simulatedCat = getRiskCategory(simulatedRisk);
  const baselineCat = getRiskCategory(baselineRisk);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-mobile-card relative overflow-hidden transition-all">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

      {/* Top Banner */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-200/60 dark:border-teal-800 inline-flex items-center gap-1">
            <Sliders className="w-3 h-3 text-teal-600 dark:text-teal-400" />
            What-If Simulator
          </span>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1">
            Lifestyle Impact Simulation
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            See how small daily lifestyle habits directly reduce your projected risk.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Reset to Baseline"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Before / After Comparison Gauge */}
      <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 mb-6">
        <div className="flex items-center justify-between gap-4">
          
          {/* Baseline */}
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Baseline Risk</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-slate-700 dark:text-slate-300">{baselineRisk}%</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${baselineCat.bg} ${baselineCat.color}`}>
                {baselineCat.label}
              </span>
            </div>
          </div>

          {/* Arrow / Delta Badge */}
          <div className="flex flex-col items-center">
            {riskReduction > 0 ? (
              <div className="px-3 py-1 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center gap-1 font-bold text-xs shadow-xs">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>-{riskReduction}%</span>
              </div>
            ) : (
              <ArrowRight className="w-5 h-5 text-slate-400" />
            )}
            <span className="text-[9px] uppercase font-bold text-slate-400 mt-0.5">Simulated Change</span>
          </div>

          {/* Simulated */}
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Projected Risk</span>
            <div className="flex items-baseline justify-end gap-1 mt-0.5">
              <span className={`text-2xl font-black ${simulatedCat.color}`}>{simulatedRisk}%</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${simulatedCat.bg} ${simulatedCat.color}`}>
                {simulatedCat.label}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Progress Indicator */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ease-out ${simulatedCat.bar}`}
            style={{ width: `${simulatedRisk}%` }}
          />
        </div>
      </div>

      {/* 4 Interactive Sliders */}
      <div className="space-y-4">
        
        {/* Slider 1: Blood Pressure */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              Systolic Blood Pressure
            </span>
            <span className="font-extrabold text-teal-600 dark:text-teal-400">
              {systolicBp} mmHg {systolicBp <= 120 && '✨ Optimal'}
            </span>
          </div>
          <input
            type="range"
            min={100}
            max={180}
            step={1}
            value={systolicBp}
            onChange={(e) => setSystolicBp(Number(e.target.value))}
            className="w-full accent-teal-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>100 (Optimal)</span>
            <span>130 (Pre-HTN)</span>
            <span>180 (Elevated)</span>
          </div>
        </div>

        {/* Slider 2: Aerobic Exercise */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              Weekly Aerobic Exercise
            </span>
            <span className="font-extrabold text-teal-600 dark:text-teal-400">
              {exerciseMins} mins/wk {exerciseMins >= 150 && '🎯 AHA Goal'}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={300}
            step={15}
            value={exerciseMins}
            onChange={(e) => setExerciseMins(Number(e.target.value))}
            className="w-full accent-emerald-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>0 mins</span>
            <span>150 mins (Goal)</span>
            <span>300 mins</span>
          </div>
        </div>

        {/* Slider 3: Fasting Glucose */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-sky-500" />
              Fasting Blood Sugar
            </span>
            <span className="font-extrabold text-teal-600 dark:text-teal-400">
              {glucose} mg/dL {glucose <= 99 && '✨ Normal'}
            </span>
          </div>
          <input
            type="range"
            min={70}
            max={200}
            step={2}
            value={glucose}
            onChange={(e) => setGlucose(Number(e.target.value))}
            className="w-full accent-sky-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>70 (Normal)</span>
            <span>100 (Threshold)</span>
            <span>200 (High)</span>
          </div>
        </div>

        {/* Slider 4: Sleep Duration */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-purple-500" />
              Sleep Restfulness
            </span>
            <span className="font-extrabold text-teal-600 dark:text-teal-400">
              {sleepHours} hrs/night {sleepHours >= 7 && sleepHours <= 8.5 && '💤 Optimal'}
            </span>
          </div>
          <input
            type="range"
            min={4.5}
            max={10}
            step={0.5}
            value={sleepHours}
            onChange={(e) => setSleepHours(Number(e.target.value))}
            className="w-full accent-purple-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>4.5 hrs</span>
            <span>7.5 hrs (Optimal)</span>
            <span>10 hrs</span>
          </div>
        </div>

      </div>

      {/* Clinical Action Takeaway Card */}
      <div className="mt-5 p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/80 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
          <p className="font-bold text-teal-900 dark:text-teal-200">
            {riskReduction > 15
              ? 'Excellent Potential Improvement!'
              : 'Small Daily Adjustments Compound'}
          </p>
          <p>
            {exerciseMins >= 150
              ? 'Reaching 150 mins of aerobic activity reduces cardiovascular vulnerability and optimizes vascular flexibility.'
              : 'Increasing physical activity to 150 mins/week provides the single fastest reduction in long-term arterial stiffness.'}
          </p>
        </div>
      </div>
    </div>
  );
}
