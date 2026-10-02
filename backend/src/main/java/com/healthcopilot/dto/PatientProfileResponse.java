package com.healthcopilot.dto;

import java.time.LocalDate;

public class PatientProfileResponse {
    private Long patientId;
    private Long userId;
    private String fullName;
    private String email;
    private LocalDate dateOfBirth;
    private Integer age;
    private String gender;
    private Double heightCm;
    private Double weightKg;
    private Double bmi;
    private String bmiCategory;
    private String bloodGroup;
    private String allergies;
    private String existingConditions;
    private String familyHistory;
    private String smokingStatus;
    private String alcoholStatus;
    private String activityLevel;
    private String emergencyContact;

    public PatientProfileResponse() {}

    public PatientProfileResponse(Long patientId, Long userId, String fullName, String email, LocalDate dateOfBirth, Integer age, String gender, Double heightCm, Double weightKg, Double bmi, String bmiCategory, String bloodGroup, String allergies, String existingConditions, String familyHistory, String smokingStatus, String alcoholStatus, String activityLevel, String emergencyContact) {
        this.patientId = patientId;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.dateOfBirth = dateOfBirth;
        this.age = age;
        this.gender = gender;
        this.heightCm = heightCm;
        this.weightKg = weightKg;
        this.bmi = bmi;
        this.bmiCategory = bmiCategory;
        this.bloodGroup = bloodGroup;
        this.allergies = allergies;
        this.existingConditions = existingConditions;
        this.familyHistory = familyHistory;
        this.smokingStatus = smokingStatus;
        this.alcoholStatus = alcoholStatus;
        this.activityLevel = activityLevel;
        this.emergencyContact = emergencyContact;
    }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public Double getHeightCm() { return heightCm; }
    public void setHeightCm(Double heightCm) { this.heightCm = heightCm; }

    public Double getWeightKg() { return weightKg; }
    public void setWeightKg(Double weightKg) { this.weightKg = weightKg; }

    public Double getBmi() { return bmi; }
    public void setBmi(Double bmi) { this.bmi = bmi; }

    public String getBmiCategory() { return bmiCategory; }
    public void setBmiCategory(String bmiCategory) { this.bmiCategory = bmiCategory; }

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

    public static PatientProfileResponseBuilder builder() { return new PatientProfileResponseBuilder(); }

    public static class PatientProfileResponseBuilder {
        private Long patientId;
        private Long userId;
        private String fullName;
        private String email;
        private LocalDate dateOfBirth;
        private Integer age;
        private String gender;
        private Double heightCm;
        private Double weightKg;
        private Double bmi;
        private String bmiCategory;
        private String bloodGroup;
        private String allergies;
        private String existingConditions;
        private String familyHistory;
        private String smokingStatus;
        private String alcoholStatus;
        private String activityLevel;
        private String emergencyContact;

        public PatientProfileResponseBuilder patientId(Long patientId) { this.patientId = patientId; return this; }
        public PatientProfileResponseBuilder userId(Long userId) { this.userId = userId; return this; }
        public PatientProfileResponseBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public PatientProfileResponseBuilder email(String email) { this.email = email; return this; }
        public PatientProfileResponseBuilder dateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public PatientProfileResponseBuilder age(Integer age) { this.age = age; return this; }
        public PatientProfileResponseBuilder gender(String gender) { this.gender = gender; return this; }
        public PatientProfileResponseBuilder heightCm(Double heightCm) { this.heightCm = heightCm; return this; }
        public PatientProfileResponseBuilder weightKg(Double weightKg) { this.weightKg = weightKg; return this; }
        public PatientProfileResponseBuilder bmi(Double bmi) { this.bmi = bmi; return this; }
        public PatientProfileResponseBuilder bmiCategory(String bmiCategory) { this.bmiCategory = bmiCategory; return this; }
        public PatientProfileResponseBuilder bloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; return this; }
        public PatientProfileResponseBuilder allergies(String allergies) { this.allergies = allergies; return this; }
        public PatientProfileResponseBuilder existingConditions(String existingConditions) { this.existingConditions = existingConditions; return this; }
        public PatientProfileResponseBuilder familyHistory(String familyHistory) { this.familyHistory = familyHistory; return this; }
        public PatientProfileResponseBuilder smokingStatus(String smokingStatus) { this.smokingStatus = smokingStatus; return this; }
        public PatientProfileResponseBuilder alcoholStatus(String alcoholStatus) { this.alcoholStatus = alcoholStatus; return this; }
        public PatientProfileResponseBuilder activityLevel(String activityLevel) { this.activityLevel = activityLevel; return this; }
        public PatientProfileResponseBuilder emergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; return this; }

        public PatientProfileResponse build() {
            return new PatientProfileResponse(patientId, userId, fullName, email, dateOfBirth, age, gender, heightCm, weightKg, bmi, bmiCategory, bloodGroup, allergies, existingConditions, familyHistory, smokingStatus, alcoholStatus, activityLevel, emergencyContact);
        }
    }
}
