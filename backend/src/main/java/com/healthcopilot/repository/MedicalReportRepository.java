package com.healthcopilot.repository;

import com.healthcopilot.entity.MedicalReport;
import com.healthcopilot.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicalReportRepository extends JpaRepository<MedicalReport, Long> {
    List<MedicalReport> findByPatientOrderByUploadedAtDesc(Patient patient);
    List<MedicalReport> findByPatientAndIdIn(Patient patient, List<Long> ids);
}
