import en from './en.json';
import ta from './ta.json';
import te from './te.json';
import kn from './kn.json';
import hi from './hi.json';
import ml from './ml.json';
import mr from './mr.json';
import bn from './bn.json';
import gu from './gu.json';
import pa from './pa.json';
import or from './or.json';

export type LanguageCode =
  | 'en'
  | 'ta'
  | 'te'
  | 'kn'
  | 'hi'
  | 'ml'
  | 'mr'
  | 'bn'
  | 'gu'
  | 'pa'
  | 'or';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  scriptLabel: string;
  greeting: string;
  samplePhrase: string;
  speechCode: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    scriptLabel: 'EN',
    greeting: 'Welcome',
    samplePhrase: 'Healthcare simplified in plain words',
    speechCode: 'en-US'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    scriptLabel: 'தமி',
    greeting: 'வணக்கம்',
    samplePhrase: 'உங்கள் நல்வாழ்வுக்கான எளிய துணை',
    speechCode: 'ta-IN'
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    scriptLabel: 'తెలు',
    greeting: 'నమస్కారం',
    samplePhrase: 'మీ ఆరోగ్య సంరక్షణకు సులభమైన సహచరుడు',
    speechCode: 'te-IN'
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    scriptLabel: 'ಕನ್ನ',
    greeting: 'ನಮಸ್ಕಾರ',
    samplePhrase: 'ನಿಮ್ಮ ಆರೋಗ್ಯ ರಕ್ಷಣೆಗೆ ಸರಳ ಒಡನಾಡಿ',
    speechCode: 'kn-IN'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    scriptLabel: 'हिन्',
    greeting: 'नमस्ते',
    samplePhrase: 'आपकी स्वास्थ्य सुरक्षा का सरल साथी',
    speechCode: 'hi-IN'
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    scriptLabel: 'മല',
    greeting: 'നമസ്കാരം',
    samplePhrase: 'നിങ്ങളുടെ ആരോഗ്യ സംരക്ഷണ സഹായി',
    speechCode: 'ml-IN'
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    scriptLabel: 'मरा',
    greeting: 'नमस्कार',
    samplePhrase: 'तुमच्या निरोगी आरोग्याचा सोबती',
    speechCode: 'mr-IN'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    scriptLabel: 'বাং',
    greeting: 'নমস্কার',
    samplePhrase: 'আপনার সুস্বাস্থ্যের বিশ্বস্ত সহায়ক',
    speechCode: 'bn-IN'
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    scriptLabel: 'ગુજ',
    greeting: 'નમસ્તે',
    samplePhrase: 'તમારા ઉત્તમ સ્વાસ્થ્યનો સાચો સાથી',
    speechCode: 'gu-IN'
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    scriptLabel: 'ਪੰਜ',
    greeting: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ',
    samplePhrase: 'ਤੁਹਾਡੀ ਸਿਹਤ ਸੰਭਾਲ ਦਾ ਸਰਲ ਸਾਥੀ',
    speechCode: 'pa-IN'
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    scriptLabel: 'ଓଡ଼ି',
    greeting: 'ନମସ୍କାର',
    samplePhrase: 'ଆପଣଙ୍କ ଉତ୍ତମ ସ୍ୱାସ୍ଥ୍ୟର ବିଶ୍ୱସ୍ତ ସାଥୀ',
    speechCode: 'or-IN'
  }
];

export const translations: Record<LanguageCode, Record<string, string>> = {
  en,
  ta,
  te,
  kn,
  hi,
  ml,
  mr,
  bn,
  gu,
  pa,
  or
};

export const getTranslation = (lang: string, key: string, fallback?: string): string => {
  const code = (lang || 'en').toLowerCase().trim() as LanguageCode;
  const langDict = translations[code] || translations.en;
  if (langDict && langDict[key]) {
    return langDict[key];
  }
  if (translations.en && translations.en[key]) {
    return translations.en[key];
  }
  return fallback || key;
};
