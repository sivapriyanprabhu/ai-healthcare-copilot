package com.healthcopilot.dto;

public class MedicationDTO {
    private Long id;
    private String medicationName;
    private String dosage;
    private String frequency;
    private String timeOfDay;
    private String prescribingDoctor;
    private String startDate;
    private String endDate;
    private String purpose;
    private String sideEffects;
    private Boolean isActive;
    private Integer refillReminderDays;

    public MedicationDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public String getTimeOfDay() { return timeOfDay; }
    public void setTimeOfDay(String timeOfDay) { this.timeOfDay = timeOfDay; }

    public String getPrescribingDoctor() { return prescribingDoctor; }
    public void setPrescribingDoctor(String prescribingDoctor) { this.prescribingDoctor = prescribingDoctor; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public String getSideEffects() { return sideEffects; }
    public void setSideEffects(String sideEffects) { this.sideEffects = sideEffects; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Integer getRefillReminderDays() { return refillReminderDays; }
    public void setRefillReminderDays(Integer refillReminderDays) { this.refillReminderDays = refillReminderDays; }
}
