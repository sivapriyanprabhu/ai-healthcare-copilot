package com.healthcopilot.controller;

import com.healthcopilot.dto.DashboardSummaryDTO;
import com.healthcopilot.dto.HealthMetricDTO;
import com.healthcopilot.service.HealthMetricService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/health-metrics")
public class HealthMetricController {

    @Autowired
    private HealthMetricService healthMetricService;

    @PostMapping
    public ResponseEntity<HealthMetricDTO> recordMetric(
            Authentication authentication,
            @RequestBody HealthMetricDTO request) {
        return ResponseEntity.ok(healthMetricService.recordMetric(authentication.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<HealthMetricDTO>> getMetricHistory(Authentication authentication) {
        return ResponseEntity.ok(healthMetricService.getPatientMetricHistory(authentication.getName()));
    }

    @GetMapping("/dashboard-summary")
    public ResponseEntity<DashboardSummaryDTO> getDashboardSummary(Authentication authentication) {
        return ResponseEntity.ok(healthMetricService.getDashboardSummary(authentication.getName()));
    }
}
