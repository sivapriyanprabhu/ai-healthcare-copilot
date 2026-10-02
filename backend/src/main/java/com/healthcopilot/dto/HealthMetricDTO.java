package com.healthcopilot.dto;

import java.time.LocalDateTime;

public class HealthMetricDTO {
    private Long id;
    private Integer systolicBp;
    private Integer diastolicBp;
    private Double glucoseMgDl;
    private Integer heartRateBpm;
    private Double weightKg;
    private Double sleepHours;
    private Double waterIntakeLiters;
    private Integer exerciseMinutes;
    private LocalDateTime recordedAt;

    public HealthMetricDTO() {}

    public HealthMetricDTO(Long id, Integer systolicBp, Integer diastolicBp, Double glucoseMgDl, Integer heartRateBpm, Double weightKg, Double sleepHours, Double waterIntakeLiters, Integer exerciseMinutes, LocalDateTime recordedAt) {
        this.id = id;
        this.systolicBp = systolicBp;
        this.diastolicBp = diastolicBp;
        this.glucoseMgDl = glucoseMgDl;
        this.heartRateBpm = heartRateBpm;
        this.weightKg = weightKg;
        this.sleepHours = sleepHours;
        this.waterIntakeLiters = waterIntakeLiters;
        this.exerciseMinutes = exerciseMinutes;
        this.recordedAt = recordedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public static HealthMetricDTOBuilder builder() { return new HealthMetricDTOBuilder(); }

    public static class HealthMetricDTOBuilder {
        private Long id;
        private Integer systolicBp;
        private Integer diastolicBp;
        private Double glucoseMgDl;
        private Integer heartRateBpm;
        private Double weightKg;
        private Double sleepHours;
        private Double waterIntakeLiters;
        private Integer exerciseMinutes;
        private LocalDateTime recordedAt;

        public HealthMetricDTOBuilder id(Long id) { this.id = id; return this; }
        public HealthMetricDTOBuilder systolicBp(Integer systolicBp) { this.systolicBp = systolicBp; return this; }
        public HealthMetricDTOBuilder diastolicBp(Integer diastolicBp) { this.diastolicBp = diastolicBp; return this; }
        public HealthMetricDTOBuilder glucoseMgDl(Double glucoseMgDl) { this.glucoseMgDl = glucoseMgDl; return this; }
        public HealthMetricDTOBuilder heartRateBpm(Integer heartRateBpm) { this.heartRateBpm = heartRateBpm; return this; }
        public HealthMetricDTOBuilder weightKg(Double weightKg) { this.weightKg = weightKg; return this; }
        public HealthMetricDTOBuilder sleepHours(Double sleepHours) { this.sleepHours = sleepHours; return this; }
        public HealthMetricDTOBuilder waterIntakeLiters(Double waterIntakeLiters) { this.waterIntakeLiters = waterIntakeLiters; return this; }
        public HealthMetricDTOBuilder exerciseMinutes(Integer exerciseMinutes) { this.exerciseMinutes = exerciseMinutes; return this; }
        public HealthMetricDTOBuilder recordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; return this; }

        public HealthMetricDTO build() {
            return new HealthMetricDTO(id, systolicBp, diastolicBp, glucoseMgDl, heartRateBpm, weightKg, sleepHours, waterIntakeLiters, exerciseMinutes, recordedAt);
        }
    }
}
