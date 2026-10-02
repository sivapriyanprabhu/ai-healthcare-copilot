package com.healthcopilot.controller;

import com.healthcopilot.dto.MedicationDTO;
import com.healthcopilot.entity.Patient;
import com.healthcopilot.entity.User;
import com.healthcopilot.repository.PatientRepository;
import com.healthcopilot.repository.UserRepository;
import com.healthcopilot.service.MedicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/medications")
public class MedicationController {

    @Autowired
    private MedicationService medicationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @GetMapping
    public ResponseEntity<List<MedicationDTO>> getAllMedications(Authentication authentication) {
        return ResponseEntity.ok(medicationService.getPatientMedications(getPatient(authentication)));
    }

    @GetMapping("/active")
    public ResponseEntity<List<MedicationDTO>> getActiveMedications(Authentication authentication) {
        return ResponseEntity.ok(medicationService.getActiveMedications(getPatient(authentication)));
    }

    @PostMapping("/interactions")
    public ResponseEntity<Map<String, Object>> checkInteractions(
            @RequestBody(required = false) Map<String, Object> body,
            Authentication authentication) {
        Map<String, Object> requestBody = body != null ? body : new HashMap<>();
        return ResponseEntity.ok(medicationService.checkInteractions(requestBody, getPatient(authentication)));
    }

    @PostMapping
    public ResponseEntity<MedicationDTO> createMedication(@RequestBody MedicationDTO dto, Authentication authentication) {
        return ResponseEntity.ok(medicationService.createMedication(dto, getPatient(authentication)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicationDTO> updateMedication(@PathVariable Long id, @RequestBody MedicationDTO dto, Authentication authentication) {
        return ResponseEntity.ok(medicationService.updateMedication(id, dto, getPatient(authentication)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedication(@PathVariable Long id, Authentication authentication) {
        medicationService.deleteMedication(id, getPatient(authentication));
        return ResponseEntity.noContent().build();
    }

    private Patient getPatient(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return patientRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));
    }
}
