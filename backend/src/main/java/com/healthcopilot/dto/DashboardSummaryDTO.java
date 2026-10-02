package com.healthcopilot.dto;

import java.util.List;

public class DashboardSummaryDTO {
    private String patientName;
    private Integer healthScore;
    private String healthScoreStatus;
    private Double bmi;
    private String bmiCategory;
    private HealthMetricDTO latestMetric;
    private List<HealthMetricDTO> metricHistory;
    private List<String> aiInsights;
    private Integer activeMedicationsCount;

    public DashboardSummaryDTO() {}

    public DashboardSummaryDTO(String patientName, Integer healthScore, String healthScoreStatus, Double bmi, String bmiCategory, HealthMetricDTO latestMetric, List<HealthMetricDTO> metricHistory, List<String> aiInsights, Integer activeMedicationsCount) {
        this.patientName = patientName;
        this.healthScore = healthScore;
        this.healthScoreStatus = healthScoreStatus;
        this.bmi = bmi;
        this.bmiCategory = bmiCategory;
        this.latestMetric = latestMetric;
        this.metricHistory = metricHistory;
        this.aiInsights = aiInsights;
        this.activeMedicationsCount = activeMedicationsCount;
    }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public Integer getHealthScore() { return healthScore; }
    public void setHealthScore(Integer healthScore) { this.healthScore = healthScore; }

    public String getHealthScoreStatus() { return healthScoreStatus; }
    public void setHealthScoreStatus(String healthScoreStatus) { this.healthScoreStatus = healthScoreStatus; }

    public Double getBmi() { return bmi; }
    public void setBmi(Double bmi) { this.bmi = bmi; }

    public String getBmiCategory() { return bmiCategory; }
    public void setBmiCategory(String bmiCategory) { this.bmiCategory = bmiCategory; }

    public HealthMetricDTO getLatestMetric() { return latestMetric; }
    public void setLatestMetric(HealthMetricDTO latestMetric) { this.latestMetric = latestMetric; }

    public List<HealthMetricDTO> getMetricHistory() { return metricHistory; }
    public void setMetricHistory(List<HealthMetricDTO> metricHistory) { this.metricHistory = metricHistory; }

    public List<String> getAiInsights() { return aiInsights; }
    public void setAiInsights(List<String> aiInsights) { this.aiInsights = aiInsights; }

    public Integer getActiveMedicationsCount() { return activeMedicationsCount; }
    public void setActiveMedicationsCount(Integer activeMedicationsCount) { this.activeMedicationsCount = activeMedicationsCount; }

    public static DashboardSummaryDTOBuilder builder() { return new DashboardSummaryDTOBuilder(); }

    public static class DashboardSummaryDTOBuilder {
        private String patientName;
        private Integer healthScore;
        private String healthScoreStatus;
        private Double bmi;
        private String bmiCategory;
        private HealthMetricDTO latestMetric;
        private List<HealthMetricDTO> metricHistory;
        private List<String> aiInsights;
        private Integer activeMedicationsCount;

        public DashboardSummaryDTOBuilder patientName(String patientName) { this.patientName = patientName; return this; }
        public DashboardSummaryDTOBuilder healthScore(Integer healthScore) { this.healthScore = healthScore; return this; }
        public DashboardSummaryDTOBuilder healthScoreStatus(String healthScoreStatus) { this.healthScoreStatus = healthScoreStatus; return this; }
        public DashboardSummaryDTOBuilder bmi(Double bmi) { this.bmi = bmi; return this; }
        public DashboardSummaryDTOBuilder bmiCategory(String bmiCategory) { this.bmiCategory = bmiCategory; return this; }
        public DashboardSummaryDTOBuilder latestMetric(HealthMetricDTO latestMetric) { this.latestMetric = latestMetric; return this; }
        public DashboardSummaryDTOBuilder metricHistory(List<HealthMetricDTO> metricHistory) { this.metricHistory = metricHistory; return this; }
        public DashboardSummaryDTOBuilder aiInsights(List<String> aiInsights) { this.aiInsights = aiInsights; return this; }
        public DashboardSummaryDTOBuilder activeMedicationsCount(Integer activeMedicationsCount) { this.activeMedicationsCount = activeMedicationsCount; return this; }

        public DashboardSummaryDTO build() {
            return new DashboardSummaryDTO(patientName, healthScore, healthScoreStatus, bmi, bmiCategory, latestMetric, metricHistory, aiInsights, activeMedicationsCount);
        }
    }
}
