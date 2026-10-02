package com.healthcopilot.repository;

import com.healthcopilot.entity.RiskPrediction;
import com.healthcopilot.entity.RiskPredictionFactor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RiskPredictionFactorRepository extends JpaRepository<RiskPredictionFactor, Long> {
    List<RiskPredictionFactor> findByPrediction(RiskPrediction prediction);
}
