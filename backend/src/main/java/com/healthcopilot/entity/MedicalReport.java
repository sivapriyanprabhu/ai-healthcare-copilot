package com.healthcopilot.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "medical_reports")
public class MedicalReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "report_type", nullable = false, length = 50)
    private String reportType;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_type", length = 50)
    private String fileType;

    @Column(name = "raw_ocr_text", columnDefinition = "TEXT")
    private String rawOcrText;

    @Column(name = "ai_summary", columnDefinition = "TEXT")
    private String aiSummary;

    @Column(name = "doctor_questions", columnDefinition = "TEXT")
    private String doctorQuestions;

    @Column(name = "overall_status", length = 50)
    private String overallStatus;

    @Column(name = "uploaded_at", updatable = false)
    private LocalDateTime uploadedAt;

    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MedicalReportValue> values = new ArrayList<>();

    public MedicalReport() {}

    public MedicalReport(Long id, Patient patient, String title, String reportType, String fileName, String fileType, String rawOcrText, String aiSummary, String doctorQuestions, String overallStatus, LocalDateTime uploadedAt, List<MedicalReportValue> values) {
        this.id = id;
        this.patient = patient;
        this.title = title;
        this.reportType = reportType;
        this.fileName = fileName;
        this.fileType = fileType;
        this.rawOcrText = rawOcrText;
        this.aiSummary = aiSummary;
        this.doctorQuestions = doctorQuestions;
        this.overallStatus = overallStatus;
        this.uploadedAt = uploadedAt != null ? uploadedAt : LocalDateTime.now();
        if (values != null) this.values = values;
    }

    @PrePersist
    protected void onCreate() {
        if (uploadedAt == null) uploadedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

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

    public List<MedicalReportValue> getValues() { return values; }
    public void setValues(List<MedicalReportValue> values) { this.values = values; }

    public static MedicalReportBuilder builder() { return new MedicalReportBuilder(); }

    public static class MedicalReportBuilder {
        private Long id;
        private Patient patient;
        private String title;
        private String reportType;
        private String fileName;
        private String fileType;
        private String rawOcrText;
        private String aiSummary;
        private String doctorQuestions;
        private String overallStatus;
        private LocalDateTime uploadedAt;
        private List<MedicalReportValue> values = new ArrayList<>();

        public MedicalReportBuilder id(Long id) { this.id = id; return this; }
        public MedicalReportBuilder patient(Patient patient) { this.patient = patient; return this; }
        public MedicalReportBuilder title(String title) { this.title = title; return this; }
        public MedicalReportBuilder reportType(String reportType) { this.reportType = reportType; return this; }
        public MedicalReportBuilder fileName(String fileName) { this.fileName = fileName; return this; }
        public MedicalReportBuilder fileType(String fileType) { this.fileType = fileType; return this; }
        public MedicalReportBuilder rawOcrText(String rawOcrText) { this.rawOcrText = rawOcrText; return this; }
        public MedicalReportBuilder aiSummary(String aiSummary) { this.aiSummary = aiSummary; return this; }
        public MedicalReportBuilder doctorQuestions(String doctorQuestions) { this.doctorQuestions = doctorQuestions; return this; }
        public MedicalReportBuilder overallStatus(String overallStatus) { this.overallStatus = overallStatus; return this; }
        public MedicalReportBuilder uploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; return this; }
        public MedicalReportBuilder values(List<MedicalReportValue> values) { this.values = values; return this; }

        public MedicalReport build() {
            return new MedicalReport(id, patient, title, reportType, fileName, fileType, rawOcrText, aiSummary, doctorQuestions, overallStatus, uploadedAt, values);
        }
    }
}
