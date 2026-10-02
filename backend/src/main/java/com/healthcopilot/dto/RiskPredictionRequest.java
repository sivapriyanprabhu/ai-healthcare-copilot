package com.healthcopilot.dto;

public class RiskPredictionRequest {
    private Integer age;
    private String sex;
    private Double systolicBp;
    private Double cholesterol;
    private Double glucose;
    private Double bmi;
    private Boolean smoking;
    private Integer exerciseMins;
    private Boolean familyHistory;
    private String condition;

    public RiskPredictionRequest() {}

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getSex() { return sex; }
    public void setSex(String sex) { this.sex = sex; }

    public Double getSystolicBp() { return systolicBp; }
    public void setSystolicBp(Double systolicBp) { this.systolicBp = systolicBp; }

    public Double getCholesterol() { return cholesterol; }
    public void setCholesterol(Double cholesterol) { this.cholesterol = cholesterol; }

    public Double getGlucose() { return glucose; }
    public void setGlucose(Double glucose) { this.glucose = glucose; }

    public Double getBmi() { return bmi; }
    public void setBmi(Double bmi) { this.bmi = bmi; }

    public Boolean getSmoking() { return smoking; }
    public void setSmoking(Boolean smoking) { this.smoking = smoking; }

    public Integer getExerciseMins() { return exerciseMins; }
    public void setExerciseMins(Integer exerciseMins) { this.exerciseMins = exerciseMins; }

    public Boolean getFamilyHistory() { return familyHistory; }
    public void setFamilyHistory(Boolean familyHistory) { this.familyHistory = familyHistory; }
}
