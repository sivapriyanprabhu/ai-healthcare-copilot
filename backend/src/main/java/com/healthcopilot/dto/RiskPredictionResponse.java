package com.healthcopilot.dto;

import java.util.List;

public class RiskPredictionResponse {
    private Long id;
    private String conditionName;
    private Double riskScorePercent;
    private String riskCategory;
    private Double confidenceScore;
    private String summary;
    private List<RiskFactorDTO> factors;
    private String disclaimer;
    private String createdAt;

    public RiskPredictionResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getConditionName() { return conditionName; }
    public void setConditionName(String conditionName) { this.conditionName = conditionName; }

    public Double getRiskScorePercent() { return riskScorePercent; }
    public void setRiskScorePercent(Double riskScorePercent) { this.riskScorePercent = riskScorePercent; }

    public String getRiskCategory() { return riskCategory; }
    public void setRiskCategory(String riskCategory) { this.riskCategory = riskCategory; }

    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<RiskFactorDTO> getFactors() { return factors; }
    public void setFactors(List<RiskFactorDTO> factors) { this.factors = factors; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public static class RiskFactorDTO {
        private String factorName;
        private Double impactScore;
        private String description;

        public RiskFactorDTO() {}

        public RiskFactorDTO(String factorName, Double impactScore, String description) {
            this.factorName = factorName;
            this.impactScore = impactScore;
            this.description = description;
        }

        public String getFactorName() { return factorName; }
        public void setFactorName(String factorName) { this.factorName = factorName; }

        public Double getImpactScore() { return impactScore; }
        public void setImpactScore(Double impactScore) { this.impactScore = impactScore; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
}
