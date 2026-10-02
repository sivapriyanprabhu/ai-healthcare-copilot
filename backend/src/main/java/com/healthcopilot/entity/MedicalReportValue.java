package com.healthcopilot.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "medical_report_values")
public class MedicalReportValue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id", nullable = false)
    private MedicalReport report;

    @Column(name = "metric_name", nullable = false, length = 100)
    private String metricName;

    @Column(name = "extracted_value", nullable = false, length = 50)
    private String extractedValue;

    @Column(name = "numeric_value")
    private Double numericValue;

    @Column(length = 30)
    private String unit;

    @Column(name = "reference_range", length = 100)
    private String referenceRange;

    @Column(nullable = false, length = 50)
    private String status; // NORMAL, ABNORMAL_HIGH, ABNORMAL_LOW

    @Column(columnDefinition = "TEXT")
    private String explanation;

    public MedicalReportValue() {}

    public MedicalReportValue(Long id, MedicalReport report, String metricName, String extractedValue, Double numericValue, String unit, String referenceRange, String status, String explanation) {
        this.id = id;
        this.report = report;
        this.metricName = metricName;
        this.extractedValue = extractedValue;
        this.numericValue = numericValue;
        this.unit = unit;
        this.referenceRange = referenceRange;
        this.status = status;
        this.explanation = explanation;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public MedicalReport getReport() { return report; }
    public void setReport(MedicalReport report) { this.report = report; }

    public String getMetricName() { return metricName; }
    public void setMetricName(String metricName) { this.metricName = metricName; }

    public String getExtractedValue() { return extractedValue; }
    public void setExtractedValue(String extractedValue) { this.extractedValue = extractedValue; }

    public Double getNumericValue() { return numericValue; }
    public void setNumericValue(Double numericValue) { this.numericValue = numericValue; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getReferenceRange() { return referenceRange; }
    public void setReferenceRange(String referenceRange) { this.referenceRange = referenceRange; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public static MedicalReportValueBuilder builder() { return new MedicalReportValueBuilder(); }

    public static class MedicalReportValueBuilder {
        private Long id;
        private MedicalReport report;
        private String metricName;
        private String extractedValue;
        private Double numericValue;
        private String unit;
        private String referenceRange;
        private String status;
        private String explanation;

        public MedicalReportValueBuilder id(Long id) { this.id = id; return this; }
        public MedicalReportValueBuilder report(MedicalReport report) { this.report = report; return this; }
        public MedicalReportValueBuilder metricName(String metricName) { this.metricName = metricName; return this; }
        public MedicalReportValueBuilder extractedValue(String extractedValue) { this.extractedValue = extractedValue; return this; }
        public MedicalReportValueBuilder numericValue(Double numericValue) { this.numericValue = numericValue; return this; }
        public MedicalReportValueBuilder unit(String unit) { this.unit = unit; return this; }
        public MedicalReportValueBuilder referenceRange(String referenceRange) { this.referenceRange = referenceRange; return this; }
        public MedicalReportValueBuilder status(String status) { this.status = status; return this; }
        public MedicalReportValueBuilder explanation(String explanation) { this.explanation = explanation; return this; }

        public MedicalReportValue build() {
            return new MedicalReportValue(id, report, metricName, extractedValue, numericValue, unit, referenceRange, status, explanation);
        }
    }
}
