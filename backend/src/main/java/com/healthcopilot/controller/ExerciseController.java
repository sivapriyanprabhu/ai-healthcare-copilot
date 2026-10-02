package com.healthcopilot.controller;

import com.healthcopilot.dto.ExercisePlanRequest;
import com.healthcopilot.dto.ExercisePlanResponse;
import com.healthcopilot.service.ExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/exercise")
public class ExerciseController {

    @Autowired
    private ExerciseService exerciseService;

    @PostMapping("/plan")
    public ResponseEntity<ExercisePlanResponse> getExercisePlan(@RequestBody ExercisePlanRequest request) {
        ExercisePlanResponse plan = exerciseService.generateExercisePlan(request);
        return ResponseEntity.ok(plan);
    }
}
