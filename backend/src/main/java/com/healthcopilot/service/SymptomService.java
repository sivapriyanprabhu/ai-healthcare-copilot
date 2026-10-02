package com.healthcopilot.service;

import com.healthcopilot.dto.SymptomAnalysisRequest;
import com.healthcopilot.dto.SymptomAnalysisResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;

@Service
public class SymptomService {

    @Value("${app.ai-service.url:http://localhost:8000}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public SymptomAnalysisResponse analyzeSymptoms(SymptomAnalysisRequest request) {
        try {
            String url = aiServiceUrl + "/api/ai/symptoms/analyze";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<SymptomAnalysisRequest> entity = new HttpEntity<>(request, headers);
            ResponseEntity<SymptomAnalysisResponse> response = restTemplate.postForEntity(url, entity, SymptomAnalysisResponse.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("AI Symptom Service call failed, using fallback triage: " + e.getMessage());
        }

        // Fallback triage engine
        boolean isSevere = "Severe".equalsIgnoreCase(request.getSeverity());
        return new SymptomAnalysisResponse(
                isSevere ? "EMERGENCY_CARE" : "PROMPT_CARE",
                isSevere ? "rose" : "amber",
                Arrays.asList(
                        "Clinical presentation associated with physiological stress or viral syndrome.",
                        "These symptoms require formal healthcare evaluation."
                ),
                "Primary Care Physician / Internal Medicine Specialist",
                Arrays.asList(
                        "Sudden severe pain or pressure",
                        "Difficulty breathing or persistent fever"
                ),
                Arrays.asList(
                        "Schedule an appointment with a licensed medical practitioner.",
                        "Avoid unprescribed medication and maintain adequate rest."
                ),
                "DISCLAIMER: Non-diagnostic decision support. Seek immediate emergency care for acute or severe symptoms."
        );
    }
}
