package com.healthcopilot.repository;

import com.healthcopilot.entity.MedicalReport;
import com.healthcopilot.entity.MedicalReportValue;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicalReportValueRepository extends JpaRepository<MedicalReportValue, Long> {
    List<MedicalReportValue> findByReport(MedicalReport report);
}
