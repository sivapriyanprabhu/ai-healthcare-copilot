package com.healthcopilot.dto;

import java.util.List;
import java.util.Map;

public class DietPlanResponse {
    private Integer dailyCalorieTarget;
    private Map<String, Integer> macroSplit;
    private List<MealPlanDTO> meals;
    private String hydrationAdvice;
    private List<String> supplementSuggestions;
    private String disclaimer;

    public DietPlanResponse() {}

    public Integer getDailyCalorieTarget() { return dailyCalorieTarget; }
    public void setDailyCalorieTarget(Integer dailyCalorieTarget) { this.dailyCalorieTarget = dailyCalorieTarget; }
    public Map<String, Integer> getMacroSplit() { return macroSplit; }
    public void setMacroSplit(Map<String, Integer> macroSplit) { this.macroSplit = macroSplit; }
    public List<MealPlanDTO> getMeals() { return meals; }
    public void setMeals(List<MealPlanDTO> meals) { this.meals = meals; }
    public String getHydrationAdvice() { return hydrationAdvice; }
    public void setHydrationAdvice(String hydrationAdvice) { this.hydrationAdvice = hydrationAdvice; }
    public List<String> getSupplementSuggestions() { return supplementSuggestions; }
    public void setSupplementSuggestions(List<String> supplementSuggestions) { this.supplementSuggestions = supplementSuggestions; }
    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }

    public static class MealPlanDTO {
        private String mealType;
        private List<MealItemDTO> items;
        private Integer totalCalories;

        public MealPlanDTO() {}
        public String getMealType() { return mealType; }
        public void setMealType(String mealType) { this.mealType = mealType; }
        public List<MealItemDTO> getItems() { return items; }
        public void setItems(List<MealItemDTO> items) { this.items = items; }
        public Integer getTotalCalories() { return totalCalories; }
        public void setTotalCalories(Integer totalCalories) { this.totalCalories = totalCalories; }
    }

    public static class MealItemDTO {
        private String name;
        private Integer calories;
        private Double protein;
        private Double carbs;
        private Double fat;
        private String notes;

        public MealItemDTO() {}
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public Integer getCalories() { return calories; }
        public void setCalories(Integer calories) { this.calories = calories; }
        public Double getProtein() { return protein; }
        public void setProtein(Double protein) { this.protein = protein; }
        public Double getCarbs() { return carbs; }
        public void setCarbs(Double carbs) { this.carbs = carbs; }
        public Double getFat() { return fat; }
        public void setFat(Double fat) { this.fat = fat; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }
}
