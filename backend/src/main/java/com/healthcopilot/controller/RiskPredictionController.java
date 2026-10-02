package com.healthcopilot.controller;

import com.healthcopilot.dto.RiskPredictionRequest;
import com.healthcopilot.dto.RiskPredictionResponse;
import com.healthcopilot.entity.Patient;
import com.healthcopilot.entity.User;
import com.healthcopilot.repository.PatientRepository;
import com.healthcopilot.repository.UserRepository;
import com.healthcopilot.service.RiskPredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/risk")
public class RiskPredictionController {

    @Autowired
    private RiskPredictionService riskPredictionService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @PostMapping("/heart-disease")
    public ResponseEntity<RiskPredictionResponse> predictHeartDisease(
            @RequestBody RiskPredictionRequest request,
            Authentication authentication) {

        Patient patient = getPatientFromAuth(authentication);
        RiskPredictionResponse result = riskPredictionService.predictHeartDiseaseRisk(request, patient);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/predict")
    public ResponseEntity<RiskPredictionResponse> predictRisk(
            @RequestBody RiskPredictionRequest request,
            Authentication authentication) {

        Patient patient = getPatientFromAuth(authentication);
        RiskPredictionResponse result = riskPredictionService.predictRisk(request, patient);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/predict/{condition}")
    public ResponseEntity<RiskPredictionResponse> predictConditionRisk(
            @PathVariable("condition") String condition,
            @RequestBody RiskPredictionRequest request,
            Authentication authentication) {

        request.setCondition(condition);
        Patient patient = getPatientFromAuth(authentication);
        RiskPredictionResponse result = riskPredictionService.predictRisk(request, patient);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/history")
    public ResponseEntity<List<RiskPredictionResponse>> getRiskHistory(Authentication authentication) {
        Patient patient = getPatientFromAuth(authentication);
        return ResponseEntity.ok(riskPredictionService.getPatientHistory(patient));
    }

    private Patient getPatientFromAuth(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return patientRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));
    }
}
