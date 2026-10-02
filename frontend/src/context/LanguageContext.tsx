import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LanguageCode,
  LanguageInfo,
  SUPPORTED_LANGUAGES,
  translations,
  getTranslation
} from '../translations';
import { patientService } from '../services/patientService';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  isFirstTime: boolean;
  completeFirstTimeSelection: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  tRisk: (level?: string) => string;
  tCondition: (condition?: string) => string;
  tSymptom: (symptom?: string) => string;
  tSeverity: (severity?: string) => string;
  speechCode: string;
  currentLangInfo: LanguageInfo;
  supportedLanguages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('preferredLanguage');
      if (saved && (saved in translations)) {
        return saved as LanguageCode;
      }
    } catch (e) {
      console.warn('Could not read preferredLanguage from localStorage', e);
    }
    return 'en';
  });

  const [isFirstTime, setIsFirstTime] = useState<boolean>(() => {
    try {
      const hasChosen = localStorage.getItem('hasSelectedLanguage');
      return hasChosen !== 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    // If patient is logged in, optionally read or sync language with profile
    const token = localStorage.getItem('token');
    if (token) {
      patientService.getProfile().then((profile) => {
        if (profile && (profile as any).preferredLanguage) {
          const profLang = (profile as any).preferredLanguage.toLowerCase().slice(0, 2);
          if (profLang in translations) {
            setLanguageState(profLang as LanguageCode);
            localStorage.setItem('preferredLanguage', profLang);
            localStorage.setItem('hasSelectedLanguage', 'true');
            setIsFirstTime(false);
          }
        }
      }).catch(() => {
        // Guest or offline mode
      });
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('preferredLanguage', lang);
      localStorage.setItem('hasSelectedLanguage', 'true');
    } catch (e) {
      console.warn('Could not save preferredLanguage', e);
    }

    // Also sync to backend profile if logged in
    const token = localStorage.getItem('token');
    if (token) {
      patientService.getProfile().then((profile) => {
        if (profile) {
          patientService.updateProfile({
            ...profile,
            preferredLanguage: lang
          } as any).catch(() => {});
        }
      }).catch(() => {});
    }
  };

  const completeFirstTimeSelection = (lang: LanguageCode) => {
    setLanguage(lang);
    setIsFirstTime(false);
  };

  const t = (key: string, fallback?: string): string => {
    return getTranslation(language, key, fallback);
  };

  const tRisk = (level?: string): string => {
    if (!level) return t('normal');
    const norm = level.toLowerCase().trim();
    if (norm.includes('low')) return t('low_risk');
    if (norm.includes('mod')) return t('moderate_risk');
    if (norm.includes('crit')) return t('critical_risk');
    if (norm.includes('high')) return t('high_risk');
    if (norm.includes('norm')) return t('normal');
    if (norm.includes('elev')) return t('elevated');
    if (norm.includes('abnorm')) return t('abnormal');
    return level;
  };

  const tCondition = (condition?: string): string => {
    if (!condition) return '';
    const cond = condition.toLowerCase().trim();
    if (cond.includes('heart') || cond.includes('coronary') || cond.includes('ascvd')) {
      return t('heart_disease');
    }
    if (cond.includes('diabet') || cond.includes('glucose')) {
      return t('diabetes');
    }
    if (cond.includes('hyper') || cond.includes('bp') || cond.includes('arterial')) {
      return t('hypertension');
    }
    if (cond.includes('stroke') || cond.includes('cerebro')) {
      return t('stroke');
    }
    if (cond.includes('compreh') || cond.includes('index')) {
      return t('comprehensive_risk');
    }
    return condition;
  };

  const tSymptom = (sym?: string): string => {
    if (!sym) return '';
    const norm = sym.toLowerCase().trim();
    if (norm.includes('chest')) return t('symptom_chest_pain', 'Chest Pain');
    if (norm.includes('breath') || norm.includes('shortness')) return t('symptom_shortness_breath', 'Shortness of Breath');
    if (norm.includes('dizz')) return t('symptom_dizziness', 'Dizziness');
    if (norm.includes('head') || norm.includes('migraine')) return t('symptom_headache', 'Headache');
    if (norm.includes('fever') || norm.includes('temp')) return t('symptom_fever', 'Fever');
    if (norm.includes('fatigue') || norm.includes('tired')) return t('symptom_fatigue', 'Fatigue');
    if (norm.includes('cough')) return t('symptom_cough', 'Cough');
    if (norm.includes('nausea') || norm.includes('vomit')) return t('symptom_nausea', 'Nausea / Vomiting');
    if (norm.includes('abdom') || norm.includes('stomach')) return t('symptom_abdominal_pain', 'Abdominal Pain');
    if (norm.includes('joint')) return t('symptom_joint_pain', 'Joint Pain');
    if (norm.includes('palpitat') || norm.includes('flutter')) return t('symptom_palpitations', 'Palpitations');
    if (norm.includes('throat')) return t('symptom_sore_throat', 'Sore Throat');
    return sym;
  };

  const tSeverity = (sev?: string): string => {
    if (!sev) return '';
    const s = sev.toLowerCase().trim();
    if (s.includes('mild')) return t('severity_mild', 'Mild');
    if (s.includes('mod')) return t('severity_moderate', 'Moderate');
    if (s.includes('sev')) return t('severity_severe', 'Severe');
    return sev;
  };

  const currentLangInfo =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isFirstTime,
        completeFirstTimeSelection,
        t,
        tRisk,
        tCondition,
        tSymptom,
        tSeverity,
        speechCode: currentLangInfo.speechCode || 'en-US',
        currentLangInfo,
        supportedLanguages: SUPPORTED_LANGUAGES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
