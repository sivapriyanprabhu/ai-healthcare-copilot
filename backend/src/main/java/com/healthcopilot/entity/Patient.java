package com.healthcopilot.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    private String gender;
    
    @Column(name = "height_cm")
    private Double heightCm;
    
    @Column(name = "weight_kg")
    private Double weightKg;
    
    @Column(name = "blood_group", length = 10)
    private String bloodGroup;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    @Column(name = "existing_conditions", columnDefinition = "TEXT")
    private String existingConditions;

    @Column(name = "family_history", columnDefinition = "TEXT")
    private String familyHistory;

    @Column(name = "smoking_status")
    private String smokingStatus;

    @Column(name = "alcohol_status")
    private String alcoholStatus;

    @Column(name = "activity_level")
    private String activityLevel;

    @Column(name = "emergency_contact")
    private String emergencyContact;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Patient() {}

    public Patient(Long id, User user, LocalDate dateOfBirth, String gender, Double heightCm, Double weightKg, String bloodGroup, String allergies, String existingConditions, String familyHistory, String smokingStatus, String alcoholStatus, String activityLevel, String emergencyContact, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.user = user;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.heightCm = heightCm;
        this.weightKg = weightKg;
        this.bloodGroup = bloodGroup;
        this.allergies = allergies;
        this.existingConditions = existingConditions;
        this.familyHistory = familyHistory;
        this.smokingStatus = smokingStatus;
        this.alcoholStatus = alcoholStatus;
        this.activityLevel = activityLevel;
        this.emergencyContact = emergencyContact;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public Double getHeightCm() { return heightCm; }
    public void setHeightCm(Double heightCm) { this.heightCm = heightCm; }

    public Double getWeightKg() { return weightKg; }
    public void setWeightKg(Double weightKg) { this.weightKg = weightKg; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }

    public String getExistingConditions() { return existingConditions; }
    public void setExistingConditions(String existingConditions) { this.existingConditions = existingConditions; }

    public String getFamilyHistory() { return familyHistory; }
    public void setFamilyHistory(String familyHistory) { this.familyHistory = familyHistory; }

    public String getSmokingStatus() { return smokingStatus; }
    public void setSmokingStatus(String smokingStatus) { this.smokingStatus = smokingStatus; }

    public String getAlcoholStatus() { return alcoholStatus; }
    public void setAlcoholStatus(String alcoholStatus) { this.alcoholStatus = alcoholStatus; }

    public String getActivityLevel() { return activityLevel; }
    public void setActivityLevel(String activityLevel) { this.activityLevel = activityLevel; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static PatientBuilder builder() { return new PatientBuilder(); }

    public static class PatientBuilder {
        private Long id;
        private User user;
        private LocalDate dateOfBirth;
        private String gender;
        private Double heightCm;
        private Double weightKg;
        private String bloodGroup;
        private String allergies;
        private String existingConditions;
        private String familyHistory;
        private String smokingStatus;
        private String alcoholStatus;
        private String activityLevel;
        private String emergencyContact;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public PatientBuilder id(Long id) { this.id = id; return this; }
        public PatientBuilder user(User user) { this.user = user; return this; }
        public PatientBuilder dateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public PatientBuilder gender(String gender) { this.gender = gender; return this; }
        public PatientBuilder heightCm(Double heightCm) { this.heightCm = heightCm; return this; }
        public PatientBuilder weightKg(Double weightKg) { this.weightKg = weightKg; return this; }
        public PatientBuilder bloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; return this; }
        public PatientBuilder allergies(String allergies) { this.allergies = allergies; return this; }
        public PatientBuilder existingConditions(String existingConditions) { this.existingConditions = existingConditions; return this; }
        public PatientBuilder familyHistory(String familyHistory) { this.familyHistory = familyHistory; return this; }
        public PatientBuilder smokingStatus(String smokingStatus) { this.smokingStatus = smokingStatus; return this; }
        public PatientBuilder alcoholStatus(String alcoholStatus) { this.alcoholStatus = alcoholStatus; return this; }
        public PatientBuilder activityLevel(String activityLevel) { this.activityLevel = activityLevel; return this; }
        public PatientBuilder emergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; return this; }
        public PatientBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public PatientBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Patient build() {
            return new Patient(id, user, dateOfBirth, gender, heightCm, weightKg, bloodGroup, allergies, existingConditions, familyHistory, smokingStatus, alcoholStatus, activityLevel, emergencyContact, createdAt, updatedAt);
        }
    }
}
