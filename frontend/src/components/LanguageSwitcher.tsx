import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { LanguageCode } from '../translations';

interface LanguageSwitcherProps {
  compact?: boolean;
  dropUp?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export default function LanguageSwitcher({
  compact = false,
  dropUp = false,
  fullWidth = false,
  className = ''
}: LanguageSwitcherProps) {
  const { language, setLanguage, supportedLanguages, currentLangInfo, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setOpen(false);
  };

  return (
    <div className={`relative ${fullWidth ? 'w-full' : 'inline-block'} text-left`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between gap-2 rounded-xl border border-slate-200/90 dark:border-slate-700/90 bg-white/90 dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/70 text-slate-800 dark:text-slate-100 transition-all shadow-xs active:scale-[0.99] ${
          fullWidth ? 'w-full px-3 py-2 text-xs font-semibold' : compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-xs font-semibold'
        } ${className}`}
        aria-label="Change language"
      >
        <div className="flex items-center gap-2 truncate">
          <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <span className="font-bold text-slate-800 dark:text-white truncate">{currentLangInfo.nativeName}</span>
          {currentLangInfo.code !== 'en' && !compact && (
            <span className="text-[10px] text-slate-400 dark:text-slate-400 font-normal truncate">({currentLangInfo.name})</span>
          )}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-400 shrink-0 transition-transform duration-200 ${open ? (dropUp ? '' : 'rotate-180') : (dropUp ? 'rotate-180' : '')}`} />
      </button>

      {open && (
        <div
          className={`absolute ${dropUp ? 'bottom-full mb-2' : 'top-full mt-2'} ${fullWidth ? 'left-0 right-0 w-full' : 'right-0 w-64'} bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-700/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl`}
        >
          <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t('change_language', 'Change Language')}
            </span>
            <span className="text-[10px] bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 font-semibold px-2 py-0.5 rounded-full border border-teal-200/60 dark:border-teal-800">
              11 Languages
            </span>
          </div>

          <div className="max-h-56 sm:max-h-64 overflow-y-auto py-1 divide-y divide-slate-100/60 dark:divide-slate-800/60">
            {supportedLanguages.map((lang) => {
              const active = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs transition-colors ${
                    active
                      ? 'bg-teal-50 dark:bg-teal-950/80 text-teal-900 dark:text-teal-200 font-bold border-l-2 border-teal-600 dark:border-teal-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase text-center shrink-0">
                      {lang.scriptLabel}
                    </span>
                    <div className="truncate">
                      <span className="block text-slate-800 dark:text-slate-100 truncate">{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-normal truncate">{lang.name}</span>
                    </div>
                  </div>
                  {active && <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
