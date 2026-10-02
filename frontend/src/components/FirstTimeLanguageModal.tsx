import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../translations';
import { Check, Sparkles, Activity, ShieldCheck } from 'lucide-react';

export default function FirstTimeLanguageModal() {
  const { isFirstTime, completeFirstTimeSelection, supportedLanguages, t } = useLanguage();
  const [selected, setSelected] = useState<LanguageCode>('en');

  if (!isFirstTime) {
    return null;
  }

  const handleContinue = () => {
    completeFirstTimeSelection(selected);
  };

  const selectedInfo = supportedLanguages.find((l) => l.code === selected) || supportedLanguages[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex flex-col justify-end sm:justify-center sm:items-center overflow-hidden animate-in fade-in duration-300">
      {/* Mobile container - Full screen sheet on mobile, rounded modal on tablet/desktop */}
      <div className="w-full sm:max-w-xl bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] border border-slate-100 dark:border-slate-800 overflow-hidden">
        
        {/* Top Header */}
        <div className="px-6 pt-6 pb-4 sm:pt-8 sm:px-8 border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-b from-teal-50/50 to-white dark:from-slate-800/40 dark:to-slate-900 shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-600 dark:bg-teal-500 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
              <Activity className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  AI Healthcare Copilot
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Clinical Decision Support & Care</p>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Which language are you comfortable with?
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Choose your preferred language for your healthcare experience.
          </p>

          {/* Current language sample pill */}
          <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/50 text-xs font-medium text-teal-800 dark:text-teal-300">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="font-semibold">{selectedInfo.nativeName}:</span>
            <span className="truncate">{selectedInfo.samplePhrase}</span>
          </div>
        </div>

        {/* Scrollable Language Options List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-2.5 flex-1 divide-y-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {supportedLanguages.map((lang) => {
              const isSelected = selected === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSelected(lang.code)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 active:scale-[0.985] min-h-[56px] ${
                    isSelected
                      ? 'border-teal-600 dark:border-teal-400 bg-teal-50/70 dark:bg-teal-950/40 ring-2 ring-teal-500/20 shadow-xs'
                      : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase shrink-0 ${
                        isSelected
                          ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {lang.scriptLabel}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                          {lang.nativeName}
                        </span>
                        {lang.code !== 'en' && (
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            {lang.name}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-teal-700 dark:text-teal-400 font-medium block truncate">
                        {lang.greeting}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'border-teal-600 dark:border-teal-400 bg-teal-600 dark:bg-teal-500 text-white'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sticky Mobile Bottom CTA with Safe Area */}
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 pb-safe-b shrink-0">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3 px-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>You can change this anytime in Settings</span>
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {selectedInfo.name}
            </span>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-bold text-base shadow-lg shadow-teal-600/20 active:scale-[0.985] transition-all flex items-center justify-center gap-2"
          >
            <span>{t('continue', 'Continue')}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
