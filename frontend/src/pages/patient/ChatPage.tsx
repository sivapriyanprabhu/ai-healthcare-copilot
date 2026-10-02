import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { chatService } from '../../services/chatService';
import { ChatConversation, ChatMessage } from '../../types';
import {
  speakClinicalText,
  stopSpeaking,
  getVoiceSettings,
  saveVoiceSettings,
  getAvailableVoices,
  VOICE_PERSONAS,
  VoiceSettings
} from '../../utils/speechUtils';
import {
  MessageSquare,
  Send,
  Plus,
  Trash2,
  Sparkles,
  AlertTriangle,
  BookOpen,
  User,
  Bot,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  Radio,
  Sliders,
  Check,
  Play,
  Settings2,
  X
} from 'lucide-react';

interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  speechCode: string;
  placeholder: string;
  newChat: string;
  disclaimerBadge: string;
  title: string;
  subtitle: string;
  historyTitle: string;
  emptyHeading: string;
  emptySub: string;
  listeningText: string;
  autoSpeakLabel: string;
  isRTL?: boolean;
  suggestedPrompts: string[];
}

const LANGUAGES: Record<string, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    speechCode: 'en-US',
    placeholder: 'Ask any health question or click the mic to speak...',
    newChat: 'New Conversation',
    disclaimerBadge: 'Friendly Health Guide',
    title: 'Health Assistant',
    subtitle: 'Helpful, simple answers in your preferred language',
    historyTitle: 'Past Conversations',
    emptyHeading: 'How can I help you today?',
    emptySub: 'Ask about understanding your test reports, how to feel better, healthy eating, or gentle daily exercises.',
    listeningText: 'Listening... Please speak your health question',
    autoSpeakLabel: 'Auto-Read Replies',
    suggestedPrompts: [
      'What does blood sugar (HbA1c) measure in simple terms?',
      'How can I naturally improve my heart health?',
      'What should I do if my blood pressure is slightly high?',
      'What are good questions to ask my doctor during my next checkup?'
    ]
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    speechCode: 'es-ES',
    placeholder: 'Escriba su consulta o use el micrófono para hablar...',
    newChat: 'Nueva Conversación',
    disclaimerBadge: 'Orientación Educativa',
    title: 'Asistente Clínico con IA',
    subtitle: 'Soporte Multilingüe y Base de Conocimientos Médicos',
    historyTitle: 'Historial de Consultas',
    emptyHeading: '¿En qué puedo orientarle hoy?',
    emptySub: 'Consulte rangos de laboratorio, manejo de síntomas, pautas de nutrición o medicamentos.',
    listeningText: 'Escuchando... Hable con claridad su consulta de salud',
    autoSpeakLabel: 'Lectura por Voz',
    suggestedPrompts: [
      '¿Qué mide la HbA1c y cuál es el rango normal?',
      '¿Cómo puedo mejorar de forma natural mi colesterol HDL?',
      '¿Qué debo hacer si mi presión arterial marca 135/85?',
      '¿Qué preguntas debo hacerle al médico sobre mi análisis?'
    ]
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    speechCode: 'fr-FR',
    placeholder: 'Posez votre question médicale ou utilisez le micro...',
    newChat: 'Nouvelle Conversation',
    disclaimerBadge: 'Support Éducatif Uniquement',
    title: 'Assistant Médical IA',
    subtitle: 'Support Clinique Multilingue et Base RAG',
    historyTitle: 'Historique des Échanges',
    emptyHeading: 'Comment puis-je vous aider aujourd’hui ?',
    emptySub: 'Interrogez sur les bilans sanguins, symptômes, alimentation ou traitements.',
    listeningText: 'À l’écoute... Posez votre question distinctement',
    autoSpeakLabel: 'Lecture Vocale',
    suggestedPrompts: [
      'Que mesure l’HbA1c et quelle est sa valeur normale ?',
      'Comment augmenter naturellement mon cholestérol HDL ?',
      'Que faire si ma tension artérielle est à 135/85 ?',
      'Quelles questions poser à mon médecin sur mon bilan ?'
    ]
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    speechCode: 'de-DE',
    placeholder: 'Geben Sie Ihre Frage ein oder nutzen Sie das Mikrofon...',
    newChat: 'Neues Gespräch',
    disclaimerBadge: 'Nur Medizinische Orientierung',
    title: 'KI-Gesundheitsassistent',
    subtitle: 'Mehrsprachige klinische Entscheidungsunterstützung',
    historyTitle: 'Verlauf',
    emptyHeading: 'Wie kann ich Ihnen heute helfen?',
    emptySub: 'Fragen Sie nach Laborwerten, Symptomeinschätzungen, Ernährung oder Medikamenten.',
    listeningText: 'Höre zu... Bitte sprechen Sie Ihre Frage ein',
    autoSpeakLabel: 'Sprachausgabe',
    suggestedPrompts: [
      'Was bedeutet der HbA1c-Wert und was ist normal?',
      'Wie kann ich mein HDL-Cholesterin natürlich verbessern?',
      'Was tun bei einem Blutdruckwert von 135/85?',
      'Welche Fragen sollte ich meinem Arzt zu Laborwerten stellen?'
    ]
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    speechCode: 'hi-IN',
    placeholder: 'अपना स्वास्थ्य प्रश्न लिखें या बोलने के लिए माइक दबाएं...',
    newChat: 'नई बातचीत',
    disclaimerBadge: 'केवल शैक्षिक मार्गदर्शन',
    title: 'एआई क्लिनिकल सहायक',
    subtitle: 'बहुभाषी चिकित्सा सहायता और स्वास्थ्य ज्ञान इंजन',
    historyTitle: 'पिछली बातचीत',
    emptyHeading: 'आज मैं आपके स्वास्थ्य में कैसे सहायता कर सकता हूँ?',
    emptySub: 'लैब रिपोर्ट, सामान्य रक्त शर्करा, रक्तचाप, आहार या दवाइयों के बारे में पूछें।',
    listeningText: 'सुन रहा हूँ... अपना प्रश्न स्पष्ट रूप से बोलें',
    autoSpeakLabel: 'आवाज से पढ़ें',
    suggestedPrompts: [
      'HbA1c क्या मापता है और इसका सामान्य स्तर क्या है?',
      'HDL कोलेस्ट्रॉल को प्राकृतिक रूप से कैसे बढ़ाएं?',
      'रक्तचाप 135/85 आने पर क्या कदम उठाने चाहिए?',
      'अपनी लैब रिपोर्ट के बारे में डॉक्टर से क्या पूछना चाहिए?'
    ]
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    speechCode: 'zh-CN',
    placeholder: '输入您的健康问题或点击麦克风语音提问...',
    newChat: '新建对话',
    disclaimerBadge: '仅供健康教育参考',
    title: 'AI 临床健康助手',
    subtitle: '多语言智能诊疗决策支持与知识库',
    historyTitle: '历史问诊',
    emptyHeading: '今天有什么健康疑问需要协助？',
    emptySub: '可咨询化验指标、血压血糖标准、症状自查及生活营养指南。',
    listeningText: '正在倾听... 请清晰陈述您的健康问题',
    autoSpeakLabel: '语音朗读',
    suggestedPrompts: [
      '糖化血红蛋白（HbA1c）正常范围是多少？',
      '如何科学提高高密度脂蛋白（HDL）？',
      '血压测量值为135/85需要注意什么？',
      '面对化验报告应该向主治医生咨询哪些问题？'
    ]
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    speechCode: 'ar-SA',
    placeholder: 'اكتب استفسارك الطبي أو اضغط الميكروفون للتحدث...',
    newChat: 'محادثة جديدة',
    disclaimerBadge: 'دعم تعليمي فقط',
    title: 'المساعد الطبي بالذكاء الاصطناعي',
    subtitle: 'دعم إكلينيكي متعدد اللغات ومحرك المعرفة الطبية',
    historyTitle: 'سجل المحادثات',
    emptyHeading: 'كيف يمكنني مساعدتك صحياً اليوم؟',
    emptySub: 'اسأل عن نتائج التحاليل المخبرية، مستويات السكر والضغط، والتغذية السليمة.',
    listeningText: 'جاري الاستماع... تفضل بطرح سؤالك الطبي',
    autoSpeakLabel: 'قراءة صوتية',
    isRTL: true,
    suggestedPrompts: [
      'ما هو معدل السكر التراكمي (HbA1c) الطبيعي؟',
      'كيف يمكن تحسين مستويات الكوليسترول الجيد HDL؟',
      'ما هي الخطوات المناسبة إذا كان ضغط الدم 135/85؟',
      'ما الأسئلة المهمة التي يجب طرحها على الطبيب؟'
    ]
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    speechCode: 'pt-BR',
    placeholder: 'Digite sua dúvida médica ou use o microfone para falar...',
    newChat: 'Nova Conversa',
    disclaimerBadge: 'Orientação Educacional',
    title: 'Assistente Clínico IA',
    subtitle: 'Suporte Clínico Multilíngue e Motor RAG',
    historyTitle: 'Histórico de Conversas',
    emptyHeading: 'Como posso ajudar sua saúde hoje?',
    emptySub: 'Consulte sobre exames laboratoriais, manejo de pressão, glicemia e dieta.',
    listeningText: 'Ouvindo... Fale sua dúvida de saúde com clareza',
    autoSpeakLabel: 'Leitura por Voz',
    suggestedPrompts: [
      'O que mede a HbA1c e qual é o valor de referência normal?',
      'Como melhorar o colesterol HDL naturalmente?',
      'O que fazer quando a pressão arterial atinge 135/85?',
      'Quais perguntas devo fazer ao médico sobre meus exames?'
    ]
  },
  bn: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇧🇩',
    speechCode: 'bn-BD',
    placeholder: 'আপনার স্বাস্থ্য সংক্রান্ত প্রশ্ন লিখুন বা মাইক চেপে বলুন...',
    newChat: 'নতুন আলোচনা',
    disclaimerBadge: 'শিক্ষামূলক পরামর্শ মাত্র',
    title: 'এআই ক্লিনিক্যাল অ্যাসিস্ট্যান্ট',
    subtitle: 'বহুভাষিক স্বাস্থ্য সহায়তা ও জ্ঞান ভাণ্ডার',
    historyTitle: 'পূর্ববর্তী ইতিহাস',
    emptyHeading: 'আজ আপনাকে কীভাবে সহায়তা করতে পারি?',
    emptySub: 'রক্তের শর্করা, রক্তচাপ, খাদ্যাভ্যাস বা ওষুধ সম্পর্কিত পরামর্শ জানুন।',
    listeningText: 'শুনছি... আপনার প্রশ্নটি স্পষ্ট করে বলুন',
    autoSpeakLabel: 'কণ্ঠস্বরে পড়ুন',
    suggestedPrompts: [
      'HbA1c কী এবং এর স্বাভাবিক মাত্রা কত?',
      'এইচডিএল কোলেস্টেরল প্রাকৃতিকভাবে কীভাবে বাড়ানো যায়?',
      'রক্তচাপ ১৩৫/৮৫ হলে কী করণীয়?',
      'ল্যাব রিপোর্ট নিয়ে ডাক্তারের কাছে কী কী প্রশ্ন করা উচিত?'
    ]
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    speechCode: 'ru-RU',
    placeholder: 'Введите медицинский вопрос или используйте микрофон...',
    newChat: 'Новый диалог',
    disclaimerBadge: 'Только для ознакомления',
    title: 'Медицинский ИИ-ассистент',
    subtitle: 'Многоязычная клиническая поддержка и база знаний RAG',
    historyTitle: 'История консультаций',
    emptyHeading: 'Чем я могу помочь вашему здоровью сегодня?',
    emptySub: 'Спросите о референсных значениях анализов, давлении, сахаре или питании.',
    listeningText: 'Слушаю... Четко произнесите ваш медицинский вопрос',
    autoSpeakLabel: 'Озвучивание ответов',
    suggestedPrompts: [
      'Что показывает анализ HbA1c и какова его норма?',
      'Как естественным путем повысить уровень ЛПВП-холестерина?',
      'Что делать, если артериальное давление составляет 135/85?',
      'Какие вопросы стоит задать врачу по результатам анализов?'
    ]
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    speechCode: 'ta-IN',
    placeholder: 'உங்கள் மருத்துவக் கேள்வியை தட்டச்சு செய்யவும் அல்லது பேச மைக் அழுத்தவும்...',
    newChat: 'புதிய உரையாடல்',
    disclaimerBadge: 'கல்வி வழிகாட்டுதல் மட்டுமே',
    title: 'AI மருத்துவ உதவியாளர்',
    subtitle: 'பலமொழி மருத்துவ முடிவெடுக்கும் ஆதரவு மற்றும் RAG அறிவுத் தளம்',
    historyTitle: 'முந்தைய உரையாடல்கள்',
    emptyHeading: 'இன்று உங்கள் ஆரோக்கியத்திற்கு எவ்வாறு உதவலாம்?',
    emptySub: 'இரத்த சர்க்கரை, இரத்த அழுத்தம், உணவு வழிகாட்டுதல் அல்லது மருந்துகள் குறித்து கேளுங்கள்.',
    listeningText: 'கேட்கிறது... உங்கள் கேள்வியை தெளிவாக பேசவும்',
    autoSpeakLabel: 'குரல் வாசிப்பு',
    suggestedPrompts: [
      'HbA1c என்றால் என்ன, அதன் இயல்பான அளவு என்ன?',
      'HDL நல்ல கொழுப்பை இயற்கையாக அதிகரிப்பது எப்படி?',
      'இரத்த அழுத்தம் 135/85 எனில் என்ன செய்ய வேண்டும்?',
      'மருத்துவரிடம் என் பரிசோதனை அறிக்கை பற்றி என்ன கேட்க வேண்டும்?'
    ]
  },
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
    speechCode: 'te-IN',
    placeholder: 'మీ వైద్య ప్రశ్నను టైప్ చేయండి లేదా మాట్లాడటానికి మైక్ క్లిక్ చేయండి...',
    newChat: 'కొత్త సంభాషణ',
    disclaimerBadge: 'విద్యా ప్రయోజనాల కోసం మాత్రమే',
    title: 'AI క్లినికల్ అసిస్టెంట్',
    subtitle: 'బహుభాషా ఆరోగ్య సంరక్షణ మరియు RAG జ్ఞాన కేంద్రం',
    historyTitle: 'గత సంభాషణలు',
    emptyHeading: 'ఈరోజు మీ ఆరోగ్యానికి నేను ఎలా సహాయపడగలను?',
    emptySub: 'రక్తంలో చక్కెర, రక్తపోటు, ఆహార నియమాలు లేదా మందుల వివరాల గురించి అడగండి.',
    listeningText: 'వింటున్నాము... మీ ప్రశ్నను స్పష్టంగా మాట్లాడండి',
    autoSpeakLabel: 'వాయిస్ రీడౌట్',
    suggestedPrompts: [
      'HbA1c అంటే ఏమిటి మరియు సాధారణ పరిధి ఎంత?',
      'HDL కొలెస్ట్రాల్‌ను సహజంగా ఎలా పెంచుకోవాలి?',
      'రక్తపోటు 135/85 ఉంటే ఏం చేయాలి?',
      'ల్యాబ్ రిపోర్ట్ గురించి వైద్యుడిని ఏ ప్రశ్నలు అడగాలి?'
    ]
  },
  kn: {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    flag: '🇮🇳',
    speechCode: 'kn-IN',
    placeholder: 'ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿರಿ...',
    newChat: 'ಹೊಸ ಸಂಭಾಷಣೆ',
    disclaimerBadge: 'ಶೈಕ್ಷಣಿಕ ಮಾರ್ಗದರ್ಶನ ಮಾತ್ರ',
    title: 'AI ಕ್ಲಿನಿಕಲ್ ಸಹಾಯಕ',
    subtitle: 'ಬಹುಭಾಷಾ ಆರೋಗ್ಯ ನೆರವು ಮತ್ತು ವೈದ್ಯಕೀಯ ಜ್ಞಾನ ವ್ಯವಸ್ಥೆ',
    historyTitle: 'ಹಿಂದಿನ ಇತಿಹಾಸ',
    emptyHeading: 'ಇಂದು ನಿಮ್ಮ ಆರೋಗ್ಯಕ್ಕೆ ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?',
    emptySub: 'ರಕ್ತದ ಸಕ್ಕರೆ, ರಕ್ತದೊತ್ತಡ, ಆಹಾರ ಪದ್ಧತಿ ಅಥವಾ ಔಷಧಿಗಳ ಬಗ್ಗೆ ಕೇಳಿ.',
    listeningText: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇವೆ... ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಹೇಳಿ',
    autoSpeakLabel: 'ಧ್ವನಿ ವಾಚನ',
    suggestedPrompts: [
      'HbA1c ಅಂದರೆ ಏನು ಮತ್ತು ಅದರ ಸಾಮಾನ್ಯ ಪ್ರಮಾಣ ಎಷ್ಟು?',
      'HDL ಕೊಲೆಸ್ಟ್ರಾಲ್ ಅನ್ನು ನೈಸರ್ಗಿಕವಾಗಿ ಹೆಚ್ಚಿಸುವುದು ಹೇಗೆ?',
      'ರಕ್ತದೊತ್ತಡ 135/85 ಇದ್ದರೆ ಏನು ಮಾಡಬೇಕು?',
      'ವೈದ್ಯರನ್ನು ಲ್ಯಾಬ್ ವರದಿ ಬಗ್ಗೆ ಏನೆಂದು ಕೇಳಬೇಕು?'
    ]
  },
  ml: {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    flag: '🇮🇳',
    speechCode: 'ml-IN',
    placeholder: 'നിങ്ങളുടെ ആരോഗ്യ ചോദ്യം ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ സംസാരിക്കാൻ മൈക്ക് ക്ലിക്ക് ചെയ്യുക...',
    newChat: 'പുതിയ സംഭാഷണം',
    disclaimerBadge: 'വിവരങ്ങൾക്കായി മാത്രം',
    title: 'AI ആരോഗ്യ സഹായി',
    subtitle: 'മലയാളത്തിൽ ആരോഗ്യ സംശയങ്ങൾക്ക് ലളിതമായ മറുപടി',
    historyTitle: 'കഴിഞ്ഞ സംഭാഷണങ്ങൾ',
    emptyHeading: 'ഇന്ന് നിങ്ങളുടെ ആരോഗ്യത്തിന് ഞാൻ എങ്ങനെ സഹായിക്കണം?',
    emptySub: 'രക്തത്തിലെ പഞ്ചസാര, രക്തസമ്മർദ്ദം, ഭക്ഷണക്രമം, അല്ലെങ്കിൽ മരുന്നുകളെക്കുറിച്ച് ചോദിക്കാം.',
    listeningText: 'കേൾക്കുന്നു... നിങ്ങളുടെ ചോദ്യം വ്യക്തമായി പറയുക',
    autoSpeakLabel: 'ശബ്ദ വായന',
    suggestedPrompts: [
      'HbA1c എന്നാൽ എന്താണ്, സാധാരണ അളവ് എത്ര?',
      'HDL നല്ല കൊളസ്ട്രോൾ എങ്ങനെ വർദ്ധിപ്പിക്കാം?',
      'രക്തസമ്മർദ്ദം 135/85 ആണെങ്കിൽ എന്തുചെയ്യണം?',
      'മെഡിക്കൽ റിപ്പോർട്ടിനെക്കുറിച്ച് ഡോക്ടറോട് എന്താണ് ചോദിക്കേണ്ടത്?'
    ]
  },
  mr: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '🇮🇳',
    speechCode: 'mr-IN',
    placeholder: 'तुमचा आरोग्यविषयक प्रश्न टाईप करा किंवा बोलण्यासाठी माईकवर क्लिक करा...',
    newChat: 'नवीन संभाषण',
    disclaimerBadge: 'केवळ माहितीसाठी',
    title: 'AI आरोग्य सहाय्यक',
    subtitle: 'मराठीत सोप्या भाषेत वैद्यकीय मार्गदर्शन',
    historyTitle: 'मागील संभाषणे',
    emptyHeading: 'आज मी तुम्हाला कशी मदत करू शकतो?',
    emptySub: 'रक्तातील साखर, रक्तदाब, आहार किंवा औषधांबद्दल प्रश्न विचारा.',
    listeningText: 'ऐकत आहे... तुमचा प्रश्न स्पष्टपणे बोला',
    autoSpeakLabel: 'आवाज वाचन',
    suggestedPrompts: [
      'HbA1c म्हणजे काय आणि त्याची सामान्य पातळी काय आहे?',
      'चांगले कोलेस्टेरॉल नैसर्गिकरित्या कसे वाढवावे?',
      'रक्तदाब 135/85 असल्यास काय करावे?',
      'लॅब रिपोर्टबद्दल डॉक्टरांना काय विचारावे?'
    ]
  },
  gu: {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    flag: '🇮🇳',
    speechCode: 'gu-IN',
    placeholder: 'તમારો પ્રશ્ન લખો અથવા બોલવા માટે માઇક પર ક્લિક કરો...',
    newChat: 'નવી વાતચીત',
    disclaimerBadge: 'માર્ગદર્શન માટે',
    title: 'AI આરોગ્ય સહાયક',
    subtitle: 'ગુજરાતીમાં વિશ્વસનીય આરોગ્ય માહિતી',
    historyTitle: 'અગાઉની વાતચીત',
    emptyHeading: 'આજે હું તમને કેવી રીતે મદદ કરી શકું?',
    emptySub: 'બ્લડ સુગર, બ્લડ પ્રેશર, આહાર અથવા દવાઓ વિશે પૂછો.',
    listeningText: 'સાંભળી રહ્યા છીએ... તમારો પ્રશ્ન બોલો',
    autoSpeakLabel: 'અવાજ વાંચન',
    suggestedPrompts: [
      'HbA1c શું છે અને સામાન્ય મર્યાદા કેટલી હોય?',
      'HDL કોલેસ્ટ્રોલ કુદરતી રીતે કેવી રીતે વધારવું?',
      'જો બ્લડ પ્રેશર 135/85 હોય તો શું કરવું?',
      'રિપોર્ટ વિશે ડૉક્ટરને શું પૂછવું?'
    ]
  },
  pa: {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    flag: '🇮🇳',
    speechCode: 'pa-IN',
    placeholder: 'ਆਪਣਾ ਸਿਹਤ ਸਵਾਲ ਲਿਖੋ ਜਾਂ ਬੋਲਣ ਲਈ ਮਾਈਕ ਤੇ ਕਲਿੱਕ ਕਰੋ...',
    newChat: 'ਨਵੀਂ ਗੱਲਬਾਤ',
    disclaimerBadge: 'ਜਾਣਕਾਰੀ ਲਈ',
    title: 'AI ਸਿਹਤ ਸਹਾਇਕ',
    subtitle: 'ਪੰਜਾਬੀ ਵਿੱਚ ਸਰਲ ਡਾਕਟਰੀ ਮਾਰਗਦਰਸ਼ਨ',
    historyTitle: 'ਪਿਛਲੀਆਂ ਗੱਲਾਂ',
    emptyHeading: 'ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਸਿਹਤ ਲਈ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
    emptySub: 'ਸ਼ੂਗਰ, ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ, ਖੁਰਾਕ ਜਾਂ ਦਵਾਈਆਂ ਬਾਰੇ ਪੁੱਛੋ।',
    listeningText: 'ਸੁਣ ਰਹੇ ਹਾਂ... ਆਪਣਾ ਸਵਾਲ ਬੋਲੋ',
    autoSpeakLabel: 'ਆਵਾਜ਼ ਪੜ੍ਹਨਾ',
    suggestedPrompts: [
      'HbA1c ਕੀ ਹੈ ਅਤੇ ਆਮ ਸੀਮਾ ਕਿੰਨੀ ਹੈ?',
      'ਚੰਗਾ ਕੋਲੈਸਟ੍ਰੋਲ ਕਿਵੇਂ ਵਧਾਇਆ ਜਾਵੇ?',
      'ਜੇ ਬੀਪੀ 135/85 ਹੋਵੇ ਤਾਂ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?',
      'ਲੈਬ ਰਿਪੋਰਟ ਬਾਰੇ ਡਾਕਟਰ ਨੂੰ ਕੀ ਪੁੱਛੀਏ?'
    ]
  },
  or: {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    flag: '🇮🇳',
    speechCode: 'or-IN',
    placeholder: 'ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରଶ୍ନ ଲେଖନ୍ତୁ କିମ୍ବା କହିବା ପାଇଁ ମାଇକ ଦବାନ୍ତୁ...',
    newChat: 'ନୂତନ କଥାବାର୍ତ୍ତା',
    disclaimerBadge: 'ସୂଚନା ପାଇଁ',
    title: 'AI ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ',
    subtitle: 'ଓଡ଼ିଆରେ ସରଳ ସ୍ୱାସ୍ଥ୍ୟ ପରାମର୍ଶ',
    historyTitle: 'ପୂର୍ବ କଥାବାର୍ତ୍ତା',
    emptyHeading: 'ଆଜି ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ପାଇଁ ମୁଁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?',
    emptySub: 'ରକ୍ତ ଶର୍କରା, ରକ୍ତଚାପ, ଖାଦ୍ୟପେୟ କିମ୍ବା ଔଷଧ ବିଷୟରେ ପଚାରନ୍ତୁ।',
    listeningText: 'ଶୁଣୁଛୁ... ଆପଣଙ୍କ ପ୍ରଶ୍ନ କୁହନ୍ତୁ',
    autoSpeakLabel: 'ସ୍ୱର ପଠନ',
    suggestedPrompts: [
      'HbA1c କଣ ଏବଂ ସ୍ୱାଭାବିକ ମାତ୍ରା କେତେ?',
      'ଭଲ କୋଲେଷ୍ଟ୍ରଲ କିପରି ବଢ଼ାଇବେ?',
      'ଯଦି ରକ୍ତଚାପ 135/85 ଥାଏ ତେବେ କଣ କରିବେ?',
      'ଲ୍ୟାବ ରିପୋର୍ଟ ବିଷୟରେ ଡାକ୍ତରଙ୍କୁ କଣ ପଚାରିବେ?'
    ]
  }
};

export default function ChatPage() {
  const { language, setLanguage, t } = useLanguage();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedLang, setSelectedLang] = useState<string>(language || 'en');

  useEffect(() => {
    if (language && selectedLang !== language) {
      setSelectedLang(language);
    }
  }, [language]);

  // Voice Input (Speech-to-Text)
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Voice Output (Text-to-Speech) & Persona Studio
  const [speakingMsgId, setSpeakingMsgId] = useState<number | string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(getVoiceSettings());
  const [showVoiceStudio, setShowVoiceStudio] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [previewingPersona, setPreviewingPersona] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentLang = LANGUAGES[selectedLang] || LANGUAGES.en;

  useEffect(() => {
    fetchConversations();

    const updateVoices = () => {
      const v = getAvailableVoices();
      setAvailableVoices(v);
    };
    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await chatService.getConversations();
      setConversations(data);
      if (data.length > 0) {
        selectConversation(data[0]);
      }
    } catch (err) {
      console.error('Failed to load chat history', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshConversations = async (targetConvId?: number) => {
    try {
      const data = await chatService.getConversations();
      setConversations(data);
      if (targetConvId) {
        const found = data.find((c) => c.id === targetConvId);
        if (found) setActiveConversation(found);
      } else if (!activeConversation && data.length > 0) {
        setActiveConversation(data[0]);
      }
    } catch (err) {
      console.error('Failed to refresh conversations', err);
    }
  };

  const selectConversation = async (conv: ChatConversation) => {
    try {
      const fullConv = await chatService.getConversationById(conv.id);
      setActiveConversation(fullConv);
      setMessages(fullConv.messages || []);
    } catch (err) {
      setActiveConversation(conv);
      setMessages(conv.messages || []);
    }
  };

  const startNewChat = () => {
    setActiveConversation(null);
    setMessages([]);
  };

  // Text-to-Speech Playback with Voice Persona
  const toggleSpeak = (text: string, msgId: number | string) => {
    if (speakingMsgId === msgId) {
      stopSpeaking();
      setSpeakingMsgId(null);
      return;
    }

    setSpeakingMsgId(msgId);
    speakClinicalText({
      text,
      speechCode: currentLang.speechCode,
      personaId: voiceSettings.personaId,
      preferredVoiceName: voiceSettings.preferredVoiceName,
      rate: voiceSettings.rate,
      pitch: voiceSettings.pitch,
      onStart: () => setSpeakingMsgId(msgId),
      onEnd: () => setSpeakingMsgId(null),
      onError: () => setSpeakingMsgId(null)
    });
  };

  const handleSelectPersona = (id: 'dr_sarah' | 'dr_david' | 'nurse_priya' | 'custom') => {
    const updated: VoiceSettings = { ...voiceSettings, personaId: id };
    if (id !== 'custom' && VOICE_PERSONAS[id]) {
      updated.pitch = VOICE_PERSONAS[id].defaultPitch;
      updated.rate = VOICE_PERSONAS[id].defaultRate;
    }
    setVoiceSettings(updated);
    saveVoiceSettings(updated);
  };

  const handlePreviewPersona = (personaId: 'dr_sarah' | 'dr_david' | 'nurse_priya' | 'custom') => {
    stopSpeaking();
    setPreviewingPersona(personaId);

    const greeting = personaId !== 'custom' && VOICE_PERSONAS[personaId]
      ? VOICE_PERSONAS[personaId].sampleGreeting
      : "Hello! This is a preview of your personalized clinical voice assistant settings.";

    speakClinicalText({
      text: greeting,
      speechCode: currentLang.speechCode,
      personaId,
      preferredVoiceName: voiceSettings.preferredVoiceName,
      rate: voiceSettings.rate,
      pitch: voiceSettings.pitch,
      onStart: () => setPreviewingPersona(personaId),
      onEnd: () => setPreviewingPersona(null),
      onError: () => setPreviewingPersona(null)
    });
  };

  // Speech-to-Text Recognition
  const toggleSpeechRecognition = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or a Chromium-based browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = currentLang.speechCode;
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join('');
        setInputMessage(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition status:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition', err);
      setIsListening(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, customMsg?: string) => {
    if (e) e.preventDefault();
    const text = customMsg || inputMessage;
    if (!text.trim() || sending) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userTempMsg: ChatMessage = {
      sender: 'USER',
      content: text,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userTempMsg]);
    setInputMessage('');
    setSending(true);

    try {
      const aiReply = await chatService.sendMessage(text, activeConversation?.id, selectedLang);
      setMessages((prev) => [...prev, aiReply]);
      await refreshConversations(activeConversation?.id);

      // Auto-read reply if enabled
      if (autoSpeak && aiReply.content) {
        toggleSpeak(aiReply.content, aiReply.id || 'newest');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const isAuthErr = err?.response?.status === 401 || err?.response?.status === 403;
      const errorMsg: ChatMessage = {
        sender: 'AI',
        content: isAuthErr
          ? 'Your session has expired. Please sign out and sign back in to continue consulting the AI Healthcare Copilot.'
          : 'I apologize, I encountered an issue retrieving an AI response. Please ensure backend services are connected.',
        createdAt: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteConversation = async (id: number) => {
    if (!window.confirm('Delete this conversation thread?')) return;
    try {
      await chatService.deleteConversation(id);
      setConversations(conversations.filter((c) => c.id !== id));
      if (activeConversation?.id === id) {
        startNewChat();
      }
    } catch (err) {
      console.error('Failed to delete conversation', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6" dir={currentLang.isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar Threads List */}
      <div className="w-full md:w-72 bg-white rounded-3xl border border-slate-200/80 p-4 flex flex-col shrink-0 shadow-xs">
        <button
          onClick={startNewChat}
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-2xl shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 text-sm transition-all mb-4"
        >
          <Plus className="w-4 h-4" /> {currentLang.newChat}
        </button>

        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">{currentLang.historyTitle}</div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {conversations.length === 0 ? (
            <p className="text-xs text-slate-400 px-3 py-4 text-center">No past conversations</p>
          ) : (
            conversations.map((conv) => {
              const isActive = activeConversation?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => selectConversation(conv)}
                  className={`group flex items-center justify-between p-3 rounded-2xl text-xs font-medium cursor-pointer transition-all ${
                    isActive
                      ? 'bg-sky-50 text-sky-800 border border-sky-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span className="truncate">{conv.title}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-mobile-card flex flex-col overflow-hidden h-[calc(100vh-10rem)] md:h-[calc(100vh-7rem)]">
        {/* Chat Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 dark:bg-teal-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-md shadow-teal-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-tight">
                  AI Healthcare Assistant
                </h2>
                <span className="text-xs">{currentLang.flag}</span>
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Available
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language Picker Dropdown */}
            <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-xs">
              <Languages className="w-3.5 h-3.5 text-sky-600 mr-1.5 shrink-0" />
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-2"
              >
                {Object.values(LANGUAGES).map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Auto-Speech Toggle */}
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              title={currentLang.autoSpeakLabel}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                autoSpeak
                  ? 'bg-sky-50 text-sky-700 border-sky-300 shadow-xs'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {autoSpeak ? <Volume2 className="w-3.5 h-3.5 text-sky-600 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline text-[11px]">{currentLang.autoSpeakLabel}</span>
            </button>

            {/* Voice Studio & Persona Button */}
            <button
              onClick={() => setShowVoiceStudio(true)}
              title="Voice Settings & Clinical Personas"
              className="px-2.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all hover:border-sky-300"
            >
              <Sliders className="w-3.5 h-3.5 text-sky-600" />
              <span className="text-[11px] font-bold">
                {voiceSettings.personaId === 'custom'
                  ? 'Custom Voice'
                  : `${VOICE_PERSONAS[voiceSettings.personaId]?.avatar} ${VOICE_PERSONAS[voiceSettings.personaId]?.name}`}
              </span>
            </button>

            {/* Educational Disclaimer Badge */}
            <div className="text-[11px] bg-amber-50 text-amber-800 px-3 py-1.5 rounded-xl border border-amber-200 font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="hidden sm:inline">{currentLang.disclaimerBadge}</span>
            </div>
          </div>
        </div>

        {/* Listening Status Banner */}
        {isListening && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-2.5 flex items-center justify-between text-rose-700 text-xs font-medium animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
              <Radio className="w-4 h-4 text-rose-600" />
              <span>{currentLang.listeningText} ({currentLang.flag} {currentLang.name})</span>
            </div>
            <button
              onClick={toggleSpeechRecognition}
              className="text-[11px] bg-rose-600 text-white px-3 py-1 rounded-lg font-bold hover:bg-rose-700"
            >
              Done Speaking
            </button>
          </div>
        )}

        {/* Chat Message Window */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-12">
              <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-3xl flex items-center justify-center mb-4 border border-sky-100">
                <Bot className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{currentLang.emptyHeading}</h3>
              <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">{currentLang.emptySub}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-6 w-full text-left">
                {currentLang.suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(undefined, prompt)}
                    className="p-3 bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-sky-200 rounded-2xl text-xs text-slate-700 hover:text-sky-800 transition-all font-medium text-left"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isUser = msg.sender === 'USER';
              const isSpeaking = speakingMsgId === (msg.id || idx);

              return (
                <div key={idx} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className="w-8 h-8 bg-sky-500 text-white rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-md shadow-sky-500/20">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-2xl rounded-3xl p-5 text-sm leading-relaxed relative group ${
                      isUser
                        ? 'bg-sky-600 text-white rounded-tr-none shadow-md shadow-sky-600/10'
                        : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60'
                    }`}
                  >
                    <div className="whitespace-pre-line font-normal">{msg.content}</div>

                    {!isUser && (
                      <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-[10px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1 shrink-0 shadow-2xs">
                            <span>{VOICE_PERSONAS[voiceSettings.personaId]?.avatar || '🎙️'}</span>
                            <span>{VOICE_PERSONAS[voiceSettings.personaId]?.name || 'Clinical Voice'}</span>
                          </span>
                          {msg.citations ? (
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate">
                              <BookOpen className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              <span className="truncate">Ref: {msg.citations}</span>
                            </div>
                          ) : null}
                        </div>

                        {/* Voice Output Speaker Button */}
                        <button
                          onClick={() => toggleSpeak(msg.content, msg.id || idx)}
                          title={isSpeaking ? 'Stop speaking' : `Read aloud with ${VOICE_PERSONAS[voiceSettings.personaId]?.name || 'Assistant'}`}
                          className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs font-semibold shrink-0 ${
                            isSpeaking
                              ? 'bg-sky-100 text-sky-700 animate-pulse'
                              : 'text-slate-400 hover:text-sky-600 hover:bg-white/60'
                          }`}
                        >
                          {isSpeaking ? (
                            <>
                              <VolumeX className="w-4 h-4 text-sky-600" />
                              <span className="text-[10px]">Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-4 h-4" />
                              <span className="text-[10px] hidden group-hover:inline">Listen</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 bg-slate-800 text-white rounded-xl flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {sending && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 bg-sky-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-sky-500/20 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 rounded-3xl rounded-tl-none px-5 py-3.5 border border-slate-200/60 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-xs text-slate-500 font-medium ml-1">AI Copilot is analyzing clinical guidelines...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions Horizontal Chips */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto no-scrollbar bg-slate-50/70 dark:bg-slate-900/60 shrink-0">
          {[
            "Explain my risk",
            "What does my report mean?",
            "What is hypertension?",
            "What should I discuss with my doctor?"
          ].map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(undefined, prompt)}
              className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-teal-500 hover:text-teal-700 dark:hover:text-teal-400 whitespace-nowrap active:scale-95 transition-all shadow-2xs shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Mobile Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2.5 shrink-0">
          {/* Speech-to-Text Microphone Button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            title={isListening ? 'Stop listening' : `Voice input in ${currentLang.name}`}
            className={`p-3 rounded-2xl transition-all flex items-center justify-center shrink-0 shadow-xs ${
              isListening
                ? 'bg-rose-600 text-white shadow-rose-600/30 ring-4 ring-rose-200 dark:ring-rose-900/50 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={currentLang.placeholder || "Ask something about your health..."}
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400"
          />

          <button
            type="submit"
            disabled={sending || !inputMessage.trim()}
            className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white p-3 rounded-2xl shadow-md shadow-teal-600/20 transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Voice Studio Modal */}
      {showVoiceStudio && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-sky-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Settings2 className="w-5 h-5" />
                <div>
                  <h3 className="font-bold text-base">Clinical Voice Assistant Studio</h3>
                  <p className="text-xs text-teal-100">Personalize your AI Doctor voice profile, pace, and pitch</p>
                </div>
              </div>
              <button
                onClick={() => {
                  stopSpeaking();
                  setShowVoiceStudio(false);
                }}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Persona Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                  Choose Clinical Persona
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['dr_sarah', 'dr_david', 'nurse_priya'] as const).map((key) => {
                    const p = VOICE_PERSONAS[key];
                    if (!p) return null;
                    const isSelected = voiceSettings.personaId === key;
                    const isPreviewing = previewingPersona === key;

                    return (
                      <div
                        key={key}
                        onClick={() => handleSelectPersona(key)}
                        className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between text-left ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/40 shadow-md shadow-teal-600/10'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/80'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs">
                            <Check className="w-3 h-3" />
                          </span>
                        )}

                        <div>
                          <div className="text-2xl mb-1">{p.avatar}</div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm">{p.name}</div>
                          <div className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 mt-0.5">{p.role}</div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-tight">
                            {p.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewPersona(key);
                          }}
                          className={`mt-3 py-1.5 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                            isPreviewing
                              ? 'bg-rose-100 text-rose-700 animate-pulse'
                              : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {isPreviewing ? <VolumeX className="w-3.5 h-3.5 text-rose-600" /> : <Play className="w-3.5 h-3.5" />}
                          <span>{isPreviewing ? 'Playing...' : 'Preview'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Fine Tuning Controls */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Acoustic Modulation
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSelectPersona('custom')}
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                      voiceSettings.personaId === 'custom'
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    Custom Mode
                  </button>
                </div>

                {/* Voice Browser Engine Selector */}
                {availableVoices.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Installed Browser Voice Engine
                    </label>
                    <select
                      value={voiceSettings.preferredVoiceName || ''}
                      onChange={(e) => {
                        const updated: VoiceSettings = {
                          ...voiceSettings,
                          preferredVoiceName: e.target.value || undefined
                        };
                        setVoiceSettings(updated);
                        saveVoiceSettings(updated);
                      }}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Auto-matched to Persona & Language ({currentLang.name})</option>
                      {availableVoices.map((v, i) => (
                        <option key={i} value={v.name}>
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Pitch Slider */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <span>Pitch (Vocal Depth / Tone)</span>
                    <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">{voiceSettings.pitch.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.6"
                    max="1.5"
                    step="0.05"
                    value={voiceSettings.pitch}
                    onChange={(e) => {
                      const updated: VoiceSettings = {
                        ...voiceSettings,
                        pitch: parseFloat(e.target.value)
                      };
                      setVoiceSettings(updated);
                      saveVoiceSettings(updated);
                    }}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>Deeper (Male / Grounded)</span>
                    <span>Standard</span>
                    <span>Higher (Female / Uplifting)</span>
                  </div>
                </div>

                {/* Speed / Rate Slider */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <span>Speed (Speaking Pace)</span>
                    <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">{voiceSettings.rate.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.7"
                    max="1.4"
                    step="0.05"
                    value={voiceSettings.rate}
                    onChange={(e) => {
                      const updated: VoiceSettings = {
                        ...voiceSettings,
                        rate: parseFloat(e.target.value)
                      };
                      setVoiceSettings(updated);
                      saveVoiceSettings(updated);
                    }}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>Deliberate & Calm</span>
                    <span>Normal Pace</span>
                    <span>Brisk & Energetic</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handlePreviewPersona(voiceSettings.personaId)}
                className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-2xs"
              >
                <Play className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                Test Current Voice
              </button>

              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setShowVoiceStudio(false);
                }}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition-all"
              >
                Apply & Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
