package com.healthcopilot.controller;

import com.healthcopilot.dto.MedicalReportDTO;
import com.healthcopilot.dto.ReportComparisonDTO;
import com.healthcopilot.service.MedicalReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class MedicalReportController {

    @Autowired
    private MedicalReportService reportService;

    @PostMapping("/upload")
    public ResponseEntity<MedicalReportDTO> uploadReport(
            Authentication authentication,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "reportType", required = false) String reportType) {
        return ResponseEntity.ok(reportService.uploadAndAnalyzeReport(authentication.getName(), title, reportType, file));
    }

    @GetMapping
    public ResponseEntity<List<MedicalReportDTO>> getReports(Authentication authentication) {
        return ResponseEntity.ok(reportService.getPatientReports(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalReportDTO> getReportById(Authentication authentication, @PathVariable("id") Long id) {
        return ResponseEntity.ok(reportService.getReportById(authentication.getName(), id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(Authentication authentication, @PathVariable("id") Long id) {
        reportService.deleteReport(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/compare")
    public ResponseEntity<ReportComparisonDTO> compareReports(
            Authentication authentication,
            @RequestBody List<Long> reportIds) {
        return ResponseEntity.ok(reportService.compareReports(authentication.getName(), reportIds));
    }
}
