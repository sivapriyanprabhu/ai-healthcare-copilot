package com.healthcopilot.controller;

import com.healthcopilot.dto.TranslationRequest;
import com.healthcopilot.dto.TranslationResponse;
import com.healthcopilot.service.TranslationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/translate")
public class TranslationController {

    @Autowired
    private TranslationService translationService;

    @PostMapping
    public ResponseEntity<TranslationResponse> translate(@RequestBody TranslationRequest request) {
        return ResponseEntity.ok(translationService.translate(request));
    }

    @PostMapping("/text")
    public ResponseEntity<TranslationResponse> translateText(@RequestBody TranslationRequest request) {
        return ResponseEntity.ok(translationService.translate(request));
    }
}
