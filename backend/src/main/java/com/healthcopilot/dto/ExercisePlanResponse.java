package com.healthcopilot.dto;

import java.util.List;
import java.util.Map;

public class ExercisePlanResponse {
    private Map<String, List<ExerciseItemDTO>> weeklyPlan;
    private Integer totalWeeklyMinutes;
    private Integer estimatedWeeklyCalories;
    private List<String> safetyTips;
    private String disclaimer;
    private String routineType;
    private String language;

    public ExercisePlanResponse() {}

    public Map<String, List<ExerciseItemDTO>> getWeeklyPlan() { return weeklyPlan; }
    public void setWeeklyPlan(Map<String, List<ExerciseItemDTO>> weeklyPlan) { this.weeklyPlan = weeklyPlan; }

    public Integer getTotalWeeklyMinutes() { return totalWeeklyMinutes; }
    public void setTotalWeeklyMinutes(Integer totalWeeklyMinutes) { this.totalWeeklyMinutes = totalWeeklyMinutes; }

    public Integer getEstimatedWeeklyCalories() { return estimatedWeeklyCalories; }
    public void setEstimatedWeeklyCalories(Integer estimatedWeeklyCalories) { this.estimatedWeeklyCalories = estimatedWeeklyCalories; }

    public List<String> getSafetyTips() { return safetyTips; }
    public void setSafetyTips(List<String> safetyTips) { this.safetyTips = safetyTips; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }

    public String getRoutineType() { return routineType; }
    public void setRoutineType(String routineType) { this.routineType = routineType; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public static class ExerciseItemDTO {
        private String name;
        private String sanskritName;
        private String category;
        private Integer durationMinutes;
        private String intensityLevel;
        private Integer caloriesBurned;
        private List<String> muscleGroups;
        private String instructions;
        private String breathingCue;
        private List<String> benefits;
        private List<String> precautions;
        private String imageUrl;
        private String videoUrl;
        private String videoEmbedId;
        private String language;

        public ExerciseItemDTO() {}

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getSanskritName() { return sanskritName; }
        public void setSanskritName(String sanskritName) { this.sanskritName = sanskritName; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public Integer getDurationMinutes() { return durationMinutes; }
        public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

        public String getIntensityLevel() { return intensityLevel; }
        public void setIntensityLevel(String intensityLevel) { this.intensityLevel = intensityLevel; }

        public Integer getCaloriesBurned() { return caloriesBurned; }
        public void setCaloriesBurned(Integer caloriesBurned) { this.caloriesBurned = caloriesBurned; }

        public List<String> getMuscleGroups() { return muscleGroups; }
        public void setMuscleGroups(List<String> muscleGroups) { this.muscleGroups = muscleGroups; }

        public String getInstructions() { return instructions; }
        public void setInstructions(String instructions) { this.instructions = instructions; }

        public String getBreathingCue() { return breathingCue; }
        public void setBreathingCue(String breathingCue) { this.breathingCue = breathingCue; }

        public List<String> getBenefits() { return benefits; }
        public void setBenefits(List<String> benefits) { this.benefits = benefits; }

        public List<String> getPrecautions() { return precautions; }
        public void setPrecautions(List<String> precautions) { this.precautions = precautions; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

        public String getVideoUrl() { return videoUrl; }
        public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

        public String getVideoEmbedId() { return videoEmbedId; }
        public void setVideoEmbedId(String videoEmbedId) { this.videoEmbedId = videoEmbedId; }

        public String getLanguage() { return language; }
        public void setLanguage(String language) { this.language = language; }
    }
}
