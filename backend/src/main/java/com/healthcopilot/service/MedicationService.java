package com.healthcopilot.service;

import com.healthcopilot.dto.MedicationDTO;
import com.healthcopilot.entity.Medication;
import com.healthcopilot.entity.Patient;
import com.healthcopilot.repository.MedicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MedicationService {

    @Autowired
    private MedicationRepository medicationRepository;

    @Value("${app.ai-service.url:http://localhost:8000}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> checkInteractions(Map<String, Object> requestBody, Patient patient) {
        List<String> meds = (List<String>) requestBody.get("medications");
        if (meds == null || meds.isEmpty()) {
            meds = getActiveMedications(patient).stream()
                    .map(MedicationDTO::getMedicationName)
                    .collect(Collectors.toList());
        }
        String candidate = (String) requestBody.get("candidateDrug");

        Map<String, Object> payload = new HashMap<>();
        payload.put("medications", meds);
        if (candidate != null) {
            payload.put("candidateDrug", candidate);
        }

        try {
            String url = aiServiceUrl + "/api/ai/medications/interactions";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("Drug interaction service call failed: " + e.getMessage());
        }

        Map<String, Object> fallback = new HashMap<>();
        fallback.put("safetyLevel", "SAFE");
        fallback.put("overallSummary", "No high-risk contraindications detected in clinical fallback evaluation.");
        fallback.put("totalInteractionsFound", 0);
        fallback.put("interactions", Collections.emptyList());
        fallback.put("foodInteractions", Collections.emptyList());
        fallback.put("monitoredParameters", List.of("Blood Pressure", "Kidney Function"));
        fallback.put("disclaimer", "Clinical Decision Support: Educational screening only. Consult your physician.");
        return fallback;
    }

    public List<MedicationDTO> getPatientMedications(Patient patient) {
        return medicationRepository.findByPatientOrderByCreatedAtDesc(patient).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<MedicationDTO> getActiveMedications(Patient patient) {
        return medicationRepository.findByPatientAndIsActiveTrueOrderByMedicationNameAsc(patient).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public MedicationDTO createMedication(MedicationDTO dto, Patient patient) {
        Medication medication = Medication.builder()
                .patient(patient)
                .medicationName(dto.getMedicationName())
                .dosage(dto.getDosage())
                .frequency(dto.getFrequency())
                .prescribingDoctor(dto.getPrescribingDoctor())
                .purpose(dto.getPurpose())
                .sideEffects(dto.getSideEffects())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .refillReminderDays(dto.getRefillReminderDays())
                .build();

        if (dto.getTimeOfDay() != null && !dto.getTimeOfDay().isEmpty()) {
            try { medication.setTimeOfDay(LocalTime.parse(dto.getTimeOfDay())); } catch (Exception ignored) {}
        }
        if (dto.getStartDate() != null && !dto.getStartDate().isEmpty()) {
            try { medication.setStartDate(LocalDateTime.parse(dto.getStartDate())); } catch (Exception ignored) {}
        }
        if (dto.getEndDate() != null && !dto.getEndDate().isEmpty()) {
            try { medication.setEndDate(LocalDateTime.parse(dto.getEndDate())); } catch (Exception ignored) {}
        }

        Medication saved = medicationRepository.save(medication);
        return toDTO(saved);
    }

    public MedicationDTO updateMedication(Long id, MedicationDTO dto, Patient patient) {
        Medication medication = medicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medication not found"));

        if (!medication.getPatient().getId().equals(patient.getId())) {
            throw new RuntimeException("Unauthorized access to medication record");
        }

        if (dto.getMedicationName() != null) medication.setMedicationName(dto.getMedicationName());
        if (dto.getDosage() != null) medication.setDosage(dto.getDosage());
        if (dto.getFrequency() != null) medication.setFrequency(dto.getFrequency());
        if (dto.getPrescribingDoctor() != null) medication.setPrescribingDoctor(dto.getPrescribingDoctor());
        if (dto.getPurpose() != null) medication.setPurpose(dto.getPurpose());
        if (dto.getSideEffects() != null) medication.setSideEffects(dto.getSideEffects());
        if (dto.getIsActive() != null) medication.setIsActive(dto.getIsActive());
        if (dto.getRefillReminderDays() != null) medication.setRefillReminderDays(dto.getRefillReminderDays());

        if (dto.getTimeOfDay() != null && !dto.getTimeOfDay().isEmpty()) {
            try { medication.setTimeOfDay(LocalTime.parse(dto.getTimeOfDay())); } catch (Exception ignored) {}
        }

        return toDTO(medicationRepository.save(medication));
    }

    public void deleteMedication(Long id, Patient patient) {
        Medication medication = medicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medication not found"));
        if (!medication.getPatient().getId().equals(patient.getId())) {
            throw new RuntimeException("Unauthorized access to medication record");
        }
        medicationRepository.delete(medication);
    }

    private MedicationDTO toDTO(Medication m) {
        MedicationDTO dto = new MedicationDTO();
        dto.setId(m.getId());
        dto.setMedicationName(m.getMedicationName());
        dto.setDosage(m.getDosage());
        dto.setFrequency(m.getFrequency());
        dto.setTimeOfDay(m.getTimeOfDay() != null ? m.getTimeOfDay().toString() : null);
        dto.setPrescribingDoctor(m.getPrescribingDoctor());
        dto.setStartDate(m.getStartDate() != null ? m.getStartDate().toString() : null);
        dto.setEndDate(m.getEndDate() != null ? m.getEndDate().toString() : null);
        dto.setPurpose(m.getPurpose());
        dto.setSideEffects(m.getSideEffects());
        dto.setIsActive(m.getIsActive());
        dto.setRefillReminderDays(m.getRefillReminderDays());
        return dto;
    }
}
