package com.healthcopilot.dto;

public class MedicalReportValueDTO {
    private Long id;
    private String metricName;
    private String extractedValue;
    private Double numericValue;
    private String unit;
    private String referenceRange;
    private String status;
    private String explanation;

    public MedicalReportValueDTO() {}

    public MedicalReportValueDTO(Long id, String metricName, String extractedValue, Double numericValue, String unit, String referenceRange, String status, String explanation) {
        this.id = id;
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

    public static MedicalReportValueDTOBuilder builder() { return new MedicalReportValueDTOBuilder(); }

    public static class MedicalReportValueDTOBuilder {
        private Long id;
        private String metricName;
        private String extractedValue;
        private Double numericValue;
        private String unit;
        private String referenceRange;
        private String status;
        private String explanation;

        public MedicalReportValueDTOBuilder id(Long id) { this.id = id; return this; }
        public MedicalReportValueDTOBuilder metricName(String metricName) { this.metricName = metricName; return this; }
        public MedicalReportValueDTOBuilder extractedValue(String extractedValue) { this.extractedValue = extractedValue; return this; }
        public MedicalReportValueDTOBuilder numericValue(Double numericValue) { this.numericValue = numericValue; return this; }
        public MedicalReportValueDTOBuilder unit(String unit) { this.unit = unit; return this; }
        public MedicalReportValueDTOBuilder referenceRange(String referenceRange) { this.referenceRange = referenceRange; return this; }
        public MedicalReportValueDTOBuilder status(String status) { this.status = status; return this; }
        public MedicalReportValueDTOBuilder explanation(String explanation) { this.explanation = explanation; return this; }

        public MedicalReportValueDTO build() {
            return new MedicalReportValueDTO(id, metricName, extractedValue, numericValue, unit, referenceRange, status, explanation);
        }
    }
}
