package com.healthcopilot.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "medications")
public class Medication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "medication_name", nullable = false, length = 200)
    private String medicationName;

    @Column(name = "dosage", length = 100)
    private String dosage;

    @Column(name = "frequency", length = 100)
    private String frequency; // e.g., "Once Daily", "Twice Daily", "As Needed"

    @Column(name = "time_of_day")
    private LocalTime timeOfDay;

    @Column(name = "prescribing_doctor", length = 200)
    private String prescribingDoctor;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "purpose", columnDefinition = "TEXT")
    private String purpose;

    @Column(name = "side_effects", columnDefinition = "TEXT")
    private String sideEffects;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "refill_reminder_days")
    private Integer refillReminderDays;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Medication() {}

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public LocalTime getTimeOfDay() { return timeOfDay; }
    public void setTimeOfDay(LocalTime timeOfDay) { this.timeOfDay = timeOfDay; }

    public String getPrescribingDoctor() { return prescribingDoctor; }
    public void setPrescribingDoctor(String prescribingDoctor) { this.prescribingDoctor = prescribingDoctor; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public String getSideEffects() { return sideEffects; }
    public void setSideEffects(String sideEffects) { this.sideEffects = sideEffects; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Integer getRefillReminderDays() { return refillReminderDays; }
    public void setRefillReminderDays(Integer refillReminderDays) { this.refillReminderDays = refillReminderDays; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static MedicationBuilder builder() { return new MedicationBuilder(); }

    public static class MedicationBuilder {
        private Long id;
        private Patient patient;
        private String medicationName;
        private String dosage;
        private String frequency;
        private LocalTime timeOfDay;
        private String prescribingDoctor;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private String purpose;
        private String sideEffects;
        private Boolean isActive = true;
        private Integer refillReminderDays;

        public MedicationBuilder id(Long id) { this.id = id; return this; }
        public MedicationBuilder patient(Patient patient) { this.patient = patient; return this; }
        public MedicationBuilder medicationName(String medicationName) { this.medicationName = medicationName; return this; }
        public MedicationBuilder dosage(String dosage) { this.dosage = dosage; return this; }
        public MedicationBuilder frequency(String frequency) { this.frequency = frequency; return this; }
        public MedicationBuilder timeOfDay(LocalTime timeOfDay) { this.timeOfDay = timeOfDay; return this; }
        public MedicationBuilder prescribingDoctor(String prescribingDoctor) { this.prescribingDoctor = prescribingDoctor; return this; }
        public MedicationBuilder startDate(LocalDateTime startDate) { this.startDate = startDate; return this; }
        public MedicationBuilder endDate(LocalDateTime endDate) { this.endDate = endDate; return this; }
        public MedicationBuilder purpose(String purpose) { this.purpose = purpose; return this; }
        public MedicationBuilder sideEffects(String sideEffects) { this.sideEffects = sideEffects; return this; }
        public MedicationBuilder isActive(Boolean isActive) { this.isActive = isActive; return this; }
        public MedicationBuilder refillReminderDays(Integer refillReminderDays) { this.refillReminderDays = refillReminderDays; return this; }

        public Medication build() {
            Medication m = new Medication();
            m.id = this.id; m.patient = this.patient; m.medicationName = this.medicationName;
            m.dosage = this.dosage; m.frequency = this.frequency; m.timeOfDay = this.timeOfDay;
            m.prescribingDoctor = this.prescribingDoctor; m.startDate = this.startDate;
            m.endDate = this.endDate; m.purpose = this.purpose; m.sideEffects = this.sideEffects;
            m.isActive = this.isActive; m.refillReminderDays = this.refillReminderDays;
            return m;
        }
    }
}
