// Clinical Voice and Speech Engine
// Supports Native Browser Voices, Indic Script Transliteration, Unit Expansion, and Markdown Sanitization

const INDIC_MAPS: Record<string, { consonants: Record<string, string>; vowels: Record<string, string>; matras: Record<string, string>; digits?: Record<string, string> }> = {
  // Tamil
  ta: {
    consonants: {
      'க': 'ka', 'ங': 'nga', 'ச': 'sa', 'ஞ': 'nya', 'ட': 'ta', 'ண': 'na',
      'த': 'tha', 'ந': 'na', 'ப': 'pa', 'ம': 'ma', 'ய': 'ya', 'ர': 'ra',
      'ல': 'la', 'வ': 'va', 'ழ': 'zha', 'ள': 'la', 'ற': 'ra', 'ன': 'na',
      'ஜ': 'ja', 'ஷ': 'sha', 'ஸ': 'sa', 'ஹ': 'ha'
    },
    vowels: {
      'அ': 'a', 'ஆ': 'aa', 'இ': 'i', 'ஈ': 'ee', 'உ': 'u', 'ஊ': 'oo',
      'எ': 'e', 'ஏ': 'ae', 'ஐ': 'ai', 'ஒ': 'o', 'ஓ': 'oa', 'ஔ': 'au'
    },
    matras: {
      'ா': 'aa', 'ி': 'i', 'ீ': 'ee', 'ு': 'u', 'ூ': 'oo',
      'ெ': 'e', 'ே': 'ae', 'ை': 'ai', 'ொ': 'o', 'ோ': 'oa', 'ௌ': 'au',
      '்': '', 'ஃ': 'h'
    },
    digits: {
      '௦': '0', '௧': '1', '௨': '2', '௩': '3', '௪': '4', '௫': '5', '௬': '6', '௭': '7', '௮': '8', '௯': '9'
    }
  },
  // Telugu
  te: {
    consonants: {
      'క': 'ka', 'ఖ': 'kha', 'గ': 'ga', 'ఘ': 'gha', 'ఙ': 'nga',
      'చ': 'cha', 'ఛ': 'chha', 'జ': 'ja', 'ఝ': 'jha', 'ఞ': 'nya',
      'ట': 'ta', 'ఠ': 'tha', 'డ': 'da', 'ఢ': 'dha', 'ణ': 'na',
      'త': 'tha', 'థ': 'thha', 'ద': 'da', 'ధ': 'dha', 'న': 'na',
      'ప': 'pa', 'ఫ': 'pha', 'బ': 'ba', 'భ': 'bha', 'మ': 'ma',
      'య': 'ya', 'ర': 'ra', 'ల': 'la', 'వ': 'va', 'శ': 'sha',
      'ష': 'sha', 'స': 'sa', 'హ': 'ha', 'ళ': 'la', 'ఱ': 'ra'
    },
    vowels: {
      'అ': 'a', 'ఆ': 'aa', 'ఇ': 'i', 'ఈ': 'ee', 'ఉ': 'u', 'ఊ': 'oo',
      'ఋ': 'ru', 'ఎ': 'e', 'ఏ': 'ae', 'ఐ': 'ai', 'ఒ': 'o', 'ఓ': 'oa', 'ఔ': 'au'
    },
    matras: {
      'ా': 'aa', 'ి': 'i', 'ీ': 'ee', 'ు': 'u', 'ూ': 'oo',
      'ృ': 'ru', 'ె': 'e', 'ే': 'ae', 'ై': 'ai', 'ొ': 'o', 'ో': 'oa', 'ౌ': 'au',
      '్': '', 'ం': 'm', 'ః': 'ha'
    },
    digits: {
      '౦': '0', '౧': '1', '౨': '2', '౩': '3', '౪': '4', '౫': '5', '౬': '6', '౭': '7', '౮': '8', '౯': '9'
    }
  },
  // Kannada
  kn: {
    consonants: {
      'ಕ': 'ka', 'ಖ': 'kha', 'ಗ': 'ga', 'ಘ': 'gha', 'ಙ': 'nga',
      'ಚ': 'cha', 'ಛ': 'chha', 'ಜ': 'ja', 'ಝ': 'jha', 'ಞ': 'nya',
      'ಟ': 'ta', 'ಠ': 'tha', 'ಡ': 'da', 'ಢ': 'dha', 'ಣ': 'na',
      'ತ': 'tha', 'ಥ': 'thha', 'ದ': 'da', 'ಧ': 'dha', 'ನ': 'na',
      'ಪ': 'pa', 'ಫ': 'pha', 'ಬ': 'ba', 'ಭ': 'bha', 'ಮ': 'ma',
      'ಯ': 'ya', 'ರ': 'ra', 'ಲ': 'la', 'ವ': 'va', 'ಶ': 'sha',
      'ಷ': 'sha', 'ಸ': 'sa', 'ಹ': 'ha', 'ಳ': 'la', 'ಱ': 'ra'
    },
    vowels: {
      'ಅ': 'a', 'ಆ': 'aa', 'ಇ': 'i', 'ಈ': 'ee', 'ಉ': 'u', 'ಊ': 'oo',
      'ಋ': 'ru', 'ಎ': 'e', 'ಏ': 'ae', 'ಐ': 'ai', 'ಒ': 'o', 'ಓ': 'oa', 'ಔ': 'au'
    },
    matras: {
      'ಾ': 'aa', 'ಿ': 'i', 'ೀ': 'ee', 'ು': 'u', 'ೂ': 'oo',
      'ೃ': 'ru', 'ೆ': 'e', 'ೇ': 'ae', 'ೈ': 'ai', 'ೊ': 'o', 'ೋ': 'oa', 'ೌ': 'au',
      '್': '', 'ಂ': 'm', 'ಃ': 'ha'
    },
    digits: {
      '೦': '0', '೧': '1', '೨': '2', '೩': '3', '೪': '4', '೫': '5', '೬': '6', '೭': '7', '೮': '8', '೯': '9'
    }
  },
  // Hindi
  hi: {
    consonants: {
      'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'nga',
      'च': 'cha', 'छ': 'chha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'nya',
      'ट': 'ta', 'ठ': 'tha', 'ड': 'da', 'ढ': 'dha', 'ण': 'na',
      'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
      'प': 'pa', 'फ': 'fa', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
      'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va', 'श': 'sha',
      'ष': 'sha', 'स': 'sa', 'ह': 'ha', 'ड़': 'da', 'ढ़': 'dha'
    },
    vowels: {
      'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo',
      'ऋ': 'ri', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au'
    },
    matras: {
      'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo',
      'ृ': 'ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
      '्': '', 'ं': 'n', 'ँ': 'n', 'ः': 'h'
    },
    digits: {
      '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
    }
  },
  // Bengali
  bn: {
    consonants: {
      'ক': 'ka', 'খ': 'kha', 'গ': 'ga', 'ঘ': 'gha', 'ঙ': 'nga',
      'চ': 'cha', 'ছ': 'chha', 'জ': 'ja', 'ঝ': 'jha', 'ঞ': 'nya',
      'ট': 'ta', 'ঠ': 'tha', 'ড': 'da', 'ঢ': 'dha', 'ণ': 'na',
      'ত': 'tha', 'থ': 'thha', 'দ': 'da', 'ಧ': 'dha', 'ন': 'na',
      'প': 'pa', 'ফ': 'pha', 'ব': 'ba', 'ভ': 'bha', 'ম': 'ma',
      'য': 'ya', 'র': 'ra', 'ল': 'la', 'শ': 'sha', 'ষ': 'sha',
      'স': 'sa', 'হ': 'ha', 'ড়': 'da', 'ঢ়': 'dha', 'য়': 'ya'
    },
    vowels: {
      'অ': 'a', 'আ': 'aa', 'ই': 'i', 'ঈ': 'ee', 'উ': 'u', 'ঊ': 'oo',
      'ঋ': 'ri', 'এ': 'e', 'ঐ': 'ai', 'ও': 'o', 'ঔ': 'au'
    },
    matras: {
      'া': 'aa', 'ি': 'i', 'ী': 'ee', 'ু': 'u', 'ূ': 'oo',
      'ৃ': 'ri', 'ে': 'e', 'ৈ': 'ai', 'ো': 'o', 'ৌ': 'au',
      '্': '', 'ং': 'ng', 'ঃ': 'h', 'ঁ': 'n'
    },
    digits: {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    }
  }
};

let cachedVoices: SpeechSynthesisVoice[] = [];
let keepAliveTimer: any = null;

export interface VoiceSettings {
  personaId: 'dr_sarah' | 'dr_david' | 'nurse_priya' | 'custom';
  preferredVoiceName?: string;
  rate: number;
  pitch: number;
}

export interface PersonaDefinition {
  id: 'dr_sarah' | 'dr_david' | 'nurse_priya';
  name: string;
  title: string;
  role: string;
  avatar: string;
  gender: 'female' | 'male';
  description: string;
  defaultPitch: number;
  defaultRate: number;
  sampleGreeting: string;
  preferredVoiceKeywords: string[];
}

export const VOICE_PERSONAS: Record<string, PersonaDefinition> = {
  dr_sarah: {
    id: 'dr_sarah',
    name: 'Dr. Sarah',
    title: 'Consulting Physician',
    role: 'Consulting Physician',
    avatar: '🩺',
    gender: 'female',
    description: 'Warm, empathetic, and reassuring clinical bedside manner',
    defaultPitch: 1.12,
    defaultRate: 0.92,
    sampleGreeting: 'Hello, I am Dr. Sarah. I am here to provide thoughtful, compassionate guidance on your health and laboratory reports.',
    preferredVoiceKeywords: ['zira', 'jenny', 'female', 'samantha', 'victoria', 'karen', 'catherine', 'helena']
  },
  dr_david: {
    id: 'dr_david',
    name: 'Dr. David',
    title: 'Senior Internist',
    role: 'Senior Internist',
    avatar: '👨‍⚕️',
    gender: 'male',
    description: 'Authoritative, grounded, and clear evidence-based clinician',
    defaultPitch: 0.88,
    defaultRate: 0.95,
    sampleGreeting: 'Good day. I am Dr. David. Let us review your clinical metrics and formulate an evidence-based care strategy.',
    preferredVoiceKeywords: ['david', 'guy', 'male', 'daniel', 'alex', 'george', 'richard']
  },
  nurse_priya: {
    id: 'nurse_priya',
    name: 'Nurse Priya',
    title: 'Care Coordinator',
    role: 'Care Coordinator',
    avatar: '🌿',
    gender: 'female',
    description: 'Friendly, bright, and easy to understand wellness coach',
    defaultPitch: 1.22,
    defaultRate: 1.02,
    sampleGreeting: 'Hi there! I am Nurse Priya. How can I help you feel your best today?',
    preferredVoiceKeywords: ['priya', 'veena', 'kalpana', 'heera', 'zira', 'female']
  }
};

const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  personaId: 'dr_sarah',
  rate: 0.92,
  pitch: 1.12
};

export function getVoiceSettings(): VoiceSettings {
  if (typeof window === 'undefined') return DEFAULT_VOICE_SETTINGS;
  try {
    const saved = localStorage.getItem('hc_voice_settings');
    if (saved) {
      return { ...DEFAULT_VOICE_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Could not read voice settings from localStorage', e);
  }
  return DEFAULT_VOICE_SETTINGS;
}

export function saveVoiceSettings(settings: VoiceSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('hc_voice_settings', JSON.stringify(settings));
  } catch (e) {
    console.warn('Could not save voice settings to localStorage', e);
  }
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) cachedVoices = voices;
  return cachedVoices.length > 0 ? cachedVoices : voices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

/**
 * Strips markdown symbols, asterisks, bullet points, and headers so TTS speaks clean, natural sentences.
 */
export function cleanMarkdownForSpeech(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[\s*•-]+\s+/gm, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ' ')
    .trim();
}

/**
 * Transliterates Indic scripts (Tamil, Telugu, Kannada, Hindi, Bengali) into phonetic Latin text
 * so that English/Universal TTS synthesizers (like Microsoft David or Zira) speak every word,
 * symptom, and reason audibly instead of skipping non-Latin glyphs and speaking only numbers.
 */
export function transliterateIndic(text: string): string {
  const normalized = text.normalize('NFC');
  let lang = '';
  if (/[\u0B80-\u0BFF]/.test(normalized)) lang = 'ta';
  else if (/[\u0C00-\u0C7F]/.test(normalized)) lang = 'te';
  else if (/[\u0C80-\u0CFF]/.test(normalized)) lang = 'kn';
  else if (/[\u0900-\u097F]/.test(normalized)) lang = 'hi';
  else if (/[\u0980-\u09FF]/.test(normalized)) lang = 'bn';

  if (!lang || !INDIC_MAPS[lang]) return normalized;
  const map = INDIC_MAPS[lang];

  let out = '';
  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i];
    const next = normalized[i + 1];

    if (map.consonants[ch]) {
      const base = map.consonants[ch].slice(0, -1);
      if (next && map.matras[next] !== undefined) {
        out += base + map.matras[next];
        i++;
      } else {
        out += map.consonants[ch];
      }
    } else if (map.vowels[ch]) {
      out += map.vowels[ch];
    } else if (map.matras[ch]) {
      out += map.matras[ch];
    } else if (map.digits && map.digits[ch]) {
      out += map.digits[ch];
    } else {
      out += ch;
    }
  }
  return out;
}

/**
 * Expands clinical abbreviations and symbols for natural, fluent speech.
 */
export function expandMedicalUnits(text: string): string {
  return text
    .replace(/mg\/dL/gi, ' milligrams per deciliter ')
    .replace(/mmHg/gi, ' millimeters of mercury ')
    .replace(/HbA1c/gi, ' H-B-A 1-C ')
    .replace(/\bBP\b/g, ' Blood Pressure ')
    .replace(/\bLDL\b/g, ' L-D-L ')
    .replace(/\bHDL\b/g, ' H-D-L ')
    .replace(/(\d+)\/(\d+)/g, '$1 over $2')
    .replace(/≥/g, ' greater than or equal to ')
    .replace(/≤/g, ' less than or equal to ')
    .replace(/>/g, ' greater than ')
    .replace(/</g, ' less than ')
    .replace(/%/g, ' percent ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks if the browser currently has a matching voice for a given speech code or persona preference.
 */
export function findMatchingVoice(
  speechCode: string,
  preferredVoiceName?: string,
  personaId?: 'dr_sarah' | 'dr_david' | 'nurse_priya' | 'custom'
): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;
  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // 1. Explicit voice name requested (custom voice)
  if (preferredVoiceName) {
    const matched = voices.find((v) => v.name.toLowerCase() === preferredVoiceName.toLowerCase());
    if (matched) return matched;
  }

  // 2. Try persona preferred keywords (e.g. Zira for female, David for male)
  if (personaId && personaId !== 'custom' && VOICE_PERSONAS[personaId]) {
    const persona = VOICE_PERSONAS[personaId];
    for (const kw of persona.preferredVoiceKeywords) {
      const match = voices.find((v) => v.name.toLowerCase().includes(kw));
      if (match) return match;
    }
  }

  // 3. Exact language match e.g. 'ta-IN'
  const exact = voices.find((v) => v.lang.toLowerCase().replace('_', '-') === speechCode.toLowerCase());
  if (exact) return exact;

  // 4. Prefix match e.g. 'ta'
  const prefix = speechCode.split('-')[0].toLowerCase();
  const partial = voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
  if (partial) return partial;

  return null;
}

export interface SpeakOptions {
  text: string;
  speechCode: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
  rate?: number;
  pitch?: number;
  personaId?: 'dr_sarah' | 'dr_david' | 'nurse_priya' | 'custom';
  preferredVoiceName?: string;
}

/**
 * Robust clinical speech synthesizer:
 * - Employs customizable Voice Personas (Dr. Sarah, Dr. David, Nurse Priya) to prevent monotone playback.
 * - Cleans markdown syntax.
 * - If non-Latin text is sent to an English/fallback voice, transliterates to phonetic Latin so
 *   Microsoft David / Zira speaks EVERY SINGLE WORD, REASON, AND SYMPTOM instead of only numbers!
 * - Expands clinical abbreviations (mg/dL, mmHg, HbA1c, 120/80).
 * - Implements Chrome keepalive to prevent 15-second cutoff on long medical answers.
 */
export function speakClinicalText({
  text,
  speechCode,
  onStart,
  onEnd,
  onError,
  rate,
  pitch,
  personaId,
  preferredVoiceName
}: SpeakOptions): void {
  if (!('speechSynthesis' in window)) {
    alert('Speech synthesis is not supported in this browser.');
    onError?.(new Error('Speech synthesis not supported'));
    return;
  }

  // Cancel any active speech & clear timers
  stopSpeaking();

  const settings = getVoiceSettings();
  const activePersonaId = personaId || settings.personaId;
  const activeVoiceName = preferredVoiceName || settings.preferredVoiceName;

  // Derive pitch & rate from persona or custom settings
  let effectivePitch = pitch ?? settings.pitch;
  let effectiveRate = rate ?? settings.rate;

  if (activePersonaId !== 'custom' && VOICE_PERSONAS[activePersonaId]) {
    const persona = VOICE_PERSONAS[activePersonaId];
    if (pitch === undefined) effectivePitch = persona.defaultPitch;
    if (rate === undefined) effectiveRate = persona.defaultRate;
  }

  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  const nativeVoice = findMatchingVoice(speechCode, activeVoiceName, activePersonaId);

  // 1. Clean markdown
  let processed = cleanMarkdownForSpeech(text);

  // 2. Expand medical units & abbreviations
  processed = expandMedicalUnits(processed);

  // 3. Determine if voice is capable of native Indic speech
  const isIndicVoice = nativeVoice && /^(ta|te|kn|hi|bn|mr|gu|pa|ml)/i.test(nativeVoice.lang);
  const hasIndicCharacters = /[\u0900-\u0D7F]/.test(processed);

  // If no native Indic voice is available (e.g. standard Windows with only Microsoft David/Zira),
  // transliterate to phonetic Latin so every word, symptom, and reason is audibly spoken!
  if (!isIndicVoice && hasIndicCharacters) {
    processed = transliterateIndic(processed);
  }

  const utterance = new SpeechSynthesisUtterance(processed);
  utterance.rate = effectiveRate;
  utterance.pitch = effectivePitch;

  if (nativeVoice && isIndicVoice) {
    utterance.voice = nativeVoice;
    utterance.lang = speechCode;
  } else if (nativeVoice && !hasIndicCharacters) {
    utterance.voice = nativeVoice;
    utterance.lang = speechCode;
  } else {
    // English universal phonetics fallback
    utterance.lang = 'en-US';

    // Persona-aware fallback voice selection
    let fallbackVoice: SpeechSynthesisVoice | undefined;
    if (activePersonaId === 'dr_sarah' || activePersonaId === 'nurse_priya') {
      fallbackVoice = voices.find((v) => /zira|female|jenny|samantha|karen/i.test(v.name));
    } else if (activePersonaId === 'dr_david') {
      fallbackVoice = voices.find((v) => /david|male|guy|daniel|alex/i.test(v.name));
    }

    if (!fallbackVoice) {
      fallbackVoice = voices.find((v) => v.lang.toLowerCase().startsWith('en')) || voices[0];
    }
    if (fallbackVoice) utterance.voice = fallbackVoice;
  }

  // Keepalive mechanism for Chrome/Edge 15-second speech cutoff bug
  const startKeepAlive = () => {
    stopKeepAlive();
    keepAliveTimer = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);
  };

  const stopKeepAlive = () => {
    if (keepAliveTimer) {
      clearInterval(keepAliveTimer);
      keepAliveTimer = null;
    }
  };

  utterance.onstart = () => {
    startKeepAlive();
    onStart?.();
  };

  utterance.onend = () => {
    stopKeepAlive();
    onEnd?.();
  };

  utterance.onerror = (e) => {
    stopKeepAlive();
    console.warn('Speech synthesis ended/error:', e);
    onError?.(e);
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

