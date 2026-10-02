package com.healthcopilot.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "risk_prediction_factors")
public class RiskPredictionFactor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prediction_id", nullable = false)
    private RiskPrediction prediction;

    @Column(name = "factor_name", nullable = false, length = 100)
    private String factorName;

    @Column(name = "impact_score", nullable = false)
    private Double impactScore; // SHAP value

    @Column(columnDefinition = "TEXT")
    private String description;

    public RiskPredictionFactor() {}

    public RiskPredictionFactor(Long id, RiskPrediction prediction, String factorName, Double impactScore, String description) {
        this.id = id;
        this.prediction = prediction;
        this.factorName = factorName;
        this.impactScore = impactScore;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public RiskPrediction getPrediction() { return prediction; }
    public void setPrediction(RiskPrediction prediction) { this.prediction = prediction; }

    public String getFactorName() { return factorName; }
    public void setFactorName(String factorName) { this.factorName = factorName; }

    public Double getImpactScore() { return impactScore; }
    public void setImpactScore(Double impactScore) { this.impactScore = impactScore; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public static RiskPredictionFactorBuilder builder() { return new RiskPredictionFactorBuilder(); }

    public static class RiskPredictionFactorBuilder {
        private Long id;
        private RiskPrediction prediction;
        private String factorName;
        private Double impactScore;
        private String description;

        public RiskPredictionFactorBuilder id(Long id) { this.id = id; return this; }
        public RiskPredictionFactorBuilder prediction(RiskPrediction prediction) { this.prediction = prediction; return this; }
        public RiskPredictionFactorBuilder factorName(String factorName) { this.factorName = factorName; return this; }
        public RiskPredictionFactorBuilder impactScore(Double impactScore) { this.impactScore = impactScore; return this; }
        public RiskPredictionFactorBuilder description(String description) { this.description = description; return this; }

        public RiskPredictionFactor build() {
            return new RiskPredictionFactor(id, prediction, factorName, impactScore, description);
        }
    }
}
