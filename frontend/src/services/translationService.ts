import api from './api';

export interface TranslationRequest {
  text?: string;
  englishText?: string;
  targetLanguage: string;
  module?: string;
}

export interface TranslationResponse {
  translatedText: string;
  originalText: string;
  sourceLanguage: string;
  targetLanguage: string;
  success: boolean;
  disclaimer?: string;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  scriptLabel: string;
  speechCode: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', scriptLabel: 'EN', speechCode: 'en-US' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', scriptLabel: 'தமி', speechCode: 'ta-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', scriptLabel: 'తెలు', speechCode: 'te-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', scriptLabel: 'ಕನ್ನ', speechCode: 'kn-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', scriptLabel: 'हिन्', speechCode: 'hi-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', scriptLabel: 'മല', speechCode: 'ml-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', scriptLabel: 'मरा', speechCode: 'mr-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', scriptLabel: 'বাং', speechCode: 'bn-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', scriptLabel: 'ગુજ', speechCode: 'gu-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', scriptLabel: 'ਪੰਜ', speechCode: 'pa-IN' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', scriptLabel: 'ଓଡ଼ି', speechCode: 'or-IN' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', scriptLabel: 'অস', speechCode: 'as-IN' },
];

export const translationService = {
  async translate(text: string, targetLanguage: string, moduleName?: string): Promise<string> {
    if (!text || !text.trim() || targetLanguage === 'en') {
      return text;
    }

    try {
      const response = await api.post<TranslationResponse>('/translate', {
        text,
        targetLanguage,
        module: moduleName || 'general',
      });

      if (response.data && response.data.translatedText) {
        return response.data.translatedText;
      }
    } catch (err) {
      console.warn('API translation request failed, using local dictionary:', err);
    }

    return text;
  }
};
