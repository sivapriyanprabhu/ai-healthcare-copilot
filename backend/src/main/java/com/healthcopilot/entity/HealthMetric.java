package com.healthcopilot.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_metrics")
public class HealthMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "systolic_bp")
    private Integer systolicBp;

    @Column(name = "diastolic_bp")
    private Integer diastolicBp;

    @Column(name = "glucose_mg_dl")
    private Double glucoseMgDl;

    @Column(name = "heart_rate_bpm")
    private Integer heartRateBpm;

    @Column(name = "weight_kg")
    private Double weightKg;

    @Column(name = "sleep_hours")
    private Double sleepHours;

    @Column(name = "water_intake_liters")
    private Double waterIntakeLiters;

    @Column(name = "exercise_minutes")
    private Integer exerciseMinutes;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt;

    public HealthMetric() {}

    public HealthMetric(Long id, Patient patient, Integer systolicBp, Integer diastolicBp, Double glucoseMgDl, Integer heartRateBpm, Double weightKg, Double sleepHours, Double waterIntakeLiters, Integer exerciseMinutes, LocalDateTime recordedAt) {
        this.id = id;
        this.patient = patient;
        this.systolicBp = systolicBp;
        this.diastolicBp = diastolicBp;
        this.glucoseMgDl = glucoseMgDl;
        this.heartRateBpm = heartRateBpm;
        this.weightKg = weightKg;
        this.sleepHours = sleepHours;
        this.waterIntakeLiters = waterIntakeLiters;
        this.exerciseMinutes = exerciseMinutes;
        this.recordedAt = recordedAt != null ? recordedAt : LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (recordedAt == null) {
            recordedAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Integer getSystolicBp() { return systolicBp; }
    public void setSystolicBp(Integer systolicBp) { this.systolicBp = systolicBp; }

    public Integer getDiastolicBp() { return diastolicBp; }
    public void setDiastolicBp(Integer diastolicBp) { this.diastolicBp = diastolicBp; }

    public Double getGlucoseMgDl() { return glucoseMgDl; }
    public void setGlucoseMgDl(Double glucoseMgDl) { this.glucoseMgDl = glucoseMgDl; }

    public Integer getHeartRateBpm() { return heartRateBpm; }
    public void setHeartRateBpm(Integer heartRateBpm) { this.heartRateBpm = heartRateBpm; }

    public Double getWeightKg() { return weightKg; }
    public void setWeightKg(Double weightKg) { this.weightKg = weightKg; }

    public Double getSleepHours() { return sleepHours; }
    public void setSleepHours(Double sleepHours) { this.sleepHours = sleepHours; }

    public Double getWaterIntakeLiters() { return waterIntakeLiters; }
    public void setWaterIntakeLiters(Double waterIntakeLiters) { this.waterIntakeLiters = waterIntakeLiters; }

    public Integer getExerciseMinutes() { return exerciseMinutes; }
    public void setExerciseMinutes(Integer exerciseMinutes) { this.exerciseMinutes = exerciseMinutes; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }

    public static HealthMetricBuilder builder() { return new HealthMetricBuilder(); }

    public static class HealthMetricBuilder {
        private Long id;
        private Patient patient;
        private Integer systolicBp;
        private Integer diastolicBp;
        private Double glucoseMgDl;
        private Integer heartRateBpm;
        private Double weightKg;
        private Double sleepHours;
        private Double waterIntakeLiters;
        private Integer exerciseMinutes;
        private LocalDateTime recordedAt;

        public HealthMetricBuilder id(Long id) { this.id = id; return this; }
        public HealthMetricBuilder patient(Patient patient) { this.patient = patient; return this; }
        public HealthMetricBuilder systolicBp(Integer systolicBp) { this.systolicBp = systolicBp; return this; }
        public HealthMetricBuilder diastolicBp(Integer diastolicBp) { this.diastolicBp = diastolicBp; return this; }
        public HealthMetricBuilder glucoseMgDl(Double glucoseMgDl) { this.glucoseMgDl = glucoseMgDl; return this; }
        public HealthMetricBuilder heartRateBpm(Integer heartRateBpm) { this.heartRateBpm = heartRateBpm; return this; }
        public HealthMetricBuilder weightKg(Double weightKg) { this.weightKg = weightKg; return this; }
        public HealthMetricBuilder sleepHours(Double sleepHours) { this.sleepHours = sleepHours; return this; }
        public HealthMetricBuilder waterIntakeLiters(Double waterIntakeLiters) { this.waterIntakeLiters = waterIntakeLiters; return this; }
        public HealthMetricBuilder exerciseMinutes(Integer exerciseMinutes) { this.exerciseMinutes = exerciseMinutes; return this; }
        public HealthMetricBuilder recordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; return this; }

        public HealthMetric build() {
            return new HealthMetric(id, patient, systolicBp, diastolicBp, glucoseMgDl, heartRateBpm, weightKg, sleepHours, waterIntakeLiters, exerciseMinutes, recordedAt);
        }
    }
}
