package com.healthcopilot.dto;

import java.time.LocalDateTime;
import java.util.List;

public class MedicalReportDTO {
    private Long id;
    private Long patientId;
    private String title;
    private String reportType;
    private String fileName;
    private String fileType;
    private String rawOcrText;
    private String aiSummary;
    private String doctorQuestions;
    private String overallStatus;
    private LocalDateTime uploadedAt;
    private List<MedicalReportValueDTO> values;

    public MedicalReportDTO() {}

    public MedicalReportDTO(Long id, Long patientId, String title, String reportType, String fileName, String fileType, String rawOcrText, String aiSummary, String doctorQuestions, String overallStatus, LocalDateTime uploadedAt, List<MedicalReportValueDTO> values) {
        this.id = id;
        this.patientId = patientId;
        this.title = title;
        this.reportType = reportType;
        this.fileName = fileName;
        this.fileType = fileType;
        this.rawOcrText = rawOcrText;
        this.aiSummary = aiSummary;
        this.doctorQuestions = doctorQuestions;
        this.overallStatus = overallStatus;
        this.uploadedAt = uploadedAt;
        this.values = values;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getReportType() { return reportType; }
    public void setReportType(String reportType) { this.reportType = reportType; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public String getRawOcrText() { return rawOcrText; }
    public void setRawOcrText(String rawOcrText) { this.rawOcrText = rawOcrText; }

    public String getAiSummary() { return aiSummary; }
    public void setAiSummary(String aiSummary) { this.aiSummary = aiSummary; }

    public String getDoctorQuestions() { return doctorQuestions; }
    public void setDoctorQuestions(String doctorQuestions) { this.doctorQuestions = doctorQuestions; }

    public String getOverallStatus() { return overallStatus; }
    public void setOverallStatus(String overallStatus) { this.overallStatus = overallStatus; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }

    public List<MedicalReportValueDTO> getValues() { return values; }
    public void setValues(List<MedicalReportValueDTO> values) { this.values = values; }

    public static MedicalReportDTOBuilder builder() { return new MedicalReportDTOBuilder(); }

    public static class MedicalReportDTOBuilder {
        private Long id;
        private Long patientId;
        private String title;
        private String reportType;
        private String fileName;
        private String fileType;
        private String rawOcrText;
        private String aiSummary;
        private String doctorQuestions;
        private String overallStatus;
        private LocalDateTime uploadedAt;
        private List<MedicalReportValueDTO> values;

        public MedicalReportDTOBuilder id(Long id) { this.id = id; return this; }
        public MedicalReportDTOBuilder patientId(Long patientId) { this.patientId = patientId; return this; }
        public MedicalReportDTOBuilder title(String title) { this.title = title; return this; }
        public MedicalReportDTOBuilder reportType(String reportType) { this.reportType = reportType; return this; }
        public MedicalReportDTOBuilder fileName(String fileName) { this.fileName = fileName; return this; }
        public MedicalReportDTOBuilder fileType(String fileType) { this.fileType = fileType; return this; }
        public MedicalReportDTOBuilder rawOcrText(String rawOcrText) { this.rawOcrText = rawOcrText; return this; }
        public MedicalReportDTOBuilder aiSummary(String aiSummary) { this.aiSummary = aiSummary; return this; }
        public MedicalReportDTOBuilder doctorQuestions(String doctorQuestions) { this.doctorQuestions = doctorQuestions; return this; }
        public MedicalReportDTOBuilder overallStatus(String overallStatus) { this.overallStatus = overallStatus; return this; }
        public MedicalReportDTOBuilder uploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; return this; }
        public MedicalReportDTOBuilder values(List<MedicalReportValueDTO> values) { this.values = values; return this; }

        public MedicalReportDTO build() {
            return new MedicalReportDTO(id, patientId, title, reportType, fileName, fileType, rawOcrText, aiSummary, doctorQuestions, overallStatus, uploadedAt, values);
        }
    }
}
