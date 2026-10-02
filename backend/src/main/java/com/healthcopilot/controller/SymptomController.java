package com.healthcopilot.controller;

import com.healthcopilot.dto.SymptomAnalysisRequest;
import com.healthcopilot.dto.SymptomAnalysisResponse;
import com.healthcopilot.service.SymptomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/symptoms")
public class SymptomController {

    @Autowired
    private SymptomService symptomService;

    @PostMapping("/analyze")
    public ResponseEntity<SymptomAnalysisResponse> analyzeSymptoms(@RequestBody SymptomAnalysisRequest request) {
        return ResponseEntity.ok(symptomService.analyzeSymptoms(request));
    }
}
