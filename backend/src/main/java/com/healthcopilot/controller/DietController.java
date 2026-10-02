package com.healthcopilot.controller;

import com.healthcopilot.dto.DietPlanRequest;
import com.healthcopilot.dto.DietPlanResponse;
import com.healthcopilot.service.DietService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/diet")
public class DietController {

    @Autowired
    private DietService dietService;

    @PostMapping("/plan")
    public ResponseEntity<DietPlanResponse> getDietPlan(@RequestBody DietPlanRequest request) {
        DietPlanResponse plan = dietService.generateDietPlan(request);
        return ResponseEntity.ok(plan);
    }
}
