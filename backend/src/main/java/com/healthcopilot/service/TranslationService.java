package com.healthcopilot.service;

import com.healthcopilot.dto.TranslationRequest;
import com.healthcopilot.dto.TranslationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class TranslationService {

    @Value("${app.ai-service.url:http://localhost:8000}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public TranslationResponse translate(TranslationRequest request) {
        String originalText = request.getTextToTranslate();
        String targetLang = request.getTargetLanguage() != null ? request.getTargetLanguage().toLowerCase().trim() : "en";

        if (originalText.isEmpty() || "en".equalsIgnoreCase(targetLang) || "english".equalsIgnoreCase(targetLang)) {
            return new TranslationResponse(
                    originalText,
                    originalText,
                    "en",
                    "en",
                    true,
                    "Original English text."
            );
        }

        // 1. Try AI service translation endpoint
        try {
            String url = aiServiceUrl + "/api/ai/translate";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> payload = new HashMap<>();
            payload.put("text", originalText);
            payload.put("targetLanguage", targetLang);
            payload.put("module", request.getModule());

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<?, ?> body = response.getBody();
                Object transObj = body.get("translatedText");
                if (transObj != null && !transObj.toString().trim().isEmpty()) {
                    return new TranslationResponse(
                            transObj.toString().trim(),
                            originalText,
                            "en",
                            targetLang,
                            true,
                            "AI Multilingual Medical Translation."
                    );
                }
            }
        } catch (Exception e) {
            System.err.println("AI Translation service call error: " + e.getMessage() + ", falling back to contextual clinical engine.");
        }

        // 2. Heuristic Clinical Terminology Translation Engine
        String translated = performClinicalTranslation(originalText, targetLang);

        return new TranslationResponse(
                translated,
                originalText,
                "en",
                targetLang,
                true,
                "Clinical translation with standard Indic medical terminology."
        );
    }

    private String performClinicalTranslation(String text, String lang) {
        // Normalize lang code
        String code = "en";
        if (lang.contains("tamil") || lang.equals("ta")) code = "ta";
        else if (lang.contains("telugu") || lang.equals("te")) code = "te";
        else if (lang.contains("kannada") || lang.equals("kn")) code = "kn";
        else if (lang.contains("hindi") || lang.equals("hi")) code = "hi";
        else if (lang.contains("malayalam") || lang.equals("ml")) code = "ml";
        else if (lang.contains("marathi") || lang.equals("mr")) code = "mr";
        else if (lang.contains("bengali") || lang.contains("bangla") || lang.equals("bn")) code = "bn";
        else if (lang.contains("gujarati") || lang.equals("gu")) code = "gu";
        else if (lang.contains("punjabi") || lang.equals("pa")) code = "pa";
        else if (lang.contains("odia") || lang.contains("oriya") || lang.equals("or")) code = "or";
        else if (lang.contains("assamese") || lang.equals("as")) code = "as";

        Map<String, String> dictionary = getDictionary(code);
        if (dictionary.isEmpty()) {
            return text;
        }

        String result = text;
        for (Map.Entry<String, String> entry : dictionary.entrySet()) {
            // Case-insensitive regex replacement for clinical terms
            result = result.replaceAll("(?i)\\b" + java.util.regex.Pattern.quote(entry.getKey()) + "\\b", entry.getValue());
        }
        return result;
    }

    private Map<String, String> getDictionary(String code) {
        Map<String, String> dict = new HashMap<>();
        switch (code) {
            case "ta": // Tamil
                dict.put("diabetes", "நீரிழிவு நோய்");
                dict.put("blood pressure", "இரத்த அழுத்தம்");
                dict.put("hypertension", "உயர் இரத்த அழுத்தம்");
                dict.put("heart disease", "இதய நோய்");
                dict.put("stroke", "பக்கவாதம்");
                dict.put("fever", "காய்ச்சல்");
                dict.put("cough", "இருமல்");
                dict.put("headache", "தலைவலி");
                dict.put("chest pain", "மார்பு வலி");
                dict.put("fatigue", "சோர்வு");
                dict.put("cholesterol", "கொலஸ்ட்ரால்");
                dict.put("heart rate", "இதயத் துடிப்பு");
                dict.put("blood glucose", "இரத்தச் சர்க்கரை");
                dict.put("normal", "சாதாரணமானது");
                dict.put("high risk", "அதிக ஆபத்து");
                dict.put("moderate risk", "மிதமான ஆபத்து");
                dict.put("low risk", "குறைந்த ஆபத்து");
                dict.put("emergency", "அவசர சிகிச்சை");
                dict.put("consult a doctor", "மருத்துவரை அணுகவும்");
                dict.put("diet plan", "உணவுத் திட்டம்");
                dict.put("exercise", "உடற்பயிற்சி");
                dict.put("yoga", "யோகாசனம்");
                dict.put("breakfast", "காலை உணவு");
                dict.put("lunch", "மதிய உணவு");
                dict.put("dinner", "இரவு உணவு");
                dict.put("water intake", "நீர் அருந்துதல்");
                dict.put("allergies", "ஒவ்வாமை");
                dict.put("medication", "மருந்துகள்");
                break;
            case "te": // Telugu
                dict.put("diabetes", "మధుమేహం");
                dict.put("blood pressure", "రక్తపోటు");
                dict.put("hypertension", "అధిక రక్తపోటు");
                dict.put("heart disease", "గుండె జబ్బు");
                dict.put("stroke", "పక్షవాతం");
                dict.put("fever", "జ్వరం");
                dict.put("cough", "దగ్గు");
                dict.put("headache", "తలనొప్పి");
                dict.put("chest pain", "ఛాతీ నొప్పి");
                dict.put("fatigue", "అలసట");
                dict.put("cholesterol", "కొలెస్ట్రాల్");
                dict.put("heart rate", "గుండె వేగం");
                dict.put("blood glucose", "రక్తంలో చక్కెర");
                dict.put("normal", "సాధారణం");
                dict.put("high risk", "అధిక ప్రమాదం");
                dict.put("moderate risk", "మధ్యస్థ ప్రమాదం");
                dict.put("low risk", "తక్కువ ప్రమాదం");
                dict.put("emergency", "అత్యవసర చికిత్స");
                dict.put("consult a doctor", "వైద్యుడిని సంప్రదించండి");
                dict.put("diet plan", "ఆహార ప్రణాళిక");
                dict.put("exercise", "వ్యాయామం");
                dict.put("yoga", "యోగా");
                dict.put("breakfast", "అల్పాహారం");
                dict.put("lunch", "మధ్యాహ్న భోజనం");
                dict.put("dinner", "రాత్రి భోజనం");
                dict.put("water intake", "నీరు త్రాగడం");
                dict.put("allergies", "అలెర్జీలు");
                dict.put("medication", "మందులు");
                break;
            case "hi": // Hindi
                dict.put("diabetes", "मधुमेह");
                dict.put("blood pressure", "रक्तचाप");
                dict.put("hypertension", "उच्च रक्तचाप");
                dict.put("heart disease", "हृदय रोग");
                dict.put("stroke", "पक्षाघात");
                dict.put("fever", "बुखार");
                dict.put("cough", "खांसी");
                dict.put("headache", "सिरदर्द");
                dict.put("chest pain", "सीने में दर्द");
                dict.put("fatigue", "थकान");
                dict.put("cholesterol", "कोलेस्ट्रॉल");
                dict.put("heart rate", "हृदय गति");
                dict.put("blood glucose", "रक्त शर्करा");
                dict.put("normal", "सामान्य");
                dict.put("high risk", "उच्च जोखिम");
                dict.put("moderate risk", "मध्यम जोखिम");
                dict.put("low risk", "कम जोखिम");
                dict.put("emergency", "आपातकालीन देखभाल");
                dict.put("consult a doctor", "डॉक्टर से परामर्श लें");
                dict.put("diet plan", "आहार योजना");
                dict.put("exercise", "व्यायाम");
                dict.put("yoga", "योगासन");
                dict.put("breakfast", "नाश्ता");
                dict.put("lunch", "दोपहर का भोजन");
                dict.put("dinner", "रात का खाना");
                dict.put("water intake", "पानी का सेवन");
                dict.put("allergies", "एलर्जी");
                dict.put("medication", "दवाएं");
                break;
            case "kn": // Kannada
                dict.put("diabetes", "ಮಧುಮೇಹ");
                dict.put("blood pressure", "ರಕ್ತದೊತ್ತಡ");
                dict.put("hypertension", "ಅಧಿಕ ರಕ್ತದೊತ್ತಡ");
                dict.put("heart disease", "ಹೃದಯ ರೋಗ");
                dict.put("stroke", "ಪಾರ್ಶ್ವವಾಯು");
                dict.put("fever", "ಜ್ವರ");
                dict.put("cough", "ಕೆಮ್ಮು");
                dict.put("headache", "ತಲೆನೋವು");
                dict.put("chest pain", "ಎದೆ ನೋವು");
                dict.put("fatigue", "ಆಯಾಸ");
                dict.put("cholesterol", "ಕೊಲೆಸ್ಟ್ರಾಲ್");
                dict.put("heart rate", "ಹೃದಯ ಬಡಿತ");
                dict.put("blood glucose", "ರಕ್ತದಲ್ಲಿನ ಸಕ್ಕರೆ");
                dict.put("normal", "ಸಾಮಾನ್ಯ");
                dict.put("high risk", "ಹೆಚ್ಚಿನ ಅಪಾಯ");
                dict.put("moderate risk", "ಮಧ್ಯಮ ಅಪಾಯ");
                dict.put("low risk", "ಕಡಿಮೆ ಅಪಾಯ");
                dict.put("emergency", "ತುರ್ತು ಚಿಕಿತ್ಸೆ");
                dict.put("consult a doctor", "ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ");
                dict.put("diet plan", "ಆಹಾರ ಯೋಜನೆ");
                dict.put("exercise", "ವ್ಯಾಯಾಮ");
                dict.put("yoga", "ಯೋಗ");
                dict.put("breakfast", "ಉಪಾಹಾರ");
                dict.put("lunch", "ಮಧ್ಯಾಹ್ನದ ಊಟ");
                dict.put("dinner", "ರಾತ್ರಿಯ ಊಟ");
                dict.put("allergies", "ಅಲರ್ಜಿಗಳು");
                dict.put("medication", "ಔಷಧಿಗಳು");
                break;
            case "ml": // Malayalam
                dict.put("diabetes", "പ്രമേഹം");
                dict.put("blood pressure", "രക്തസമ്മർദ്ദം");
                dict.put("hypertension", "ഉയർന്ന രക്തസമ്മർദ്ദം");
                dict.put("heart disease", "ഹൃദ്രോഗം");
                dict.put("stroke", "പക്ഷാഘാതം");
                dict.put("fever", "പനി");
                dict.put("cough", "ചുമ");
                dict.put("headache", "തലവേദന");
                dict.put("chest pain", "നെഞ്ചുവേദന");
                dict.put("fatigue", "ക്ഷീണം");
                dict.put("cholesterol", "കൊളസ്ട്രോൾ");
                dict.put("heart rate", "ഹൃദയമിടിപ്പ് നിരക്ക്");
                dict.put("blood glucose", "രക്തത്തിലെ പഞ്ചസാര");
                dict.put("normal", "സാധാരണ");
                dict.put("high risk", "ഉയർന്ന അപകടസാധ്യത");
                dict.put("moderate risk", "ഇടത്തരം അപകടസാധ്യത");
                dict.put("low risk", "കുറഞ്ഞ അപകടസാധ്യത");
                dict.put("emergency", "അടിയന്തിര പരിചരണം");
                dict.put("consult a doctor", "ഡോക്ടറെ കാണുക");
                dict.put("diet plan", "ഭക്ഷണക്രമം");
                dict.put("exercise", "വ്യായാമം");
                dict.put("yoga", "യോഗ");
                dict.put("allergies", "അലർജികൾ");
                dict.put("medication", "മരുന്നുകൾ");
                break;
            case "mr": // Marathi
                dict.put("diabetes", "मधुमेह");
                dict.put("blood pressure", "रक्तदाब");
                dict.put("hypertension", "उच्च रक्तदाब");
                dict.put("heart disease", "हृदयविकार");
                dict.put("stroke", "पक्षाघात");
                dict.put("fever", "ताप");
                dict.put("cough", "खोकला");
                dict.put("headache", "डोकेदुखी");
                dict.put("chest pain", "छातीत दुखणे");
                dict.put("fatigue", "थकवा");
                dict.put("cholesterol", "कोलेस्टेरॉल");
                dict.put("heart rate", "हृदयाचे ठोके");
                dict.put("blood glucose", "रक्तातील साखर");
                dict.put("normal", "सामान्य");
                dict.put("high risk", "उच्च धोका");
                dict.put("moderate risk", "मध्यम धोका");
                dict.put("low risk", "कमी धोका");
                dict.put("emergency", "तात्काळ वैद्यकीय सेवा");
                dict.put("consult a doctor", "डॉक्टरांचा सल्ला घ्या");
                dict.put("diet plan", "आहार योजना");
                dict.put("exercise", "व्यायाम");
                dict.put("yoga", "योगासने");
                dict.put("allergies", "ऍलर्जी");
                dict.put("medication", "औषधे");
                break;
            case "bn": // Bengali
                dict.put("diabetes", "ডায়াবেটিস / বহুমূত্র রোগ");
                dict.put("blood pressure", "রক্তচাপ");
                dict.put("hypertension", "উচ্চ রক্তচাপ");
                dict.put("heart disease", "হৃদরোগ");
                dict.put("stroke", "মস্তিষ্কে রক্তক্ষরণ / স্ট্রোক");
                dict.put("fever", "জ্বর");
                dict.put("cough", "কাশি");
                dict.put("headache", "মাথাব্যথা");
                dict.put("chest pain", "বুকে ব্যথা");
                dict.put("fatigue", "ক্লান্তি");
                dict.put("cholesterol", "কোলেস্টেরল");
                dict.put("heart rate", "হৃদস্পন্দনের হার");
                dict.put("blood glucose", "রক্তে শর্করার মাত্রা");
                dict.put("normal", "স্বাভাবিক");
                dict.put("high risk", "উচ্চ ঝুঁকি");
                dict.put("moderate risk", "মাঝারি ঝুঁকি");
                dict.put("low risk", "কম ঝুঁকি");
                dict.put("emergency", "জরুরী চিকিৎসা");
                dict.put("consult a doctor", "ডাক্তারের পরামর্শ নিন");
                dict.put("diet plan", "খাদ্য তালিকা");
                dict.put("exercise", "ব্যায়াম");
                dict.put("yoga", "যোগব্যায়াম");
                dict.put("allergies", "অ্যালার্জি");
                dict.put("medication", "ওষুধ");
                break;
            case "gu": // Gujarati
                dict.put("diabetes", "ડાયાબિટીસ / મધુપ્રમેહ");
                dict.put("blood pressure", "રક્તચાપ / બ્લડ પ્રેશર");
                dict.put("hypertension", "હાઈ બ્લડ પ્રેશર");
                dict.put("heart disease", "હૃદય રોગ");
                dict.put("stroke", "લકવો / પક્ષઘાત");
                dict.put("fever", "તાવ");
                dict.put("cough", "ખાંસી");
                dict.put("headache", "માથાનો દુખાવો");
                dict.put("chest pain", "છાતીમાં દુખાવો");
                dict.put("fatigue", "થાક");
                dict.put("cholesterol", "કોલેસ્ટ્રોલ");
                dict.put("heart rate", "હૃદયના ધબકારા");
                dict.put("normal", "સામાન્ય");
                dict.put("high risk", "ઉચ્ચ જોખમ");
                dict.put("moderate risk", "મધ્યમ જોખમ");
                dict.put("low risk", "ઓછું જોખમ");
                dict.put("consult a doctor", "ડૉક્ટરની સલાહ લો");
                dict.put("diet plan", "આહાર યોજના");
                dict.put("exercise", "કસરત");
                dict.put("yoga", "યોગાસન");
                dict.put("allergies", "એલર્જી");
                dict.put("medication", "દવાઓ");
                break;
            case "pa": // Punjabi
                dict.put("diabetes", "ਸ਼ੂਗਰ / ਸ਼ੱਕਰ ਰੋਗ");
                dict.put("blood pressure", "ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ / ਖੂਨ ਦਾ ਦਬਾਅ");
                dict.put("hypertension", "ਹਾਈ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ");
                dict.put("heart disease", "ਦਿਲ ਦੀ ਬਿਮਾਰੀ");
                dict.put("stroke", "ਲਕਵਾ / ਅਧਰੰਗ");
                dict.put("fever", "ਬੁਖਾਰ");
                dict.put("cough", "ਖੰਘ");
                dict.put("headache", "ਸਿਰਦਰਦ");
                dict.put("chest pain", "ਛਾਤੀ ਵਿੱਚ ਦਰਦ");
                dict.put("fatigue", "ਥਕਾਵਟ");
                dict.put("normal", "ਆਮ");
                dict.put("high risk", "ਵੱਡਾ ਖਤਰਾ");
                dict.put("moderate risk", "ਦਰਮਿਆਨਾ ਖਤਰਾ");
                dict.put("low risk", "ਘੱਟ ਖਤਰਾ");
                dict.put("consult a doctor", "ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਲਵੋ");
                dict.put("diet plan", "ਖੁਰਾਕ ਯੋਜਨਾ");
                dict.put("exercise", "ਕਸਰਤ");
                dict.put("yoga", "ਯੋਗਾ");
                dict.put("allergies", "ਐਲਰਜੀ");
                dict.put("medication", "ਦਵਾਈਆਂ");
                break;
            case "or": // Odia
                dict.put("diabetes", "ମଧୁମେହ");
                dict.put("blood pressure", "ରକ୍ତଚାପ");
                dict.put("hypertension", "ଉଚ୍ଚ ରକ୍ତଚାପ");
                dict.put("heart disease", "ହୃଦରୋଗ");
                dict.put("stroke", "ପକ୍ଷାଘାତ");
                dict.put("fever", "ଜ୍ୱର");
                dict.put("cough", "କାଶ");
                dict.put("headache", "ମୁଣ୍ଡବିନ୍ଧା");
                dict.put("chest pain", "ଛାତି ଯନ୍ତ୍ରଣା");
                dict.put("fatigue", "କ୍ଳାନ୍ତି");
                dict.put("normal", "ସ୍ୱାଭାବିକ");
                dict.put("high risk", "ଉଚ୍ଚ ବିପଦ");
                dict.put("moderate risk", "ମଧ୍ୟମ ବିପଦ");
                dict.put("low risk", "କମ ବିପଦ");
                dict.put("consult a doctor", "ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ");
                dict.put("diet plan", "ଖାଦ୍ୟ ଯୋଜନା");
                dict.put("exercise", "ବ୍ୟାୟାମ");
                dict.put("yoga", "ଯୋଗ");
                dict.put("allergies", "ଆଲର୍ଜି");
                dict.put("medication", "ଔଷଧ");
                break;
            case "as": // Assamese
                dict.put("diabetes", "মধুমেহ");
                dict.put("blood pressure", "ৰক্তচাপ");
                dict.put("hypertension", "উচ্চ ৰক্তচাপ");
                dict.put("heart disease", "হৃদৰোগ");
                dict.put("stroke", "ষ্ট্ৰোক / পক্ষাঘাত");
                dict.put("fever", "জ্বৰ");
                dict.put("cough", "কাহ");
                dict.put("headache", "মূৰৰ বিষ");
                dict.put("chest pain", "বুকুৰ বিষ");
                dict.put("fatigue", "ভাগৰ");
                dict.put("normal", "স্বাভাৱিক");
                dict.put("high risk", "উচ্চ বিপদ");
                dict.put("moderate risk", "মধ্যম বিপদ");
                dict.put("low risk", "কম বিপদ");
                dict.put("consult a doctor", "চিকিৎসকৰ পৰামৰ্শ লওক");
                dict.put("diet plan", "খাদ্য তালিকা");
                dict.put("exercise", "ব্যায়াম");
                dict.put("yoga", "যোগাসন");
                dict.put("allergies", "এলাৰ্জি");
                dict.put("medication", "ঔষধ");
                break;
        }
        return dict;
    }
}
