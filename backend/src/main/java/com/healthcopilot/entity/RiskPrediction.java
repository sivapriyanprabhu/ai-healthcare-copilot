package com.healthcopilot.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "risk_predictions")
public class RiskPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "condition_name", nullable = false, length = 100)
    private String conditionName;

    @Column(name = "risk_score_percent", nullable = false)
    private Double riskScorePercent;

    @Column(name = "risk_category", nullable = false, length = 30)
    private String riskCategory; // LOW, MODERATE, HIGH

    @Column(name = "confidence_score")
    private Double confidenceScore;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "prediction", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RiskPredictionFactor> factors = new ArrayList<>();

    public RiskPrediction() {}

    public RiskPrediction(Long id, Patient patient, String conditionName, Double riskScorePercent, String riskCategory, Double confidenceScore, String summary, LocalDateTime createdAt, List<RiskPredictionFactor> factors) {
        this.id = id;
        this.patient = patient;
        this.conditionName = conditionName;
        this.riskScorePercent = riskScorePercent;
        this.riskCategory = riskCategory;
        this.confidenceScore = confidenceScore;
        this.summary = summary;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
        if (factors != null) this.factors = factors;
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<RiskPredictionFactor> getFactors() { return factors; }
    public void setFactors(List<RiskPredictionFactor> factors) { this.factors = factors; }

    public static RiskPredictionBuilder builder() { return new RiskPredictionBuilder(); }

    public static class RiskPredictionBuilder {
        private Long id;
        private Patient patient;
        private String conditionName;
        private Double riskScorePercent;
        private String riskCategory;
        private Double confidenceScore;
        private String summary;
        private LocalDateTime createdAt;
        private List<RiskPredictionFactor> factors = new ArrayList<>();

        public RiskPredictionBuilder id(Long id) { this.id = id; return this; }
        public RiskPredictionBuilder patient(Patient patient) { this.patient = patient; return this; }
        public RiskPredictionBuilder conditionName(String conditionName) { this.conditionName = conditionName; return this; }
        public RiskPredictionBuilder riskScorePercent(Double riskScorePercent) { this.riskScorePercent = riskScorePercent; return this; }
        public RiskPredictionBuilder riskCategory(String riskCategory) { this.riskCategory = riskCategory; return this; }
        public RiskPredictionBuilder confidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; return this; }
        public RiskPredictionBuilder summary(String summary) { this.summary = summary; return this; }
        public RiskPredictionBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public RiskPredictionBuilder factors(List<RiskPredictionFactor> factors) { this.factors = factors; return this; }

        public RiskPrediction build() {
            return new RiskPrediction(id, patient, conditionName, riskScorePercent, riskCategory, confidenceScore, summary, createdAt, factors);
        }
    }
}
