package com.healthcopilot.dto;

import java.util.List;

public class SymptomAnalysisRequest {
    private List<String> symptoms;
    private Integer durationDays;
    private String severity; // Mild, Moderate, Severe
    private Integer age;
    private String existingConditions;

    public SymptomAnalysisRequest() {}

    public SymptomAnalysisRequest(List<String> symptoms, Integer durationDays, String severity, Integer age, String existingConditions) {
        this.symptoms = symptoms;
        this.durationDays = durationDays;
        this.severity = severity;
        this.age = age;
        this.existingConditions = existingConditions;
    }

    public List<String> getSymptoms() { return symptoms; }
    public void setSymptoms(List<String> symptoms) { this.symptoms = symptoms; }

    public Integer getDurationDays() { return durationDays; }
    public void setDurationDays(Integer durationDays) { this.durationDays = durationDays; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getExistingConditions() { return existingConditions; }
    public void setExistingConditions(String existingConditions) { this.existingConditions = existingConditions; }
}
