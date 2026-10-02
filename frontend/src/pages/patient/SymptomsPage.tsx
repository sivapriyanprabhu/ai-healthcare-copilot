import React, { useState, useEffect } from 'react';
import { symptomService, SymptomAnalysisResponse } from '../../services/symptomService';
import { Stethoscope, AlertTriangle, CheckCircle, ShieldAlert, ArrowRight, Activity, Info, Clock, AlertCircle, Volume2, VolumeX } from 'lucide-react';
import { speakClinicalText, stopSpeaking } from '../../utils/speechUtils';
import { useLanguage } from '../../context/LanguageContext';

export default function SymptomsPage() {
  const { t, tSymptom, tSeverity, tRisk, speechCode } = useLanguage();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [durationDays, setDurationDays] = useState(3);
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SymptomAnalysisResponse | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    if (!result) return;

    const speechScript = `
      ${t('symptom_triage_title', 'Clinical Triage Assessment')}.
      ${t('triage_urgency_level', 'Recommended Triage Level')}: ${result.urgencyLevel.replace('_', ' ')}.
      ${t('recommended_specialist', 'Recommended Specialist')}: ${result.suggestedSpecialist}.
      ${result.possibleExplanations.join('. ')}.
      ${t('warning_signs', 'Warning signs')}: ${result.warningSigns.join('. ')}.
      ${result.recommendedNextSteps ? result.recommendedNextSteps.join('. ') : ''}.
    `;

    setIsSpeaking(true);
    speakClinicalText({
      text: speechScript,
      speechCode: speechCode || 'en-US',
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  const commonSymptoms = [
    'Chest Pain', 'Shortness of Breath', 'Dizziness', 'Headache',
    'Fever', 'Fatigue', 'Cough', 'Nausea / Vomiting',
    'Abdominal Pain', 'Joint Pain', 'Palpitations', 'Sore Throat'
  ];

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) return;

    try {
      setLoading(true);
      const res = await symptomService.analyzeSymptoms({
        symptoms: selectedSymptoms,
        durationDays,
        severity
      });
      setResult(res);
    } catch (err) {
      console.error('Failed to analyze symptoms', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white p-8 rounded-3xl shadow-xl border border-slate-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-semibold mb-3 border border-teal-500/30">
            <Stethoscope className="w-3.5 h-3.5" /> {t('symptom_triage_title', 'Clinical Triage & Risk Stratification')}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{t('interactive_symptom_eval', 'Interactive Symptom Evaluator')}</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl leading-relaxed">
            {t('symptom_eval_desc', 'Select symptoms, duration, and severity to receive immediate clinical triage guidance, red-flag warning signs, and appropriate care level advice.')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              {t('select_symptoms', 'Select Symptoms')}
            </label>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <button
                    type="button"
                    key={sym}
                    onClick={() => toggleSymptom(sym)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {tSymptom(sym)}
                  </button>
                );
              })}
            </div>

            {/* Custom Symptom Input */}
            <div className="flex items-center gap-2 mt-4">
              <input
                type="text"
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                placeholder={t('custom_symptom_placeholder', 'Type additional symptom...')}
                className="flex-1 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-teal-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={addCustomSymptom}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                {t('add_symptom', 'Add')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {t('symptom_duration', 'Duration (Days)')}
              </label>
              <input
                type="number"
                min={1}
                max={90}
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {t('severity_level', 'Severity Level')}
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-500"
              >
                <option value="Mild">{t('severity_mild', 'Mild')}</option>
                <option value="Moderate">{t('severity_moderate', 'Moderate')}</option>
                <option value="Severe">{t('severity_severe', 'Severe')}</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || selectedSymptoms.length === 0}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 text-sm"
          >
            {loading ? t('loading', 'Evaluating Symptoms...') : t('analyze_symptoms', 'Analyze Symptoms')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Results View */}
        <div className="space-y-6">
          {result ? (
            <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              {/* Urgency Badge Header */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                result.urgencyLevel === 'EMERGENCY_CARE'
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'
                  : result.urgencyLevel === 'PROMPT_CARE'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
              }`}>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                    {t('triage_urgency_level', 'Recommended Triage Level')}
                  </span>
                  <h3 className="text-lg font-black">{tRisk(result.urgencyLevel)}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleSpeak}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs shadow-xs transition-all ${
                      isSpeaking
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-white/90 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                    title={isSpeaking ? 'Stop speaking' : 'Read aloud the triage assessment'}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
                    <span>{isSpeaking ? t('stop_listening', 'Stop Audio') : t('listen_assessment', 'Listen to Guidance')}</span>
                  </button>

                  <div className="p-3 bg-white/90 dark:bg-slate-800 rounded-xl font-bold text-xs shadow-xs text-slate-800 dark:text-slate-200">
                    {result.suggestedSpecialist}
                  </div>
                </div>
              </div>

              {/* Possible Explanations */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">
                  {t('possible_conditions', 'Possible Explanatory Categories')}
                </h4>
                <ul className="space-y-2">
                  {result.possibleExplanations.map((exp, idx) => (
                    <li key={idx} className="p-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl text-xs text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5"></span>
                      <span>{exp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Warning Signs */}
              <div>
                <h4 className="font-bold text-rose-600 dark:text-rose-400 text-sm mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> {t('warning_signs', 'Red-Flag Warning Symptoms')}
                </h4>
                <ul className="space-y-1.5">
                  {result.warningSigns.map((warn, idx) => (
                    <li key={idx} className="p-2.5 bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-900/60 rounded-xl text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                      <span>{warn}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="p-3.5 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed border border-slate-200 dark:border-slate-700">
                {result.disclaimer}
              </div>
            </div>
          ) : (
            <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center text-slate-400 space-y-3">
              <Activity className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
              <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">{t('select_symptoms', 'Select symptoms to run evaluation')}</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
                {t('symptom_eval_desc', 'Triage responses categorize symptoms according to evidence-based urgency levels.')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
