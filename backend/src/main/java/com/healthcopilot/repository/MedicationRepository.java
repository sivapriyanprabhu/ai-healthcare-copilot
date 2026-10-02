package com.healthcopilot.repository;

import com.healthcopilot.entity.Medication;
import com.healthcopilot.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicationRepository extends JpaRepository<Medication, Long> {
    List<Medication> findByPatientOrderByCreatedAtDesc(Patient patient);
    List<Medication> findByPatientAndIsActiveTrueOrderByMedicationNameAsc(Patient patient);
}
