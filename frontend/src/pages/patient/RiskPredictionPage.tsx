import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { riskService, RiskPredictionResponse } from '../../services/riskService';
import { useLanguage } from '../../context/LanguageContext';
import {
  Heart,
  Droplet,
  Brain,
  Gauge,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Volume2,
  VolumeX,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ShieldCheck,
  Info,
  RotateCcw,
  MessageSquare
} from 'lucide-react';
import { speakClinicalText, stopSpeaking } from '../../utils/speechUtils';
import RiskSimulator from '../../components/interactive/RiskSimulator';

export default function RiskPredictionPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, tRisk, language, currentLangInfo } = useLanguage();

  // Selected module: null means Hub view; otherwise 'heart-disease' | 'diabetes' | 'stroke' | 'hypertension'
  const [activeModule, setActiveModule] = useState<string | null>(null);

  // Wizard step: 1, 2, or 3
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields
  const [age, setAge] = useState<number>(45);
  const [sex, setSex] = useState<string>('Male');
  const [familyHistory, setFamilyHistory] = useState<boolean>(false);

  const [systolicBp, setSystolicBp] = useState<number>(128);
  const [cholesterol, setCholesterol] = useState<number>(210);
  const [glucose, setGlucose] = useState<number>(105);
  const [bmi, setBmi] = useState<number>(25.8);

  const [smoking, setSmoking] = useState<boolean>(false);
  const [exerciseMins, setExerciseMins] = useState<number>(120);

  // Results & status
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskPredictionResponse | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const conditionParam = searchParams.get('condition');
    if (conditionParam) {
      setActiveModule(conditionParam);
      setCurrentStep(1);
      setResult(null);
    }
  }, [searchParams]);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const modules = [
    {
      id: 'heart-disease',
      name: t('heart_disease', 'Heart Disease'),
      subtitle: t('heart_card_desc', 'Assess your cardiovascular risk'),
      icon: Heart,
      iconColor: 'text-rose-500',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40',
      badge: 'AHA ASCVD'
    },
    {
      id: 'diabetes',
      name: t('diabetes', 'Diabetes'),
      subtitle: t('diabetes_card_desc', 'Assess your diabetes risk'),
      icon: Droplet,
      iconColor: 'text-sky-500',
      bgColor: 'bg-sky-50 dark:bg-sky-950/40',
      badge: 'ADA FINDRISC'
    },
    {
      id: 'stroke',
      name: t('stroke', 'Stroke'),
      subtitle: t('stroke_card_desc', 'Assess your stroke risk'),
      icon: Brain,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40',
      badge: 'Framingham Profile'
    },
    {
      id: 'hypertension',
      name: t('hypertension', 'Hypertension'),
      subtitle: t('hypertension_card_desc', 'Assess your blood pressure risk'),
      icon: Gauge,
      iconColor: 'text-teal-500',
      bgColor: 'bg-teal-50 dark:bg-teal-950/40',
      badge: 'AHA/ACC Criteria'
    },
  ];

  const currentModuleObj = modules.find((m) => m.id === activeModule) || modules[0];

  const handleStartAssessment = (moduleId: string) => {
    setActiveModule(moduleId);
    setCurrentStep(1);
    setResult(null);
  };

  const handleCalculateRisk = async () => {
    try {
      setLoading(true);
      const payload = {
        age,
        sex,
        systolicBp,
        cholesterol,
        glucose,
        bmi,
        smoking,
        exerciseMins,
        familyHistory,
        condition: activeModule || 'heart-disease'
      };

      const res = await riskService.predictRisk(payload);
      setResult(res);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to calculate risk', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    if (!result) return;
    const readoutText = `${currentModuleObj.name} ${tRisk(result.riskCategory)}. ${result.patientPlainSummary || result.summary || ''} ${(result.recommendations || []).join('. ')}`;

    setIsSpeaking(true);
    speakClinicalText({
      text: readoutText,
      speechCode: currentLangInfo.speechCode || 'en-US',
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  // -------------------------------------------------------------
  // VIEW 1: HEALTH ASSESSMENTS HUB (When no active module selected)
  // -------------------------------------------------------------
  if (!activeModule) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('health_assessments_title', 'Health Assessments')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('health_assessments_subtitle', 'Understand your health risks using AI-powered clinical assessments.')}
          </p>
        </div>

        {/* 4 Large Assessment Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-mobile-card flex flex-col justify-between hover:border-teal-500/50 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 rounded-2xl ${mod.bgColor} flex items-center justify-center ${mod.iconColor}`}>
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800">
                      {mod.badge}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    {mod.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {mod.subtitle}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-teal-600 dark:text-teal-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>3 min assessment</span>
                  </span>
                  <button
                    onClick={() => handleStartAssessment(mod.id)}
                    className="px-4 py-2 rounded-2xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-bold text-xs shadow-md shadow-teal-600/20 active:scale-95 transition-all flex items-center gap-1"
                  >
                    <span>{t('start_assessment', 'Start Assessment')}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Lifestyle Risk Simulator */}
        <RiskSimulator baselineRisk={52} conditionName="Cardiovascular & Metabolic" />

        {/* Clinical Note Card */}
        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
          <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <p>
            Assessments utilize validated clinical models (AHA/ACC, ADA, Framingham). Internal metrics remain standardized while your results, factor analyses, and lifestyle advice are localized in your chosen language.
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: RESULT SCREEN (When prediction is completed)
  // -------------------------------------------------------------
  if (result) {
    const riskLevel = result.riskCategory || 'MODERATE';
    const riskScore = Math.round(result.riskScorePercent ?? result.riskScore ?? 68);

    const riskBadge = {
      LOW: {
        text: tRisk('LOW'),
        icon: '🟢',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
        colorClass: 'text-emerald-600 dark:text-emerald-400',
        strokeColor: '#10b981'
      },
      MODERATE: {
        text: tRisk('MODERATE'),
        icon: '🟡',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
        colorClass: 'text-amber-600 dark:text-amber-400',
        strokeColor: '#f59e0b'
      },
      HIGH: {
        text: tRisk('HIGH'),
        icon: '🔴',
        badgeClass: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
        colorClass: 'text-rose-600 dark:text-rose-400',
        strokeColor: '#ef4444'
      }
    }[riskLevel as 'LOW' | 'MODERATE' | 'HIGH'] || {
      text: tRisk('MODERATE'),
      icon: '🟡',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      colorClass: 'text-amber-600',
      strokeColor: '#f59e0b'
    };

    return (
      <div className="space-y-5 animate-in fade-in duration-300">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setResult(null)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Edit Information</span>
          </button>

          <button
            onClick={toggleSpeech}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isSpeaking
                ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300 animate-pulse'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSpeaking ? 'Stop Audio' : 'Listen in My Language'}</span>
          </button>
        </div>

        {/* Visual Risk Gauge Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-mobile-card text-center relative overflow-hidden">
          <div className="max-w-xs mx-auto flex flex-col items-center">
            
            {/* Circular Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  className="stroke-slate-100 dark:stroke-slate-800"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke={riskBadge.strokeColor}
                  strokeWidth="10"
                  strokeDasharray={314}
                  strokeDashoffset={314 - (314 * riskScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {riskScore}%
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Probability
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-lg">{riskBadge.icon}</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {riskBadge.text}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {currentModuleObj.name} Risk Estimation
            </p>
          </div>
        </div>

        {/* KEY FACTORS */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Key Contributing Factors
            </h3>
            <span className="text-xs text-slate-400">SHAP Explainability</span>
          </div>

          <div className="space-y-2">
            {((result.keyFactors && result.keyFactors.length > 0) ? result.keyFactors : (result.factors && result.factors.length > 0) ? result.factors : [
              { factorName: 'Blood Pressure', impactScore: 12.0, description: 'Elevated arterial pressure' },
              { factorName: 'Total Cholesterol', impactScore: 8.5, description: 'Mild lipid burden' },
              { factorName: 'Age Demographic', impactScore: 6.0, description: 'Age-appropriate vascular factor' }
            ]).map((factor: any, i: number) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {factor.factorName}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {factor.description}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  factor.impactScore > 10
                    ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    : 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                }`}>
                  +{factor.impactScore}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* WHAT THIS MEANS */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            What This Means
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {result.patientPlainSummary || result.summary || 'Your estimated risk indicates a need for proactive lifestyle tuning and routine blood pressure and lipid monitoring. These findings are preventive guides rather than a final clinical diagnosis.'}
          </p>
        </div>

        {/* NEXT STEPS */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Next Steps & Recommendations
          </h3>

          <div className="space-y-2">
            {(result.recommendations && result.recommendations.length > 0 ? result.recommendations : [
              'Maintain consistent 150 minutes of weekly aerobic exercise.',
              'Limit sodium intake to under 2,000 mg daily and adopt potassium-rich foods.',
              'Schedule a routine check-up with your primary physician to review lipid and BP panels.'
            ]).map((rec: string, i: number) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* WHAT-IF LIFESTYLE RISK SIMULATOR */}
        <RiskSimulator baselineRisk={riskScore} conditionName={currentModuleObj.name} />

        {/* ACTION BUTTONS */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => navigate('/chat')}
            className="w-full py-3.5 px-5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask AI About My Result</span>
          </button>

          <button
            onClick={() => {
              setResult(null);
              setActiveModule(null);
            }}
            className="w-full py-3 px-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>View All Assessments</span>
          </button>
        </div>

        {/* Medical Disclaimer */}
        <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center px-4 leading-normal">
          This assessment provides risk estimation and does not replace professional medical diagnosis. Always consult a licensed healthcare provider for medical decisions.
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 3: MULTI-STEP ASSESSMENT FORM (Steps 1, 2, 3)
  // -------------------------------------------------------------
  const CurrentIcon = currentModuleObj.icon;

  return (
    <div className="space-y-5 animate-in fade-in duration-200 max-w-xl mx-auto">
      
      {/* Top Wizard Navigation & Progress */}
      <div className="space-y-3">
        <button
          onClick={() => setActiveModule(null)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assessments</span>
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-2xl ${currentModuleObj.bgColor} flex items-center justify-center ${currentModuleObj.iconColor}`}>
              <CurrentIcon className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {currentModuleObj.name} Assessment
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Step {currentStep} of 3
              </p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400">
            {Math.round((currentStep / 3) * 100)}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-600 dark:bg-teal-500 transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Card Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-mobile-card space-y-4">
        
        {/* STEP 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Personal Information
              </h2>
              <p className="text-xs text-slate-400">Basic demographic and inherited factors</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Age (Years)
              </label>
              <input
                type="number"
                inputMode="numeric"
                min="18"
                max="100"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Biological Sex
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {['Male', 'Female'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSex(option)}
                    className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all active:scale-[0.98] ${
                      sex === option
                        ? 'border-teal-600 bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:border-teal-400 dark:text-teal-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Family History of Cardiometabolic Disease?
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: 'No Family History', value: false },
                  { label: 'Yes, Immediate Family', value: true }
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setFamilyHistory(opt.value)}
                    className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all active:scale-[0.98] ${
                      familyHistory === opt.value
                        ? 'border-teal-600 bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:border-teal-400 dark:text-teal-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Health Information */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Health & Biomarkers
              </h2>
              <p className="text-xs text-slate-400">Current vital signs and lab readings</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Systolic Blood Pressure
                </label>
                <span className="text-xs text-slate-400">mmHg</span>
              </div>
              <input
                type="number"
                inputMode="numeric"
                min="80"
                max="220"
                value={systolicBp}
                onChange={(e) => setSystolicBp(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Normal range: 110–120 mmHg</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Total Cholesterol
                </label>
                <span className="text-xs text-slate-400">mg/dL</span>
              </div>
              <input
                type="number"
                inputMode="numeric"
                min="100"
                max="400"
                value={cholesterol}
                onChange={(e) => setCholesterol(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Desirable: Under 200 mg/dL</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Fasting Blood Glucose
                </label>
                <span className="text-xs text-slate-400">mg/dL</span>
              </div>
              <input
                type="number"
                inputMode="numeric"
                min="60"
                max="300"
                value={glucose}
                onChange={(e) => setGlucose(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Normal: 70–99 mg/dL</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Body Mass Index (BMI)
                </label>
                <span className="text-xs text-slate-400">kg/m²</span>
              </div>
              <input
                type="number"
                step="0.1"
                inputMode="decimal"
                min="15"
                max="50"
                value={bmi}
                onChange={(e) => setBmi(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Lifestyle & Additional Information */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Lifestyle & Habits
              </h2>
              <p className="text-xs text-slate-400">Daily physical activity and exposure factors</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Smoking Status
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: 'Non-Smoker', value: false },
                  { label: 'Active Smoker', value: true }
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setSmoking(opt.value)}
                    className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all active:scale-[0.98] ${
                      smoking === opt.value
                        ? 'border-teal-600 bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:border-teal-400 dark:text-teal-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Weekly Moderate Exercise
                </label>
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400">{exerciseMins} mins/wk</span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                step="15"
                value={exerciseMins}
                onChange={(e) => setExerciseMins(Number(e.target.value))}
                className="w-full accent-teal-600 h-2 bg-slate-100 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Sedentary (0)</span>
                <span>AHA Target (150)</span>
                <span>Athletic (300)</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/50 dark:border-teal-900/40 text-xs text-teal-800 dark:text-teal-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>All clinical variables ready for assessment calculation.</span>
            </div>
          </div>
        )}

        {/* Wizard Controls at Bottom */}
        <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold active:scale-95 transition-all"
            >
              {t('back', 'Back')}
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-600/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>{t('continue', 'Continue')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCalculateRisk}
              disabled={loading}
              className="px-7 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-600/20 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              <span>{loading ? 'Analyzing your health information...' : 'Calculate Risk'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
