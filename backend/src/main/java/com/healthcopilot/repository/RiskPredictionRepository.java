package com.healthcopilot.repository;

import com.healthcopilot.entity.Patient;
import com.healthcopilot.entity.RiskPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RiskPredictionRepository extends JpaRepository<RiskPrediction, Long> {
    List<RiskPrediction> findByPatientOrderByCreatedAtDesc(Patient patient);
}
