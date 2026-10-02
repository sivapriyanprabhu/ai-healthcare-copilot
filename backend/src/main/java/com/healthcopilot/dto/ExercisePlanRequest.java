package com.healthcopilot.dto;

import java.util.List;

public class ExercisePlanRequest {
    private Integer age;
    private String fitnessLevel;
    private String goal;
    private Integer availableMinutes;
    private List<String> injuries;
    private List<String> preferences;
    private String routineType;
    private String language;

    public ExercisePlanRequest() {}

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getFitnessLevel() { return fitnessLevel; }
    public void setFitnessLevel(String fitnessLevel) { this.fitnessLevel = fitnessLevel; }

    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }

    public Integer getAvailableMinutes() { return availableMinutes; }
    public void setAvailableMinutes(Integer availableMinutes) { this.availableMinutes = availableMinutes; }

    public List<String> getInjuries() { return injuries; }
    public void setInjuries(List<String> injuries) { this.injuries = injuries; }

    public List<String> getPreferences() { return preferences; }
    public void setPreferences(List<String> preferences) { this.preferences = preferences; }

    public String getRoutineType() { return routineType; }
    public void setRoutineType(String routineType) { this.routineType = routineType; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}
