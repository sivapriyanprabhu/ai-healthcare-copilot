package com.healthcopilot.service;

import com.healthcopilot.dto.DietPlanRequest;
import com.healthcopilot.dto.DietPlanResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class DietService {

    @Value("${app.ai-service.url:http://localhost:8000}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public DietPlanResponse generateDietPlan(DietPlanRequest request) {
        try {
            String url = aiServiceUrl + "/api/ai/diet/plan";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<DietPlanRequest> entity = new HttpEntity<>(request, headers);
            ResponseEntity<DietPlanResponse> response = restTemplate.postForEntity(url, entity, DietPlanResponse.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("AI Diet Service call failed, using clinical fallback: " + e.getMessage());
        }

        return calculateFallbackDietPlan(request);
    }

    private DietPlanResponse calculateFallbackDietPlan(DietPlanRequest request) {
        DietPlanResponse response = new DietPlanResponse();

        // 1. Set default values if request fields are null
        double weight = request.getWeightKg() != null ? request.getWeightKg() : 75.0;
        double height = request.getHeightCm() != null ? request.getHeightCm() : 175.0;
        int age = request.getAge() != null ? request.getAge() : 35;
        String gender = request.getSex() != null ? request.getSex() : "Male";
        String activityLevel = request.getActivityLevel() != null ? request.getActivityLevel() : "Moderate";
        String goal = request.getGoal() != null ? request.getGoal() : "Maintenance";

        // 2. Mifflin-St Jeor BMR calculation
        double bmr;
        if ("male".equalsIgnoreCase(gender)) {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        // 3. TDEE calculation
        double activityFactor = 1.55; // Default Moderate
        switch (activityLevel) {
            case "Sedentary": activityFactor = 1.2; break;
            case "Light": activityFactor = 1.375; break;
            case "Moderate": activityFactor = 1.55; break;
            case "Active": activityFactor = 1.725; break;
            case "Very Active": activityFactor = 1.9; break;
        }
        double tdee = bmr * activityFactor;

        // 4. Goal Adjustment
        int targetCalories;
        if ("Weight Loss".equalsIgnoreCase(goal)) {
            targetCalories = (int) (tdee - 500);
        } else if ("Muscle Gain".equalsIgnoreCase(goal)) {
            targetCalories = (int) (tdee + 300);
        } else {
            targetCalories = (int) tdee;
        }
        targetCalories = Math.max(targetCalories, 1200); // Floor calorie target

        response.setDailyCalorieTarget(targetCalories);

        // 5. Macro splits
        Map<String, Integer> macros = new HashMap<>();
        if ("Muscle Gain".equalsIgnoreCase(goal)) {
            macros.put("protein", 35);
            macros.put("carbs", 40);
            macros.put("fat", 25);
        } else {
            macros.put("protein", 30);
            macros.put("carbs", 40);
            macros.put("fat", 30);
        }
        response.setMacroSplit(macros);

        // Check conditions/restrictions
        List<String> conditions = request.getConditions() != null ? request.getConditions() : new ArrayList<>();
        List<String> restrictions = request.getRestrictions() != null ? request.getRestrictions() : new ArrayList<>();

        boolean isDiabetic = conditions.stream().anyMatch(c -> c.toLowerCase().contains("diabet") || c.toLowerCase().contains("glycemic"));
        boolean isVegetarian = restrictions.contains("Vegetarian");
        boolean isVegan = restrictions.contains("Vegan");

        // 6. Generate Meal Plans
        List<DietPlanResponse.MealPlanDTO> meals = new ArrayList<>();

        // Breakfast
        DietPlanResponse.MealPlanDTO breakfast = new DietPlanResponse.MealPlanDTO();
        breakfast.setMealType("Breakfast");
        List<DietPlanResponse.MealItemDTO> breakfastItems = new ArrayList<>();
        DietPlanResponse.MealItemDTO b1 = new DietPlanResponse.MealItemDTO();
        b1.setName(isVegan ? "Overnight oats with almond milk and chia seeds" : "Steel-cut oatmeal with berries and walnuts");
        b1.setCalories((int) (targetCalories * 0.25));
        b1.setProtein(12.0);
        b1.setCarbs(45.0);
        b1.setFat(8.0);
        b1.setNotes("High fiber, sustained energy release.");
        breakfastItems.add(b1);

        DietPlanResponse.MealItemDTO b2 = new DietPlanResponse.MealItemDTO();
        b2.setName(isVegan ? "Coconut yogurt with granola" : "Greek yogurt parfait");
        b2.setCalories((int) (targetCalories * 0.05));
        b2.setProtein(10.0);
        b2.setCarbs(15.0);
        b2.setFat(3.0);
        b2.setNotes("Probiotic-rich for gut health.");
        breakfastItems.add(b2);

        breakfast.setItems(breakfastItems);
        breakfast.setTotalCalories(breakfastItems.stream().mapToInt(DietPlanResponse.MealItemDTO::getCalories).sum());
        meals.add(breakfast);

        // Lunch
        DietPlanResponse.MealPlanDTO lunch = new DietPlanResponse.MealPlanDTO();
        lunch.setMealType("Lunch");
        List<DietPlanResponse.MealItemDTO> lunchItems = new ArrayList<>();
        DietPlanResponse.MealItemDTO l1 = new DietPlanResponse.MealItemDTO();
        l1.setName(isVegetarian || isVegan ? "Chickpea and avocado quinoa bowl" : "Grilled chicken quinoa bowl");
        l1.setCalories((int) (targetCalories * 0.30));
        l1.setProtein(35.0);
        l1.setCarbs(50.0);
        l1.setFat(12.0);
        l1.setNotes("Complete amino acid profile.");
        lunchItems.add(l1);

        DietPlanResponse.MealItemDTO l2 = new DietPlanResponse.MealItemDTO();
        l2.setName("Mixed greens salad with olive oil dressing");
        l2.setCalories((int) (targetCalories * 0.05));
        l2.setProtein(3.0);
        l2.setCarbs(8.0);
        l2.setFat(7.0);
        l2.setNotes("Antioxidant-dense micronutrients.");
        lunchItems.add(l2);

        lunch.setItems(lunchItems);
        lunch.setTotalCalories(lunchItems.stream().mapToInt(DietPlanResponse.MealItemDTO::getCalories).sum());
        meals.add(lunch);

        // Dinner
        DietPlanResponse.MealPlanDTO dinner = new DietPlanResponse.MealPlanDTO();
        dinner.setMealType("Dinner");
        List<DietPlanResponse.MealItemDTO> dinnerItems = new ArrayList<>();
        DietPlanResponse.MealItemDTO d1 = new DietPlanResponse.MealItemDTO();
        d1.setName(isVegetarian || isVegan ? "Lentil curry with brown rice" : "Baked salmon with roasted vegetables");
        d1.setCalories((int) (targetCalories * 0.25));
        d1.setProtein(30.0);
        d1.setCarbs(35.0);
        d1.setFat(14.0);
        d1.setNotes(isVegetarian || isVegan ? "Plant-based complete protein." : "Omega-3 fatty acids.");
        dinnerItems.add(d1);

        DietPlanResponse.MealItemDTO d2 = new DietPlanResponse.MealItemDTO();
        d2.setName("Steamed broccoli and sweet potato");
        d2.setCalories((int) (targetCalories * 0.05));
        d2.setProtein(5.0);
        d2.setCarbs(25.0);
        d2.setFat(1.0);
        d2.setNotes("Vitamin C and complex carbohydrates.");
        dinnerItems.add(d2);

        dinner.setItems(dinnerItems);
        dinner.setTotalCalories(dinnerItems.stream().mapToInt(DietPlanResponse.MealItemDTO::getCalories).sum());
        meals.add(dinner);

        // Snack
        DietPlanResponse.MealPlanDTO snack = new DietPlanResponse.MealPlanDTO();
        snack.setMealType("Snack");
        List<DietPlanResponse.MealItemDTO> snackItems = new ArrayList<>();
        DietPlanResponse.MealItemDTO s1 = new DietPlanResponse.MealItemDTO();
        s1.setName("Apple slices with almond butter");
        s1.setCalories((int) (targetCalories * 0.03));
        s1.setProtein(4.0);
        s1.setCarbs(18.0);
        s1.setFat(8.0);
        s1.setNotes("Healthy fats and fiber.");
        snackItems.add(s1);

        DietPlanResponse.MealItemDTO s2 = new DietPlanResponse.MealItemDTO();
        s2.setName("Mixed nuts (almonds, cashews)");
        s2.setCalories((int) (targetCalories * 0.02));
        s2.setProtein(5.0);
        s2.setCarbs(6.0);
        s2.setFat(12.0);
        s2.setNotes("Heart-healthy monounsaturated fats.");
        snackItems.add(s2);

        snack.setItems(snackItems);
        snack.setTotalCalories(snackItems.stream().mapToInt(DietPlanResponse.MealItemDTO::getCalories).sum());
        meals.add(snack);

        response.setMeals(meals);

        // 7. Hydration Guidance
        String hydration = String.format("Aim for %.1f liters of water daily. Increase by 500ml on exercise days.", weight * 0.033);
        if (isDiabetic) {
            hydration += " Avoid sugary beverages; opt for water, herbal tea, or sugar-free electrolytes.";
        }
        response.setHydrationAdvice(hydration);

        // 8. Supplement Suggestions
        List<String> supplements = new ArrayList<>(Arrays.asList("Vitamin D3 (2000 IU daily)", "Omega-3 Fish Oil (1000mg)"));
        if (isVegan) {
            supplements.add("Vitamin B12 (1000mcg)");
        }
        if (isDiabetic) {
            supplements.add("Chromium Picolinate (200mcg) — consult your doctor");
        }
        response.setSupplementSuggestions(supplements);

        response.setDisclaimer("FALLBACK ADVISORY: AI Diet Planner service was unreachable. This is an algorithmic nutrition outline based on clinical guidelines. Consult a dietitian before starting any restrictive dietary regimen.");

        return response;
    }
}
