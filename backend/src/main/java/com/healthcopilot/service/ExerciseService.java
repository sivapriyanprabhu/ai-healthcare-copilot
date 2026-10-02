package com.healthcopilot.service;

import com.healthcopilot.dto.ExercisePlanRequest;
import com.healthcopilot.dto.ExercisePlanResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class ExerciseService {

    @Value("${app.ai-service.url:http://localhost:8000}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public ExercisePlanResponse generateExercisePlan(ExercisePlanRequest request) {
        try {
            String url = aiServiceUrl + "/api/ai/exercise/plan";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<ExercisePlanRequest> entity = new HttpEntity<>(request, headers);
            ResponseEntity<ExercisePlanResponse> response = restTemplate.postForEntity(url, entity, ExercisePlanResponse.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("AI Exercise Service call failed, using clinical fallback: " + e.getMessage());
        }

        return calculateFallbackExercisePlan(request);
    }

    private ExercisePlanResponse calculateFallbackExercisePlan(ExercisePlanRequest request) {
        ExercisePlanResponse response = new ExercisePlanResponse();
        String routineType = request.getRoutineType() != null ? request.getRoutineType().toLowerCase() : "yoga";
        String language = request.getLanguage() != null ? request.getLanguage().toLowerCase() : "en";
        response.setRoutineType(routineType);
        response.setLanguage(language);

        List<String> injuries = request.getInjuries() != null ? request.getInjuries() : new ArrayList<>();
        boolean hasKneeInjury = injuries.stream().anyMatch(i -> i.toLowerCase().contains("knee"));
        boolean hasBackInjury = injuries.stream().anyMatch(i -> i.toLowerCase().contains("back"));

        // Define Therapeutic Yoga Asanas
        List<ExercisePlanResponse.ExerciseItemDTO> yogaAsanas = new ArrayList<>();
        yogaAsanas.add(createYogaAsana(
                "Tadasana (Mountain Pose)", "Tāḍāsana", "Asana - Posture", 10, "Low", 30,
                Arrays.asList("Spine", "Ankles", "Core", "Pelvic Alignment"),
                "Stand tall with big toes touching, shoulders relaxed, spine lengthened. Distribute weight evenly across both feet while reaching crown toward the ceiling.",
                "Inhale deeply expanding the chest; exhale slowly while rooting your feet into the earth.",
                Arrays.asList("Improves spinal posture and vertebral alignment", "Strengthens thighs, knees, and ankles", "Reduces flat feet symptoms", "Enhances nervous system grounding and body awareness"),
                Arrays.asList("Avoid prolonged standing if experiencing severe headache or acute vertigo"),
                "tadasana", "https://www.youtube.com/watch?v=E1xym-F_B84", "E1xym-F_B84"
        ));

        yogaAsanas.add(createYogaAsana(
                "Vrikshasana (Tree Pose)", "Vṛkṣāsana", "Balance & Coordination", 10, "Low-Moderate", 35,
                Arrays.asList("Calves", "Glutes", "Adductors", "Proprioceptors"),
                "Shift weight onto left foot, place right sole against left inner thigh or calf (never directly on knee). Bring hands to heart center (Anjali Mudra) or extend overhead.",
                "Inhale length through your spine, exhale to stabilize through your rooted standing foot.",
                Arrays.asList("Improves neuromuscular balance and single-leg stability", "Strengthens hip abductors and stabilizing ligaments", "Enhances concentration and mental focus"),
                hasKneeInjury 
                    ? Arrays.asList("Place foot lower on inner calf rather than high on thigh to avoid lateral knee torque") 
                    : Arrays.asList("Do not press the foot against the side of the knee joint"),
                "vrikshasana", "https://www.youtube.com/watch?v=wdln9qWYloU", "wdln9qWYloU"
        ));

        yogaAsanas.add(createYogaAsana(
                "Bhujangasana (Cobra Pose)", "Bhujaṅgāsana", "Spinal Extension", 10, "Low-Moderate", 40,
                Arrays.asList("Spinal Extensors", "Chest", "Anterior Deltoids", "Abdominals"),
                "Lie prone, palms under shoulders, elbows hugged close to torso. Inhale and gently lift chest off the mat using back muscles rather than arm force.",
                "Inhale smoothly while lifting the sternum upward; exhale while lowering chest softly back down.",
                Arrays.asList("Strengthens deep erector spinae muscles", "Opens thoracic cage and expands lung capacity", "Stimulates adrenal glands and kidney perfusion", "Alleviates postural kyphosis and rounded shoulders"),
                hasBackInjury
                    ? Arrays.asList("Limit elevation to low Baby Cobra; keep elbows slightly bent and avoid hyperextension")
                    : Arrays.asList("Avoid in acute disc herniation or second/third trimester of pregnancy"),
                "bhujangasana", "https://www.youtube.com/watch?v=Y8UNFem5qHc", "Y8UNFem5qHc"
        ));

        yogaAsanas.add(createYogaAsana(
                "Balasana (Child's Pose)", "Bālāsana", "Restorative & Calming", 10, "Low", 25,
                Arrays.asList("Hips", "Lumbar Spine", "Ankles", "Nervous System"),
                "Kneel on the mat with big toes together, knees wide. Fold forward resting forehead on the mat, extending arms forward or alongside the body.",
                "Deep diaphragmatic breaths into the back ribs and lower abdomen to activate vagal parasympathetic tone.",
                Arrays.asList("Relieves lumbar muscle spasms and sacral compression", "Downregulates autonomic nervous system reducing cortisol", "Provides gentle resting stretch for hip capsules", "Promotes emotional relaxation and mental tranquility"),
                hasKneeInjury
                    ? Arrays.asList("Place a folded cushion behind knee creases to reduce acute flexion angle")
                    : Arrays.asList("Avoid if suffering from severe diarrhea or third trimester pregnancy without bolster"),
                "balasana", "https://www.youtube.com/watch?v=2MJGg-dUKh0", "2MJGg-dUKh0"
        ));

        yogaAsanas.add(createYogaAsana(
                "Setu Bandhasana (Bridge Pose)", "Setu Bandhāsana", "Thoracic & Pelvic", 10, "Moderate", 45,
                Arrays.asList("Gluteus Maximus", "Hamstrings", "Quadriceps", "Thyroid"),
                "Lie on back with knees bent, feet hip-width flat on mat. Inhale and press feet down to lift hips, interlacing fingers beneath the sacrum.",
                "Inhale lifting the pelvis toward the sky; exhale feeling grounding stability through soles of both feet.",
                Arrays.asList("Reverses prolonged sitting spinal flexed posture", "Stimulates thyroid and parathyroid endocrine function", "Strengthens posterior chain without knee compressive load", "Mild inversion that helps regulate resting systolic blood pressure"),
                Arrays.asList("Keep neck in neutral sagittal alignment; never turn head sideways while hips are lifted"),
                "setu_bandhasana", "https://www.youtube.com/watch?v=ju3-J4lIOVY", "ju3-J4lIOVY"
        ));

        yogaAsanas.add(createYogaAsana(
                "Anulom Vilom (Pranayama)", "Anuloma Viloma", "Pranayama & Breathing", 10, "Low", 20,
                Arrays.asList("Respiratory Muscles", "Diaphragm", "Autonomic Nervous System"),
                "Sit comfortably upright. Close right nostril with thumb, inhale slowly through left nostril (4 counts). Close left with ring finger, release right, exhale smoothly (8 counts). Reverse.",
                "Smooth, rhythmic 1:2 inhalation-to-exhalation cadence without straining breath holds.",
                Arrays.asList("Balances sympathetic and parasympathetic autonomic branches", "Optimizes arterial oxygen saturation and respiratory efficiency", "Lowers elevated heart rate variability and acute anxiety", "Helps clear nasal passages and bronchial airways"),
                Arrays.asList("Do not force long breath holds if suffering from uncontrolled acute hypertension"),
                "anulom_vilom", "https://www.youtube.com/watch?v=lrkW_6vGqvE", "lrkW_6vGqvE"
        ));

        // Define Base Cardio & Strength exercises
        List<ExercisePlanResponse.ExerciseItemDTO> cardioExercises = new ArrayList<>();
        cardioExercises.add(createExercise("Brisk Walking", 30, "Low", 150, Arrays.asList("Legs", "Core"), "Walk at a pace where you can talk but not sing. Maintain upright posture."));
        cardioExercises.add(createExercise("Stationary Cycling", 25, "Moderate", 200, Arrays.asList("Quadriceps", "Hamstrings", "Calves"), "Maintain 60-80 RPM cadence. Adjust resistance for moderate effort."));
        cardioExercises.add(createExercise("Swimming Laps", 30, "Moderate", 250, Arrays.asList("Full Body"), "Alternate between freestyle and backstroke. Excellent low-impact option."));

        List<ExercisePlanResponse.ExerciseItemDTO> strengthExercises = new ArrayList<>();
        if (!hasKneeInjury) {
            strengthExercises.add(createExercise("Bodyweight Squats", 10, "Moderate", 80, Arrays.asList("Quadriceps", "Glutes", "Core"), "Feet shoulder-width apart. Lower until thighs are parallel to ground. Keep knees behind toes."));
        } else {
            strengthExercises.add(createExercise("Seated Leg Press (Light)", 10, "Low", 40, Arrays.asList("Quadriceps"), "Use light resistance. Avoid full extension."));
        }
        strengthExercises.add(createExercise("Push-Ups (Modified)", 8, "Moderate", 60, Arrays.asList("Chest", "Triceps", "Shoulders"), "3 sets of 10-15 reps. Use knee push-ups if standard is too challenging."));
        if (!hasBackInjury) {
            strengthExercises.add(createExercise("Resistance Band Rows", 10, "Low-Moderate", 50, Arrays.asList("Back", "Biceps"), "Anchor band at chest height. Pull elbows back, squeezing shoulder blades together."));
        }

        // Build weekly schedule based on routineType
        Map<String, List<ExercisePlanResponse.ExerciseItemDTO>> schedule = new LinkedHashMap<>();
        String[] days = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"};

        int totalMins = 0;
        int totalCals = 0;

        for (int i = 0; i < days.length; i++) {
            String day = days[i];
            List<ExercisePlanResponse.ExerciseItemDTO> dayExercises = new ArrayList<>();

            if (i == 6) { // Sunday Rest / Gentle Pranayama
                if ("yoga".equals(routineType) || "combined".equals(routineType)) {
                    dayExercises.add(yogaAsanas.get(5)); // Anulom Vilom
                    dayExercises.add(yogaAsanas.get(3)); // Balasana
                } else {
                    dayExercises.add(createExercise("Active Recovery / Rest", 0, "Rest", 0, new ArrayList<>(), "Light stretching or complete rest day."));
                }
            } else if ("yoga".equals(routineType)) {
                // Curated Therapeutic Yoga flow
                int asanaIndex1 = i % yogaAsanas.size();
                int asanaIndex2 = (i + 2) % yogaAsanas.size();
                dayExercises.add(yogaAsanas.get(asanaIndex1));
                dayExercises.add(yogaAsanas.get(asanaIndex2));
            } else if ("combined".equals(routineType)) {
                // Yoga warm-up/cool-down + Cardio or Strength
                dayExercises.add(yogaAsanas.get(i % yogaAsanas.size()));
                if (i % 2 == 0) {
                    dayExercises.add(cardioExercises.get((i / 2) % cardioExercises.size()));
                } else {
                    dayExercises.add(strengthExercises.get(0));
                }
            } else { // Standard exercise
                if (i % 2 == 0) {
                    dayExercises.add(cardioExercises.get(i % cardioExercises.size()));
                    dayExercises.add(yogaAsanas.get(3)); // Balasana flexibility
                } else {
                    dayExercises.add(strengthExercises.get(0));
                    dayExercises.add(strengthExercises.get(1 % strengthExercises.size()));
                }
            }

            for (ExercisePlanResponse.ExerciseItemDTO ex : dayExercises) {
                totalMins += (ex.getDurationMinutes() != null ? ex.getDurationMinutes() : 0);
                totalCals += (ex.getCaloriesBurned() != null ? ex.getCaloriesBurned() : 0);
            }

            schedule.put(day, dayExercises);
        }

        response.setWeeklyPlan(schedule);
        response.setTotalWeeklyMinutes(totalMins);
        response.setEstimatedWeeklyCalories(totalCals);

        // Safety Tips
        List<String> safetyTips = new ArrayList<>(Arrays.asList(
                "Practice on an empty stomach or at least 2-3 hours after a full meal.",
                "Synchronize movement with breath: inhale during chest opening/extension, exhale during folding/flexion.",
                "Listen to your joint boundaries — stretch should feel therapeutic, never sharp or pinching.",
                "Stay hydrated before and after sessions; avoid gulping water during active pranayama."
        ));

        if (hasKneeInjury) {
            safetyTips.add("Knee sensitivity: Use a padded mat or folded blanket under knees during kneeling poses.");
        }
        if (hasBackInjury) {
            safetyTips.add("Spine care: Maintain gentle core engagement and avoid aggressive forward flexion or hyperextension.");
        }

        response.setSafetyTips(safetyTips);
        response.setDisclaimer("THERAPEUTIC YOGA & EXERCISE NOTICE: Algorithmic clinical physical guideline. Consult your physician or certified yoga therapist before beginning new physical routines.");

        return response;
    }

    private ExercisePlanResponse.ExerciseItemDTO createExercise(String name, int duration, String intensity, int calories, List<String> muscles, String instructions) {
        ExercisePlanResponse.ExerciseItemDTO ex = new ExercisePlanResponse.ExerciseItemDTO();
        ex.setName(name);
        ex.setDurationMinutes(duration);
        ex.setIntensityLevel(intensity);
        ex.setCaloriesBurned(calories);
        ex.setMuscleGroups(muscles);
        ex.setInstructions(instructions);
        return ex;
    }

    private ExercisePlanResponse.ExerciseItemDTO createYogaAsana(
            String name, String sanskritName, String category, int duration, String intensity, int calories,
            List<String> muscles, String instructions, String breathingCue, List<String> benefits, List<String> precautions,
            String imageUrl, String videoUrl, String videoEmbedId) {
        ExercisePlanResponse.ExerciseItemDTO ex = new ExercisePlanResponse.ExerciseItemDTO();
        ex.setName(name);
        ex.setSanskritName(sanskritName);
        ex.setCategory(category);
        ex.setDurationMinutes(duration);
        ex.setIntensityLevel(intensity);
        ex.setCaloriesBurned(calories);
        ex.setMuscleGroups(muscles);
        ex.setInstructions(instructions);
        ex.setBreathingCue(breathingCue);
        ex.setBenefits(benefits);
        ex.setPrecautions(precautions);
        ex.setImageUrl(imageUrl);
        ex.setVideoUrl(videoUrl);
        ex.setVideoEmbedId(videoEmbedId);
        return ex;
    }
}
