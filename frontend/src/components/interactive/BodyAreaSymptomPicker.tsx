import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  Brain,
  Heart,
  Stethoscope,
  Activity,
  Zap,
  ChevronRight,
  Sparkles,
  AlertCircle,
  MessageSquare,
  Check
} from 'lucide-react';

interface BodyZone {
  id: string;
  name: string;
  labelEn: string;
  icon: any;
  color: string;
  bgLight: string;
  bgDark: string;
  symptoms: string[];
  triageTip: string;
  redFlags: string;
}

export default function BodyAreaSymptomPicker() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [selectedZoneId, setSelectedZoneId] = useState<string>('chest');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const zones: BodyZone[] = [
    {
      id: 'head',
      name: 'Head & Senses',
      labelEn: 'Head & Neurological',
      icon: Brain,
      color: 'text-purple-500',
      bgLight: 'bg-purple-50',
      bgDark: 'dark:bg-purple-950/40',
      symptoms: ['Tension Headache', 'Dizziness / Lightheadedness', 'Vision Blur', 'Brain Fog', 'Ear Ringing'],
      triageTip: 'Hydrate well, rest in a dim room, and check if blood pressure is elevated.',
      redFlags: 'Sudden worst headache of life, facial drooping, or speech difficulty.'
    },
    {
      id: 'chest',
      name: 'Chest & Cardio',
      labelEn: 'Chest & Heart',
      icon: Heart,
      color: 'text-rose-500',
      bgLight: 'bg-rose-50',
      bgDark: 'dark:bg-rose-950/40',
      symptoms: ['Palpitations / Rapid Pulse', 'Chest Tightness', 'Shortness of Breath', 'Heart Flutter', 'Mild Pressure'],
      triageTip: 'Sit upright, practice 4-4-4 deep breathing, and check your resting pulse.',
      redFlags: 'Crushing pain radiating to left arm/jaw, severe shortness of breath, or sweating.'
    },
    {
      id: 'abdomen',
      name: 'Abdomen & Gut',
      labelEn: 'Abdomen & Digestive',
      icon: Stethoscope,
      color: 'text-teal-500',
      bgLight: 'bg-teal-50',
      bgDark: 'dark:bg-teal-950/40',
      symptoms: ['Acid Reflux / Heartburn', 'Abdominal Bloating', 'Stomach Cramps', 'Indigestion', 'Nausea'],
      triageTip: 'Sip warm water, avoid lying down immediately after eating, and choose light foods.',
      redFlags: 'Severe acute abdominal pain, continuous vomiting, or dark stools.'
    },
    {
      id: 'joints',
      name: 'Joints & Spine',
      labelEn: 'Joints & Mobility',
      icon: Activity,
      color: 'text-amber-500',
      bgLight: 'bg-amber-50',
      bgDark: 'dark:bg-amber-950/40',
      symptoms: ['Lower Back Ache', 'Knee Joint Stiffness', 'Neck & Shoulder Strain', 'Muscle Soreness'],
      triageTip: 'Apply gentle warm compress, perform light mobility stretches, and avoid heavy lifting.',
      redFlags: 'Loss of limb sensation, inability to bear any weight, or sudden joint swelling with fever.'
    },
    {
      id: 'energy',
      name: 'Energy & Sleep',
      labelEn: 'Vitality & Mood',
      icon: Zap,
      color: 'text-sky-500',
      bgLight: 'bg-sky-50',
      bgDark: 'dark:bg-sky-950/40',
      symptoms: ['Daytime Fatigue', 'Restless Sleep / Insomnia', 'Low Stamina', 'General Lethargy'],
      triageTip: 'Optimize sleep hygiene (dark, cool room), get 15 mins of morning sunlight, and hydrate.',
      redFlags: 'Chronic unremitting exhaustion accompanied by unexplained weight loss.'
    }
  ];

  const activeZone = zones.find(z => z.id === selectedZoneId) || zones[1];

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
    );
  };

  const handleAskAICopilot = () => {
    const symList = selectedSymptoms.length > 0 ? selectedSymptoms.join(', ') : activeZone.symptoms[0];
    const promptText = `I am experiencing symptoms related to ${activeZone.name}: ${symList}. Can you help explain possible causes and safe lifestyle suggestions?`;
    navigate('/chat', { state: { initialPrompt: promptText } });
  };

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xl relative overflow-hidden transition-all">
      {/* Decorative ambient blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16 animate-pulse-slow" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-200/60 dark:border-teal-800 inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />
            Interactive Body Triage
          </span>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1">
            Where are you feeling discomfort?
          </h2>
        </div>
      </div>

      {/* Body Zones Horizontal / Wrap Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {zones.map(zone => {
          const Icon = zone.icon;
          const isSelected = zone.id === selectedZoneId;
          return (
            <button
              key={zone.id}
              onClick={() => {
                setSelectedZoneId(zone.id);
                setSelectedSymptoms([]);
              }}
              className={`px-3.5 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 shrink-0 transition-all active:scale-95 ${
                isSelected
                  ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className={`w-6 h-6 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white/20 text-white' : `${zone.bgLight} ${zone.bgDark} ${zone.color}`}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span>{zone.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Zone Detail Drawer */}
      <div className="mt-4 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-3.5 animate-in fade-in duration-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
            Select Common Symptoms
          </span>
          <div className="flex flex-wrap gap-1.5">
            {activeZone.symptoms.map(symptom => {
              const isChecked = selectedSymptoms.includes(symptom);
              return (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                    isChecked
                      ? 'bg-teal-50 dark:bg-teal-950/80 border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-200 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 stroke-[2.5]" />}
                  <span>{symptom}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Immediate Safe Guidance */}
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>First-Line Calming Guidance</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {activeZone.triageTip}
          </p>
        </div>

        {/* Action Button: Consult AI Copilot */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate max-w-[200px] sm:max-w-xs">
              {activeZone.redFlags}
            </span>
          </div>

          <button
            onClick={handleAskAICopilot}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask AI Copilot</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
