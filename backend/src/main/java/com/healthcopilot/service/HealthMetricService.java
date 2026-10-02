package com.healthcopilot.service;

import com.healthcopilot.dto.DashboardSummaryDTO;
import com.healthcopilot.dto.HealthMetricDTO;
import com.healthcopilot.entity.HealthMetric;
import com.healthcopilot.entity.Patient;
import com.healthcopilot.entity.User;
import com.healthcopilot.repository.HealthMetricRepository;
import com.healthcopilot.repository.PatientRepository;
import com.healthcopilot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HealthMetricService {

    @Autowired
    private HealthMetricRepository healthMetricRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public HealthMetricDTO recordMetric(String email, HealthMetricDTO request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Patient patient = patientRepository.findByUser(user)
                .orElseGet(() -> patientRepository.save(Patient.builder().user(user).build()));

        HealthMetric metric = HealthMetric.builder()
                .patient(patient)
                .systolicBp(request.getSystolicBp())
                .diastolicBp(request.getDiastolicBp())
                .glucoseMgDl(request.getGlucoseMgDl())
                .heartRateBpm(request.getHeartRateBpm())
                .weightKg(request.getWeightKg())
                .sleepHours(request.getSleepHours())
                .waterIntakeLiters(request.getWaterIntakeLiters())
                .exerciseMinutes(request.getExerciseMinutes())
                .recordedAt(request.getRecordedAt() != null ? request.getRecordedAt() : LocalDateTime.now())
                .build();

        if (request.getWeightKg() != null && request.getWeightKg() > 0) {
            patient.setWeightKg(request.getWeightKg());
            patientRepository.save(patient);
        }

        HealthMetric saved = healthMetricRepository.save(metric);
        return mapToDTO(saved);
    }

    public List<HealthMetricDTO> getPatientMetricHistory(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Patient patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));

        return healthMetricRepository.findByPatientOrderByRecordedAtDesc(patient).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public DashboardSummaryDTO getDashboardSummary(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Patient patient = patientRepository.findByUser(user)
                .orElseGet(() -> patientRepository.save(Patient.builder().user(user).build()));

        List<HealthMetric> metrics = healthMetricRepository.findTop30ByPatientOrderByRecordedAtDesc(patient);
        HealthMetric latest = metrics.isEmpty() ? null : metrics.get(0);

        Double weightKg = (latest != null && latest.getWeightKg() != null) ? latest.getWeightKg() : patient.getWeightKg();
        Double bmi = null;
        String bmiCategory = null;
        if (patient.getHeightCm() != null && patient.getHeightCm() > 0 && weightKg != null) {
            double hM = patient.getHeightCm() / 100.0;
            bmi = Math.round((weightKg / (hM * hM)) * 10.0) / 10.0;
            if (bmi < 18.5) bmiCategory = "Underweight";
            else if (bmi < 25.0) bmiCategory = "Normal weight";
            else if (bmi < 30.0) bmiCategory = "Overweight";
            else bmiCategory = "Obese";
        }

        int score = 0;
        String scoreStatus;
        List<String> insights = new ArrayList<>();

        if (latest == null) {
            // New user with no recorded health metrics
            score = 0;
            scoreStatus = "No Data Yet";
            insights.add("Welcome! No health metrics have been recorded yet.");
            insights.add("Log your daily vitals or upload a medical test report to calculate your personalized wellness score.");
        } else {
            // Dynamic health score calculation (0 - 100) based on clinical thresholds
            int bpScore = 20;
            if (latest.getSystolicBp() != null) {
                int sys = latest.getSystolicBp();
                Integer dia = latest.getDiastolicBp();
                if (sys < 90 || (dia != null && dia < 60)) {
                    bpScore = 12;
                    insights.add("Low Blood Pressure reading (" + sys + (dia != null ? "/" + dia : "") + " mmHg). Maintain hydration.");
                } else if (sys <= 120 && (dia == null || dia <= 80)) {
                    bpScore = 25;
                } else if (sys <= 129 && (dia == null || dia <= 80)) {
                    bpScore = 20;
                    insights.add("Slightly elevated systolic BP (" + sys + " mmHg). Track sodium intake.");
                } else if (sys <= 139 || (dia != null && dia <= 89)) {
                    bpScore = 14;
                    insights.add("Stage 1 Hypertension reading (" + sys + (dia != null ? "/" + dia : "") + " mmHg). Regular BP tracking recommended.");
                } else if (sys <= 179 || (dia != null && dia <= 119)) {
                    bpScore = 7;
                    insights.add("Stage 2 Hypertension reading (" + sys + (dia != null ? "/" + dia : "") + " mmHg). Clinical consultation advised.");
                } else {
                    bpScore = 2;
                    insights.add("Critical Blood Pressure spike (" + sys + (dia != null ? "/" + dia : "") + " mmHg). Seek urgent medical care.");
                }
            }

            int glucoseScore = 20;
            if (latest.getGlucoseMgDl() != null) {
                double glu = latest.getGlucoseMgDl();
                if (glu < 70) {
                    glucoseScore = 10;
                    insights.add("Low blood glucose (" + glu + " mg/dL). Ensure consistent meals.");
                } else if (glu <= 99) {
                    glucoseScore = 25;
                } else if (glu <= 125) {
                    glucoseScore = 16;
                    insights.add("Fasting Blood Glucose (" + glu + " mg/dL) is in pre-diabetic range. Focus on low-glycemic foods.");
                } else if (glu <= 199) {
                    glucoseScore = 8;
                    insights.add("Elevated Blood Glucose (" + glu + " mg/dL). Discuss management with your doctor.");
                } else {
                    glucoseScore = 3;
                    insights.add("High Blood Glucose alert (" + glu + " mg/dL). Immediate follow-up advised.");
                }
            }

            int hrScore = 16;
            if (latest.getHeartRateBpm() != null) {
                int hr = latest.getHeartRateBpm();
                if (hr >= 60 && hr <= 85) {
                    hrScore = 20;
                } else if (hr > 85 && hr <= 100) {
                    hrScore = 16;
                } else if (hr >= 50 && hr < 60) {
                    hrScore = 15;
                } else if (hr > 100 && hr <= 120) {
                    hrScore = 8;
                    insights.add("Elevated resting heart rate (" + hr + " BPM). Practice relaxation techniques.");
                } else {
                    hrScore = 4;
                    insights.add("Abnormal heart rate (" + hr + " BPM). Clinical assessment advised if recurring.");
                }
            }

            int sleepScore = 8;
            if (latest.getSleepHours() != null) {
                double sleep = latest.getSleepHours();
                if (sleep >= 7.0 && sleep <= 9.0) {
                    sleepScore = 10;
                } else if (sleep >= 6.0 && sleep < 7.0 || (sleep > 9.0 && sleep <= 10.0)) {
                    sleepScore = 7;
                } else {
                    sleepScore = 3;
                    insights.add("Suboptimal sleep recorded (" + sleep + " hrs). Target 7-9 hours of nightly rest.");
                }
            }

            int waterScore = 8;
            if (latest.getWaterIntakeLiters() != null) {
                double water = latest.getWaterIntakeLiters();
                if (water >= 2.5) {
                    waterScore = 10;
                } else if (water >= 2.0) {
                    waterScore = 8;
                } else if (water >= 1.5) {
                    waterScore = 5;
                } else {
                    waterScore = 2;
                    insights.add("Daily hydration (" + water + " L) is low. Aim for at least 2.0 - 2.5 liters daily.");
                }
            }

            int exScore = 8;
            if (latest.getExerciseMinutes() != null) {
                int ex = latest.getExerciseMinutes();
                if (ex >= 30) {
                    exScore = 10;
                } else if (ex >= 15) {
                    exScore = 7;
                } else {
                    exScore = 3;
                }
            }

            score = Math.max(10, Math.min(100, bpScore + glucoseScore + hrScore + sleepScore + waterScore + exScore));

            if (score >= 85) {
                scoreStatus = "Optimal";
            } else if (score >= 70) {
                scoreStatus = "Good";
            } else if (score >= 50) {
                scoreStatus = "Moderate Caution";
            } else {
                scoreStatus = "Requires Attention";
            }

            if (insights.isEmpty()) {
                insights.add("Your recorded health metrics remain within target clinical ranges.");
                insights.add("Maintain consistent hydration and 30 minutes of daily moderate activity.");
            }
        }

        return DashboardSummaryDTO.builder()
                .patientName(user.getFullName())
                .healthScore(score)
                .healthScoreStatus(scoreStatus)
                .bmi(bmi)
                .bmiCategory(bmiCategory)
                .latestMetric(latest != null ? mapToDTO(latest) : null)
                .metricHistory(metrics.stream().map(this::mapToDTO).collect(Collectors.toList()))
                .aiInsights(insights)
                .build();
    }

    private HealthMetricDTO mapToDTO(HealthMetric metric) {
        return HealthMetricDTO.builder()
                .id(metric.getId())
                .systolicBp(metric.getSystolicBp())
                .diastolicBp(metric.getDiastolicBp())
                .glucoseMgDl(metric.getGlucoseMgDl())
                .heartRateBpm(metric.getHeartRateBpm())
                .weightKg(metric.getWeightKg())
                .sleepHours(metric.getSleepHours())
                .waterIntakeLiters(metric.getWaterIntakeLiters())
                .exerciseMinutes(metric.getExerciseMinutes())
                .recordedAt(metric.getRecordedAt())
                .build();
    }
}
