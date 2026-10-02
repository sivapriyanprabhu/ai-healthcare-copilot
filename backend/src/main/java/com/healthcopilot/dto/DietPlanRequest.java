package com.healthcopilot.dto;

import java.util.List;
import java.util.Map;

public class DietPlanRequest {
    private Integer age;
    private String sex;
    private Double weightKg;
    private Double heightCm;
    private String activityLevel;
    private String goal;
    private List<String> restrictions;
    private List<String> conditions;

    public DietPlanRequest() {}

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getSex() { return sex; }
    public void setSex(String sex) { this.sex = sex; }
    public Double getWeightKg() { return weightKg; }
    public void setWeightKg(Double weightKg) { this.weightKg = weightKg; }
    public Double getHeightCm() { return heightCm; }
    public void setHeightCm(Double heightCm) { this.heightCm = heightCm; }
    public String getActivityLevel() { return activityLevel; }
    public void setActivityLevel(String activityLevel) { this.activityLevel = activityLevel; }
    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }
    public List<String> getRestrictions() { return restrictions; }
    public void setRestrictions(List<String> restrictions) { this.restrictions = restrictions; }
    public List<String> getConditions() { return conditions; }
    public void setConditions(List<String> conditions) { this.conditions = conditions; }
}
