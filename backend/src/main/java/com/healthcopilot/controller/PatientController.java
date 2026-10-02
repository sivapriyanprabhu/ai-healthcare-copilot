package com.healthcopilot.controller;

import com.healthcopilot.dto.PatientProfileRequest;
import com.healthcopilot.dto.PatientProfileResponse;
import com.healthcopilot.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping("/me")
    public ResponseEntity<PatientProfileResponse> getMyProfile(Authentication authentication) {
        return ResponseEntity.ok(patientService.getPatientProfile(authentication.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<PatientProfileResponse> updateMyProfile(
            Authentication authentication,
            @RequestBody PatientProfileRequest request) {
        return ResponseEntity.ok(patientService.updatePatientProfile(authentication.getName(), request));
    }
}
