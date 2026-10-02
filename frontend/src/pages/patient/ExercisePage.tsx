import React, { useState, useEffect } from 'react';
import { patientService } from '../../services/patientService';
import { exerciseService } from '../../services/exerciseService';
import { PatientProfile, ExercisePlan, ExercisePlanRequest, ExerciseItem } from '../../types';
import {
  Dumbbell,
  Flame,
  Clock,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Heart,
  ShieldCheck,
  Settings,
  Languages,
  Play,
  Volume2,
  VolumeX,
  Wind,
  BookOpen,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
  Activity,
  CheckCircle
} from 'lucide-react';
import { YogaPoseIllustration } from '../../components/yoga/YogaPoseIllustration';
import { YogaTutorialModal } from '../../components/yoga/YogaTutorialModal';
import { YOGA_POSES_DATABASE, CLINICAL_FOCUS_AREAS, getPoseById } from '../../data/yogaPoses';
import { speakClinicalText, stopSpeaking } from '../../utils/speechUtils';
import { useLanguage } from '../../context/LanguageContext';

export default function ExercisePage() {
  const { language, setLanguage, t, speechCode, supportedLanguages } = useLanguage();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [plan, setPlan] = useState<ExercisePlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active view: 'schedule' or 'library'
  const [activeTab, setActiveTab] = useState<'schedule' | 'library'>('schedule');

  // Mode and Language states
  const [routineType, setRoutineType] = useState<'yoga' | 'combined' | 'exercise'>('yoga');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(language || 'en');

  // Sync with global language preference
  useEffect(() => {
    if (language && language !== selectedLanguage) {
      setSelectedLanguage(language);
    }
  }, [language]);

  // Form states
  const [age, setAge] = useState<number>(38);
  const [fitnessLevel, setFitnessLevel] = useState<string>('Intermediate');
  const [goal, setGoal] = useState<string>('Therapeutic Wellness & Stress Reduction');
  const [availableMinutes, setAvailableMinutes] = useState<number>(30);
  const [injuries, setInjuries] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);

  // Selected Day tab in scheduler
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  // Tutorial Modal state
  const [tutorialAsana, setTutorialAsana] = useState<ExerciseItem | null>(null);

  // Audio speech playback state
  const [currentlySpeakingName, setCurrentlySpeakingName] = useState<string | null>(null);

  // Library category filter
  const [selectedLibraryCategory, setSelectedLibraryCategory] = useState<string>('all');

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await patientService.getProfile();
        setProfile(data);
        if (data.age) setAge(data.age);

        const injuryList: string[] = [];
        if (data.existingConditions) {
          const lowerCond = data.existingConditions.toLowerCase();
          if (lowerCond.includes('knee') || lowerCond.includes('joint') || lowerCond.includes('arthr')) {
            injuryList.push('Knee Pain');
          }
          if (lowerCond.includes('back') || lowerCond.includes('spine') || lowerCond.includes('disc')) {
            injuryList.push('Back Pain');
          }
          if (lowerCond.includes('hypertens') || lowerCond.includes('bp') || lowerCond.includes('blood pressure')) {
            injuryList.push('Hypertension');
          }
        }
        setInjuries(injuryList);

        // Fetch initial therapeutic yoga routine
        fetchRoutine('yoga', 'en', injuryList, data.age || 38);
      } catch (err) {
        console.error('Failed to load profile data', err);
        fetchRoutine('yoga', 'en', [], 38);
      } finally {
        setInitialLoading(false);
      }
    }
    loadProfile();

    return () => {
      stopSpeaking();
    };
  }, []);

  const fetchRoutine = async (
    rType: 'yoga' | 'combined' | 'exercise',
    lang: string,
    injList: string[],
    userAge: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      const requestData: ExercisePlanRequest = {
        age: userAge,
        fitnessLevel,
        goal,
        availableMinutes,
        injuries: injList,
        preferences,
        routineType: rType,
        language: lang
      };
      const response = await exerciseService.generatePlan(requestData);
      setPlan(response);

      const days = Object.keys(response.weeklyPlan);
      if (days.length > 0 && !days.includes(selectedDay)) {
        setSelectedDay(days[0]);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch customized routine from AI Service. Please ensure server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (newMode: 'yoga' | 'combined' | 'exercise') => {
    setRoutineType(newMode);
    fetchRoutine(newMode, selectedLanguage, injuries, age);
  };

  const handleLanguageChange = (newLang: string) => {
    setSelectedLanguage(newLang);
    setLanguage(newLang as any);
    stopSpeaking();
    setCurrentlySpeakingName(null);
    fetchRoutine(routineType, newLang, injuries, age);
  };

  const handleInjuryToggle = (name: string) => {
    setInjuries((prev) => (prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]));
  };

  const handlePreferenceToggle = (name: string) => {
    setPreferences((prev) => (prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRoutine(routineType, selectedLanguage, injuries, age);
  };

  const handleVoiceReadout = (item: ExerciseItem) => {
    if (currentlySpeakingName === item.name) {
      stopSpeaking();
      setCurrentlySpeakingName(null);
    } else {
      stopSpeaking();
      const textToSpeak = `${item.name}. ${
        item.breathingCue ? 'Breathing guidance: ' + item.breathingCue + '. ' : ''
      }${item.instructions}. Clinical benefits: ${item.benefits?.join(', ') || 'Nervous system rejuvenation'}.`;

      speakClinicalText({
        text: textToSpeak,
        speechCode: speechCode || selectedLanguage || 'en-US',
        onStart: () => setCurrentlySpeakingName(item.name),
        onEnd: () => setCurrentlySpeakingName(null),
        onError: () => setCurrentlySpeakingName(null)
      });
    }
  };

  const openTutorialForLibraryPose = (pose: any) => {
    const asanaItem: ExerciseItem = {
      name: pose.name,
      sanskritName: pose.sanskritName,
      category: pose.category,
      durationMinutes: Math.round(pose.recommendedHoldSeconds / 60) || 5,
      intensityLevel: pose.level,
      caloriesBurned: Math.round(pose.caloriesPerMinute * 8),
      muscleGroups: pose.targetOrgans,
      instructions: pose.alignmentCheckpoints.join('. '),
      breathingCue: 'Slow rhythmic inhalation and exhalation synchronized with posture.',
      benefits: [
        'Improves organ vitality and neurological function',
        'Relieves tension in target muscle groups and spine',
        'Enhances cardiovascular and autonomic balance'
      ],
      precautions: ['Listen to joint boundaries and avoid sharp pinching'],
      imageUrl: pose.id,
      videoEmbedId: pose.videoEmbedId,
      videoUrl: pose.videoUrl,
      language: selectedLanguage
    };
    setTutorialAsana(asanaItem);
  };

  const fitnessLevelOptions = ['Beginner', 'Intermediate', 'Advanced'];
  const goalOptions = [
    'Daily Stress Relief & Relaxation',
    'Heart & Blood Pressure Health',
    'Healthy Blood Sugar & Energy',
    'Back & Joint Relief',
    'Flexibility & Good Posture',
    'Healthy Weight & Core Strength'
  ];
  const injuryOptions = ['Knee Pain', 'Back Pain', 'Shoulder Pain', 'High Blood Pressure', 'Neck Stiffness'];
  const preferenceOptions = ['Yoga Mat Only', 'Morning Practice', 'Bedtime Recovery', 'Low Impact'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Filtered Library Poses
  const filteredLibraryPoses =
    selectedLibraryCategory === 'all'
      ? YOGA_POSES_DATABASE
      : YOGA_POSES_DATABASE.filter((p) => p.clinicalCategory === selectedLibraryCategory);

  if (initialLoading) {
    return (
      <div className="min-h-[55vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 animate-spin">
          <RefreshCw className="w-7 h-7" />
        </div>
        <p className="text-sm font-medium text-slate-400">Preparing Your Exercise & Yoga Guide...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 border border-emerald-900/40 p-6 md:p-8 shadow-2xl">
        {/* Glow Spheres */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 bottom-0 translate-y-16 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Personal Exercise & Yoga</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Daily Exercise & Yoga Routine
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Personalized yoga poses, gentle breathing exercises, and simple workouts tailored to your body and comfort — complete with visual pose illustrations, step-by-step videos, and voice guidance.
            </p>
          </div>

          {/* Routine Mode Selector Bar */}
          <div className="bg-slate-900/90 border border-slate-700/80 p-1.5 rounded-2xl flex flex-col sm:flex-row gap-1 shadow-lg shrink-0">
            <button
              onClick={() => handleModeChange('yoga')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                routineType === 'yoga'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Yoga Routine</span>
            </button>

            <button
              onClick={() => handleModeChange('combined')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                routineType === 'combined'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md shadow-teal-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Holistic Flow</span>
            </button>

            <button
              onClick={() => handleModeChange('exercise')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                routineType === 'exercise'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>Cardio & Strength</span>
            </button>
          </div>
        </div>

        {/* Regional Language Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Languages className="w-4 h-4 text-emerald-400" />
            <span>Instructions & Audio Language:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {supportedLanguages.map((lang) => {
              const isActive = selectedLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md shadow-emerald-500/25'
                      : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{lang.nativeName}</span>
                  {lang.code !== 'en' && <span className="text-[10px] opacity-70">({lang.name})</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main View Switcher: Weekly Schedule vs Explore Asanas Library */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'schedule'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Weekly Regimen Plan</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'library'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore Asanas Library ({YOGA_POSES_DATABASE.length})</span>
          </button>
        </div>

        {plan && (
          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              {plan.totalWeeklyMinutes} mins / week
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              ~{plan.estimatedWeeklyCalories} kcal
            </span>
          </div>
        )}
      </div>

      {/* TAB 1: WEEKLY SCHEDULE VIEW */}
      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Customization Settings */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Settings className="w-4 h-4 text-emerald-500" />
              <h2 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
                Clinical Parameters
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Age & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(+e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                    Daily Time
                  </label>
                  <select
                    value={availableMinutes}
                    onChange={(e) => setAvailableMinutes(+e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value={15}>15 mins</option>
                    <option value={20}>20 mins</option>
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins</option>
                  </select>
                </div>
              </div>

              {/* Fitness Experience */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                  Experience Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {fitnessLevelOptions.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFitnessLevel(level)}
                      className={`py-2 px-1 text-center rounded-xl border text-[11px] font-semibold transition-all ${
                        fitnessLevel === level
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Focus / Goal */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                  Clinical Focus Goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {goalOptions.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Orthopedic Restrictions */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                  Joint / Clinical Conditions
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {injuryOptions.map((opt) => {
                    const active = injuries.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleInjuryToggle(opt)}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                          active
                            ? 'bg-rose-500 border-rose-500 text-white shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Routine Preferences */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                  Practice Preferences
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {preferenceOptions.map((opt) => {
                    const active = preferences.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handlePreferenceToggle(opt)}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                          active
                            ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Regenerate Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Calculating Optimal Regimen...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Update Regimen Schedule
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Weekly Schedule Output & Pose Cards */}
          <div className="lg:col-span-8 space-y-6">
            {error && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {plan ? (
              <div className="space-y-6">
                {/* 7-Day Calendar Tabs */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto scrollbar-none">
                    {daysOfWeek.map((day) => {
                      const isActive = selectedDay === day;
                      const dayCount = plan.weeklyPlan[day]?.length || 0;
                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDay(day)}
                          className={`flex-1 min-w-[85px] py-3.5 px-2 text-center transition-all cursor-pointer border-b-2 flex flex-col items-center gap-0.5 ${
                            isActive
                              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/30 font-bold'
                              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium'
                          }`}
                        >
                          <span className="text-xs uppercase">{day.substring(0, 3)}</span>
                          <span className="text-[10px] font-mono opacity-70">
                            {dayCount} {dayCount === 1 ? 'pose' : 'poses'}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Day Exercise / Asana Cards */}
                  <div className="p-5 md:p-6 space-y-6">
                    {plan.weeklyPlan[selectedDay] && plan.weeklyPlan[selectedDay].length > 0 ? (
                      <div className="space-y-6">
                        {plan.weeklyPlan[selectedDay].map((item, idx) => {
                          const isRest = item.intensityLevel === 'Rest';
                          const isVoicePlaying = currentlySpeakingName === item.name;

                          return (
                            <div
                              key={idx}
                              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 p-5 transition-all hover:border-emerald-500/40 shadow-xs"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                                {/* Pose Illustration / Vector (Left) */}
                                <div className="md:col-span-4 flex flex-col items-center">
                                  <div
                                    onClick={() => setTutorialAsana(item)}
                                    className="w-full cursor-pointer group relative rounded-xl overflow-hidden"
                                    title="Click to watch HD tutorial video"
                                  >
                                    <YogaPoseIllustration poseId={item.imageUrl || item.name} />
                                    {/* Play tutorial hover overlay */}
                                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold">
                                      <Play className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                                      <span>Watch Tutorial</span>
                                    </div>
                                  </div>

                                  {/* Fast Action Buttons */}
                                  <div className="flex items-center gap-2 mt-2.5 w-full">
                                    <button
                                      onClick={() => setTutorialAsana(item)}
                                      className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
                                    >
                                      <Play className="w-3.5 h-3.5" />
                                      <span>Tutorial Video</span>
                                    </button>

                                    <button
                                      onClick={() => handleVoiceReadout(item)}
                                      className={`p-1.5 rounded-lg border text-[11px] font-medium transition ${
                                        isVoicePlaying
                                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                                      }`}
                                      title={isVoicePlaying ? 'Stop Voice Guide' : 'Voice Guidance'}
                                    >
                                      {isVoicePlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                    </button>
                                  </div>
                                </div>

                                {/* Pose Information & Clinical Notes (Right) */}
                                <div className="md:col-span-8 space-y-3">
                                  <div className="flex flex-wrap items-start justify-between gap-2">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                          {item.name}
                                        </h3>
                                        {item.sanskritName && (
                                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                            {item.sanskritName}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        {item.category || 'Therapeutic Asana'}
                                      </p>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                        {item.durationMinutes} mins
                                      </span>
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                                        {item.caloriesBurned} kcal
                                      </span>
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                        {item.intensityLevel}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Pranayama Breathing Cue */}
                                  {item.breathingCue && (
                                    <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 flex items-start gap-2">
                                      <Wind className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                                      <p className="text-xs text-sky-900 dark:text-sky-200">
                                        <span className="font-semibold">Pranayama Breath: </span>
                                        {item.breathingCue}
                                      </p>
                                    </div>
                                  )}

                                  {/* Instructions */}
                                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-950/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                    {item.instructions}
                                  </p>

                                  {/* Benefits & Precautions */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                    {item.benefits && item.benefits.length > 0 && (
                                      <div className="space-y-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                          <Heart className="w-3 h-3" /> Clinical Benefits
                                        </span>
                                        <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                                          {item.benefits.slice(0, 3).map((b, bIdx) => (
                                            <li key={bIdx} className="flex items-start gap-1.5">
                                              <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                              <span>{b}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    {item.precautions && item.precautions.length > 0 && (
                                      <div className="space-y-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                          <AlertTriangle className="w-3 h-3" /> Precautions
                                        </span>
                                        <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                                          {item.precautions.slice(0, 2).map((p, pIdx) => (
                                            <li key={pIdx} className="flex items-start gap-1.5">
                                              <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                              <span>{p}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-slate-400 text-xs">
                        No asanas scheduled for {selectedDay}. Rest and hydrate.
                      </div>
                    )}
                  </div>
                </div>

                {/* Safety Guidelines & Clinical Notice */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
                      Clinical Safety & Alignment Directives
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {plan.safetyTips.map((tip, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Disclaimer */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs leading-relaxed flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{plan.disclaimer}</span>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center text-slate-400 space-y-3 flex flex-col items-center justify-center min-h-[350px]">
                <Sparkles className="w-10 h-10 text-emerald-500 mb-1" />
                <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                  Generating your customized regimen...
                </h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Analyzing your orthopedic parameters and formulating therapeutic yoga sequences.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: EXPLORE ASANAS LIBRARY */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pb-2">
            {CLINICAL_FOCUS_AREAS.map((cat) => {
              const active = selectedLibraryCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedLibraryCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Library Asana Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLibraryPoses.map((pose) => (
              <div
                key={pose.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Visual Illustration */}
                  <div
                    onClick={() => openTutorialForLibraryPose(pose)}
                    className="cursor-pointer group relative overflow-hidden"
                  >
                    <YogaPoseIllustration poseId={pose.id} className="w-full h-48" />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold">
                      <Play className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                      <span>Watch Video Tutorial</span>
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">{pose.name}</h3>
                        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          {pose.sanskritName}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {pose.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {pose.targetOrgans.map((organ, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                        >
                          {organ}
                        </span>
                      ))}
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-1">
                      <p className="line-clamp-2">{pose.alignmentCheckpoints[0]}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">Hold: {pose.recommendedHoldSeconds}s</span>
                  <button
                    onClick={() => openTutorialForLibraryPose(pose)}
                    className="py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Watch Tutorial</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Video Tutorial & Practice Modal */}
      {tutorialAsana && (
        <YogaTutorialModal
          asana={tutorialAsana}
          onClose={() => setTutorialAsana(null)}
          selectedLanguage={selectedLanguage}
        />
      )}
    </div>
  );
}
