package com.healthcopilot.service;

import com.healthcopilot.dto.ChatConversationDTO;
import com.healthcopilot.dto.ChatMessageDTO;
import com.healthcopilot.dto.ChatRequest;
import com.healthcopilot.entity.ChatConversation;
import com.healthcopilot.entity.ChatMessage;
import com.healthcopilot.entity.Patient;
import com.healthcopilot.entity.User;
import com.healthcopilot.repository.ChatConversationRepository;
import com.healthcopilot.repository.ChatMessageRepository;
import com.healthcopilot.repository.PatientRepository;
import com.healthcopilot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ChatConversationRepository conversationRepository;

    @Autowired
    private ChatMessageRepository messageRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${app.ai-service.url:http://localhost:8000}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<ChatConversationDTO> getPatientConversations(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        Patient patient = patientRepository.findByUser(user)
                .orElseGet(() -> patientRepository.save(Patient.builder().user(user).build()));

        return conversationRepository.findByPatientOrderByUpdatedAtDesc(patient).stream()
                .map(this::mapConversationToDTO)
                .collect(Collectors.toList());
    }

    public ChatConversationDTO getConversationById(String email, Long conversationId) {
        ChatConversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found: " + conversationId));
        return mapConversationToDTO(conversation);
    }

    @Transactional
    public ChatMessageDTO sendMessage(String email, ChatRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        Patient patient = patientRepository.findByUser(user)
                .orElseGet(() -> patientRepository.save(Patient.builder().user(user).build()));

        ChatConversation conversation;
        if (request.getConversationId() != null) {
            conversation = conversationRepository.findById(request.getConversationId())
                    .orElseThrow(() -> new RuntimeException("Conversation not found: " + request.getConversationId()));
        } else {
            String title = request.getMessage().length() > 40
                    ? request.getMessage().substring(0, 37) + "..."
                    : request.getMessage();
            conversation = conversationRepository.save(ChatConversation.builder()
                    .patient(patient)
                    .title(title)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build());
        }

        // Save User Message
        ChatMessage userMsg = ChatMessage.builder()
                .conversation(conversation)
                .sender("USER")
                .content(request.getMessage())
                .createdAt(LocalDateTime.now())
                .build();
        messageRepository.save(userMsg);

        // Call AI Service FastAPI
        Map<String, Object> aiResponse = callAiChatService(request.getMessage(), request.getLanguage());
        String replyText = (String) aiResponse.getOrDefault("reply", "Thank you for your question. Maintaining consistent lab monitoring and balanced nutrition is recommended.");
        List<String> citationsList = (List<String>) aiResponse.get("citations");
        String citationsStr = citationsList != null && !citationsList.isEmpty() ? String.join(", ", citationsList) : "AHA / ADA Guidelines";

        // Save AI Response Message
        ChatMessage aiMsg = ChatMessage.builder()
                .conversation(conversation)
                .sender("AI")
                .content(replyText)
                .citations(citationsStr)
                .createdAt(LocalDateTime.now())
                .build();
        ChatMessage savedAiMsg = messageRepository.save(aiMsg);

        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        return mapMessageToDTO(savedAiMsg);
    }

    @Transactional
    public void deleteConversation(String email, Long conversationId) {
        ChatConversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found: " + conversationId));
        conversationRepository.delete(conversation);
    }

    private Map<String, Object> callAiChatService(String userMessage, String language) {
        try {
            String url = aiServiceUrl + "/api/ai/chat";
            Map<String, String> reqBody = new HashMap<>();
            reqBody.put("message", userMessage);
            if (language != null && !language.isBlank()) {
                reqBody.put("language", language);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(reqBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("AI Chat Service call failed, using fallback engine: " + e.getMessage());
        }

        Map<String, Object> fallback = new HashMap<>();
        String msgLower = (userMessage != null) ? userMessage.toLowerCase() : "";
        String normLang = normalizeLanguageCode(language, userMessage);
        String fallbackReply = generateFallbackReply(msgLower, normLang);

        fallback.put("reply", fallbackReply);
        fallback.put("citations", List.of("ICMR / WHO / National Health Guidelines"));
        return fallback;
    }

    private String normalizeLanguageCode(String language, String message) {
        if (language != null) {
            String l = language.trim().toLowerCase();
            if (l.startsWith("ta") || l.contains("tamil") || l.contains("தமிழ்")) return "ta";
            if (l.startsWith("te") || l.contains("telugu") || l.contains("తెలుగు")) return "te";
            if (l.startsWith("kn") || l.contains("kannada") || l.contains("ಕನ್ನಡ")) return "kn";
            if (l.startsWith("hi") || l.contains("hindi") || l.contains("हिन्दी")) return "hi";
            if (l.startsWith("ml") || l.contains("malayalam") || l.contains("മലയാളം")) return "ml";
            if (l.startsWith("mr") || l.contains("marathi") || l.contains("मराठी")) return "mr";
            if (l.startsWith("bn") || l.contains("bengali") || l.contains("বাংলা")) return "bn";
            if (l.startsWith("gu") || l.contains("gujarati") || l.contains("ગુજરાતી")) return "gu";
            if (l.startsWith("pa") || l.contains("punjabi") || l.contains("ਪੰਜਾਬੀ")) return "pa";
            if (l.startsWith("or") || l.contains("odia") || l.contains("ଓଡ଼ିଆ")) return "or";
        }
        if (message != null) {
            for (char c : message.toCharArray()) {
                if (c >= '\u0B80' && c <= '\u0BFF') return "ta";
                if (c >= '\u0C00' && c <= '\u0C7F') return "te";
                if (c >= '\u0C80' && c <= '\u0CFF') return "kn";
                if (c >= '\u0D00' && c <= '\u0D7F') return "ml";
                if (c >= '\u0980' && c <= '\u09FF') return "bn";
                if (c >= '\u0A80' && c <= '\u0AFF') return "gu";
                if (c >= '\u0A00' && c <= '\u0A7F') return "pa";
                if (c >= '\u0B00' && c <= '\u0B7F') return "or";
                if (c >= '\u0900' && c <= '\u097F') return "hi";
            }
        }
        return "en";
    }

    private String generateFallbackReply(String msg, String lang) {
        boolean isChest = msg.contains("chest") || msg.contains("heart") || msg.contains("நெஞ்சு") || msg.contains("மார்பு") ||
                msg.contains("గుండె") || msg.contains("ఛాతీ") || msg.contains("ಎದೆ") || msg.contains("हृदय") || msg.contains("छाती");

        boolean isHeadacheOrFever = msg.contains("headache") || msg.contains("fever") || msg.contains("pain") ||
                msg.contains("தலைவலி") || msg.contains("காய்ச்சல்") || msg.contains("सिरदर्द") || msg.contains("बुखार") ||
                msg.contains("జ్వరం") || msg.contains("నొప్పి") || msg.contains("ಜ್ವರ") || msg.contains("ತಲೆನೋವು");

        boolean isBp = msg.contains("pressure") || msg.contains("bp") || msg.contains("hypertension") ||
                msg.contains("இரத்த அழுத்தம்") || msg.contains("రక్తపోటు") || msg.contains("ರಕ್ತದೊತ್ತಡ") || msg.contains("रक्तचाप");

        boolean isDiabetes = msg.contains("sugar") || msg.contains("glucose") || msg.contains("diabetes") ||
                msg.contains("சர்க்கரை") || msg.contains("நீரிழிவு") || msg.contains("మధుమేహం") || msg.contains("ಮಧುಮೇಹ") || msg.contains("शुगर");

        switch (lang) {
            case "ta":
                if (isChest) return "அவசர மருத்துவ வழிகாட்டுதல்: மார்பு வலி, அழுத்தம் அல்லது படபடப்பு ஏற்பட்டால் உடனடியாக அவசர மருத்துவ உதவியை நாடுங்கள். சுயமாக மருத்துவம் செய்யாதீர்கள்.";
                if (isHeadacheOrFever) return "மருத்துவ ஆலோசனை: உங்களுக்கு தலைவலி அல்லது காய்ச்சல் இருந்தால், போதுமான தண்ணீர் குடித்து ஓய்வெடுக்கவும். மன அழுத்தம், தூக்கமின்மை அல்லது இரத்த அழுத்தம் காரணமாகவும் தலைவலி வரலாம். வலி 2 நாட்களுக்கு மேல் நீடித்தால் மருத்துவரை அணுகவும்.";
                if (isBp) return "இரத்த அழுத்த வழிகாட்டுதல்: சீரான இரத்த அழுத்தம் 120/80 mmHg ஆகும். உணவில் உப்பைக் குறைத்து, வழக்கமான உடற்பயிற்சி செய்து, உங்கள் இரத்த அழுத்தத்தை தொடர்ந்து கண்காணியுங்கள்.";
                if (isDiabetes) return "நீரிழிவு வழிகாட்டுதல்: இரத்தத்தில் சர்க்கரை அளவைக் கட்டுப்படுத்த நார்ச்சத்துள்ள உணவுகளை உண்ணவும், இனிப்பு மற்றும் மைதாவைத் தவிர்க்கவும். உங்கள் HbA1c அளவை பரிசோதிக்கவும்.";
                return "வணக்கம்! நான் உங்கள் AI சுகாதார உதவியாளர். உங்கள் உடல்நலம், உணவுக் கட்டுப்பாடு, இரத்த அழுத்தம் அல்லது ஆய்வக அறிக்கைகள் குறித்து ஏதேனும் கேள்விகள் இருந்தால் கேளுங்கள்.";

            case "te":
                if (isChest) return "అత్యవసర ఆరోగ్య మార్గదర్శనం: ఛాతీ నొప్పి, అసౌకర్యం లేదా గుండెల్లో ఒత్తిడి ఉంటే వెంటనే అత్యవసర వైద్య సహాయం పొందండి. ఆలస్యం చేయవద్దు.";
                if (isHeadacheOrFever) return "వైద్య సలహా: తలనొప్పి లేదా జ్వరం ఉంటే తగినంత విశ్రాంతి తీసుకోండి, పుష్కలంగా నీరు త్రాగండి. సమస్య కొనసాగితే లేదా తీవ్రమైతే వైద్యుడిని సంప్రదించండి.";
                if (isBp) return "రక్తపోటు మార్గదర్శనం: ఆరోగ్యకరమైన రక్తపోటు 120/80 mmHg. ఉప్పు తగ్గించండి, సమతుల్య ఆహారం తీసుకోండి మరియు రోజూ నడవండి.";
                if (isDiabetes) return "మధుమేహ సలహా: రక్తంలో చక్కెర స్థాయిలను అదుపులో ఉంచుకోవడానికి ఆహార నియమాలు పాటించండి మరియు క్రమం తప్పకుండా వ్యాయామం చేయండి.";
                return "నమస్కారం! నేను మీ AI ఆరోగ్య సహాయకుడిని. మీ ఆరోగ్యం, ఆహారం లేదా వైద్య పరీక్షల గురించి మీ ప్రశ్నలు అడగండి.";

            case "kn":
                if (isChest) return "ತುರ್ತು ವೈದ್ಯಕೀಯ ಮಾರ್ಗದರ್ಶನ: ಎದೆ ನೋವು ಅಥವಾ ಉಸಿರಾಟದ ತೊಂದರೆ ಕಂಡುಬಂದರೆ ತಕ್ಷಣವೇ ವೈದ್ಯಕೀಯ ಸಹಾಯ ಪಡೆದುಕೊಳ್ಳಿ.";
                if (isHeadacheOrFever) return "ವೈದ್ಯಕೀಯ ಸಲಹೆ: ತಲೆನೋವು ಅಥವಾ ಜ್ವರವಿದ್ದರೆ ಚೆನ್ನಾಗಿ ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ ಮತ್ತು ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ. ನೋವು ಮುಂದುವರಿದರೆ ತಜ್ಞ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ.";
                if (isBp) return "ರಕ್ತದೊತ್ತಡ ಮಾರ್ಗದರ್ಶನ: ಸಾಮಾನ್ಯ ರಕ್ತದೊತ್ತಡ 120/80 mmHg. ಉಪ್ಪನ್ನು ಕಡಿಮೆ ಮಾಡಿ, ಪ್ರತಿದಿನ ಲಘು ವ್ಯಾಯಾಮ ಮಾಡಿ ಮತ್ತು ಬಿಪಿ ಪರೀಕ್ಷಿಸಿಕೊಳ್ಳಿ.";
                if (isDiabetes) return "ಮಧುಮೇಹ ಮಾಹಿತಿ: ಸಕ್ಕರೆ ಮಟ್ಟ ನಿಯಂತ್ರಣದಲ್ಲಿಡಲು ಸಮತೋಲಿತ ಆಹಾರ ಮತ್ತು ನಿಯಮಿತ ನಡಿಗೆ ಮುಖ್ಯವಾಗಿದೆ.";
                return "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಆರೋಗ್ಯ ಸಹಾಯಕ. ನಿಮ್ಮ ಆರೋಗ್ಯ, ಆಹಾರ ಅಥವಾ ತಪಾಸಣೆಗಳ ಕುರಿತು ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಬಹುದು.";

            case "hi":
                if (isChest) return "आपातकालीन चिकित्सा सलाह: यदि आपको सीने में तेज दर्द, भारीपन या बेचैनी महसूस हो तो तुरंत नजदीकी आपातकालीन केंद्र से संपर्क करें।";
                if (isHeadacheOrFever) return "चिकित्सा सलाह: सिरदर्द या बुखार होने पर पर्याप्त आराम करें और पानी/तरल पदार्थ भरपूर मात्रा में लें। यदि लक्षण बने रहें तो डॉक्टर से परामर्श लें।";
                if (isBp) return "रक्तचाप मार्गदर्शन: सामान्य रक्तचाप 120/80 mmHg होता है। भोजन में नमक सीमित करें और नियमित रूप से व्यायाम व जांच करें।";
                if (isDiabetes) return "मधुमेह सलाह: ब्लड शुगर नियंत्रित रखने के लिए फाइबर युक्त संतुलित भोजन लें और मीठी चीजों से बचें। नियमित वॉक करें।";
                return "नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूँ। स्वास्थ्य, आहार या रिपोर्ट के बारे में कोई भी प्रश्न बेझिझक पूछें।";

            case "ml":
                if (isChest) return "അടിയന്തര വൈദ്യോപദേശം: നെഞ്ചുവേദനയോ അസ്വസ്ഥതയോ ഉണ്ടായാൽ ഉടനടി വൈദ്യസഹായം തേടുക. കാലതാമസം വരുത്തരുത്.";
                if (isHeadacheOrFever) return "ആരോഗ്യ നിർദ്ദേശം: തലവേദനയോ പനിയോ ഉണ്ടെങ്കിൽ ആവശ്യത്തിന് വിശ്രമിക്കുകയും ധാരാളം വെള്ളം കുടിക്കുകയും ചെയ്യുക.";
                if (isBp) return "രക്തസമ്മർദ്ദ വിവരങ്ങൾ: സാധാരണ രക്തസമ്മർദ്ദം 120/80 mmHg ആണ്. ഉപ്പിന്റെ അളവ് കുറയ്ക്കുകയും വ്യായാമം ചെയ്യുകയും ചെയ്യുക.";
                return "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ AI ആരോഗ്യ സഹായിയാണ്. നിങ്ങളുടെ ആരോഗ്യത്തെക്കുറിച്ചുള്ള സംശയങ്ങൾ ചോദിക്കാം.";

            case "mr":
                if (isChest) return "तातडीचा वैद्यकीय सल्ला: छातीत दुखणे किंवा अस्वस्थता जाणवल्यास तात्काळ डॉक्टरांशी संपर्क साधा.";
                if (isHeadacheOrFever) return "आरोग्य सल्ला: डोकेदुखी किंवा ताप असल्यास विश्रांती घ्या आणि भरपूर पाणी प्या. त्रास वाढल्यास डॉक्टरांचा सल्ला घ्या.";
                return "नमस्कार! मी तुमचा AI आरोग्य सहाय्यक आहे. आपल्या आरोग्याबद्दलचे कोणतेही प्रश्न विचारा.";

            case "bn":
                if (isChest) return "জরুরি চিকিৎসা পরামর্শ: বুকে ব্যথা বা অস্বস্তি হলে অবিলম্বে চিকিৎসকের সাহায্য নিন।";
                if (isHeadacheOrFever) return "চিকিৎসা পরামর্শ: মাথাব্যথা বা জ্বর থাকলে পর্যাপ্ত বিশ্রাম নিন এবং প্রচুর জল পান করুন।";
                return "নমস্কার! আমি আপনার AI স্বাস্থ্য সহকারী। আপনার স্বাস্থ্য সম্পর্কিত যে কোনো প্রশ্ন জিজ্ঞাসা করতে পারেন।";

            case "gu":
                if (isChest) return "કટોકટી તબીબી સલાહ: છાતીમાં દુખાવો અથવા અસ્વસ્થતા થાય તો તાત્કાલિક તબીબી સહાય લો.";
                if (isHeadacheOrFever) return "તબીબી સલાહ: માથાનો દુખાવો કે તાવ હોય તો પૂરતો આરામ કરો અને પુષ્કળ પાણી પીવો.";
                return "નમસ્તે! હું તમારો AI આરોગ્ય સહાયક છું. આપના સ્વાસ્થ્ય વિશે કોઈ પણ પ્રશ્ન પૂછી શકો છો.";

            case "pa":
                if (isChest) return "ਐਮਰਜੈਂਸੀ ਸਲਾਹ: ਛਾਤੀ ਵਿੱਚ ਦਰਦ ਜਾਂ ਬੇਚੈਨੀ ਹੋਣ 'ਤੇ ਤੁਰੰਤ ਡਾਕਟਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।";
                if (isHeadacheOrFever) return "ਸਿਹਤ ਸਲਾਹ: ਸਿਰਦਰਦ ਜਾਂ ਬੁਖਾਰ ਵਿੱਚ ਆਰਾਮ ਕਰੋ ਅਤੇ ਖੂਬ ਪਾਣੀ ਪੀਓ।";
                return "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ AI ਸਿਹਤ ਸਹਾਇਕ ਹਾਂ। ਸਿਹਤ ਬਾਰੇ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛ ਸਕਦੇ ਹੋ।";

            case "or":
                if (isChest) return "ଜରୁରୀକାଳୀନ ପରାମର୍ଶ: ଛାତିରେ ଯନ୍ତ୍ରଣା ହେଲେ ତୁରନ୍ତ ଡାକ୍ତରୀ ସହାୟତା ନିଅନ୍ତୁ।";
                if (isHeadacheOrFever) return "ସ୍ୱାସ୍ଥ୍ୟ ପରାମର୍ଶ: ମୁଣ୍ଡବିନ୍ଧା ବା ଜ୍ୱର ଥିଲେ ବିଶ୍ରାମ ନିଅନ୍ତୁ ଏବଂ ପର୍ଯ୍ୟାପ୍ତ ପାଣି ପିଅନ୍ତୁ।";
                return "ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ AI ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ। ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ବିଷୟରେ ଯେକୌଣସି ପ୍ରଶ୍ନ ପଚାରିପାରିବେ।";

            default:
                if (isChest) return "Emergency Cardiovascular Triage: Sudden chest pain, pressure, tightness, or radiating discomfort warrants immediate emergency clinical evaluation (call emergency services). Non-cardiac causes (such as GERD or muscle strain) must only be diagnosed after acute coronary issues are ruled out.";
                if (isHeadacheOrFever) return "Clinical Symptom Evaluation: Cephalea or febrile presentation suggests physiological inflammation or viral syndrome. Hydrate thoroughly (2.5L fluids daily with electrolytes) and rest in a dark room. Seek prompt medical care if accompanied by stiff neck, visual changes, or fever >103°F.";
                if (isBp) return "AHA/ACC Hypertension Guidance: Optimal blood pressure is <120/<80 mmHg. Stage 1 Hypertension is 130–139/80–89 mmHg. Crucial interventions include reducing sodium (<2,300 mg/day, ideally 1,500 mg/day), increasing dietary potassium, and 150 mins/week of aerobic movement.";
                if (isDiabetes) return "ADA Glycemic Standards: Normal fasting blood glucose is 70–99 mg/dL. Regular meal timing, dietary fiber, and aerobic exercise significantly enhance insulin sensitivity.";
                return "Clinical Health Guidance: For comprehensive preventative health, regular biometric tracking (blood pressure, fasting glucose, lipid panel), 150 minutes of moderate cardiovascular movement weekly, and a balanced diet are recommended.";
        }
    }

    private ChatConversationDTO mapConversationToDTO(ChatConversation conversation) {
        List<ChatMessageDTO> msgs = conversation.getMessages() != null ? conversation.getMessages().stream()
                .map(this::mapMessageToDTO)
                .collect(Collectors.toList()) : new ArrayList<>();

        return ChatConversationDTO.builder()
                .id(conversation.getId())
                .patientId(conversation.getPatient().getId())
                .title(conversation.getTitle())
                .createdAt(conversation.getCreatedAt())
                .updatedAt(conversation.getUpdatedAt())
                .messages(msgs)
                .build();
    }

    private ChatMessageDTO mapMessageToDTO(ChatMessage msg) {
        return ChatMessageDTO.builder()
                .id(msg.getId())
                .sender(msg.getSender())
                .content(msg.getContent())
                .citations(msg.getCitations())
                .createdAt(msg.getCreatedAt())
                .build();
    }
}
