package com.healthcopilot.dto;

import java.util.List;
import java.util.Map;

public class ReportComparisonDTO {
    private List<MedicalReportDTO> reports;
    private Map<String, List<MetricComparisonPoint>> metricTrends;
    private String aiTrendExplanation;

    public ReportComparisonDTO() {}

    public ReportComparisonDTO(List<MedicalReportDTO> reports, Map<String, List<MetricComparisonPoint>> metricTrends, String aiTrendExplanation) {
        this.reports = reports;
        this.metricTrends = metricTrends;
        this.aiTrendExplanation = aiTrendExplanation;
    }

    public List<MedicalReportDTO> getReports() { return reports; }
    public void setReports(List<MedicalReportDTO> reports) { this.reports = reports; }

    public Map<String, List<MetricComparisonPoint>> getMetricTrends() { return metricTrends; }
    public void setMetricTrends(Map<String, List<MetricComparisonPoint>> metricTrends) { this.metricTrends = metricTrends; }

    public String getAiTrendExplanation() { return aiTrendExplanation; }
    public void setAiTrendExplanation(String aiTrendExplanation) { this.aiTrendExplanation = aiTrendExplanation; }

    public static class MetricComparisonPoint {
        private String date;
        private Double numericValue;
        private String status;

        public MetricComparisonPoint() {}

        public MetricComparisonPoint(String date, Double numericValue, String status) {
            this.date = date;
            this.numericValue = numericValue;
            this.status = status;
        }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public Double getNumericValue() { return numericValue; }
        public void setNumericValue(Double numericValue) { this.numericValue = numericValue; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
