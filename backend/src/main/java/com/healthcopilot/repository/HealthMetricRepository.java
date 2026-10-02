package com.healthcopilot.repository;

import com.healthcopilot.entity.HealthMetric;
import com.healthcopilot.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface HealthMetricRepository extends JpaRepository<HealthMetric, Long> {
    List<HealthMetric> findByPatientOrderByRecordedAtDesc(Patient patient);
    List<HealthMetric> findTop30ByPatientOrderByRecordedAtDesc(Patient patient);
    Optional<HealthMetric> findFirstByPatientOrderByRecordedAtDesc(Patient patient);
}
