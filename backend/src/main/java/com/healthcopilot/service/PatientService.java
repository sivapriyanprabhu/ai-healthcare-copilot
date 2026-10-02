package com.healthcopilot.service;

import com.healthcopilot.dto.PatientProfileRequest;
import com.healthcopilot.dto.PatientProfileResponse;
import com.healthcopilot.entity.Patient;
import com.healthcopilot.entity.User;
import com.healthcopilot.repository.PatientRepository;
import com.healthcopilot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    public PatientProfileResponse getPatientProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        Patient patient = patientRepository.findByUser(user)
                .orElseGet(() -> patientRepository.save(Patient.builder().user(user).build()));

        return mapToResponse(patient);
    }

    @Transactional
    public PatientProfileResponse updatePatientProfile(String email, PatientProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
            userRepository.save(user);
        }

        Patient patient = patientRepository.findByUser(user)
                .orElseGet(() -> Patient.builder().user(user).build());

        if (request.getDateOfBirth() != null) patient.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) patient.setGender(request.getGender());
        if (request.getHeightCm() != null) patient.setHeightCm(request.getHeightCm());
        if (request.getWeightKg() != null) patient.setWeightKg(request.getWeightKg());
        if (request.getBloodGroup() != null) patient.setBloodGroup(request.getBloodGroup());
        if (request.getAllergies() != null) patient.setAllergies(request.getAllergies());
        if (request.getExistingConditions() != null) patient.setExistingConditions(request.getExistingConditions());
        if (request.getFamilyHistory() != null) patient.setFamilyHistory(request.getFamilyHistory());
        if (request.getSmokingStatus() != null) patient.setSmokingStatus(request.getSmokingStatus());
        if (request.getAlcoholStatus() != null) patient.setAlcoholStatus(request.getAlcoholStatus());
        if (request.getActivityLevel() != null) patient.setActivityLevel(request.getActivityLevel());
        if (request.getEmergencyContact() != null) patient.setEmergencyContact(request.getEmergencyContact());

        Patient updated = patientRepository.save(patient);
        return mapToResponse(updated);
    }

    public PatientProfileResponse mapToResponse(Patient patient) {
        Integer age = null;
        if (patient.getDateOfBirth() != null) {
            age = Period.between(patient.getDateOfBirth(), LocalDate.now()).getYears();
        }

        Double bmi = null;
        String bmiCategory = null;
        if (patient.getHeightCm() != null && patient.getHeightCm() > 0 && patient.getWeightKg() != null) {
            double heightM = patient.getHeightCm() / 100.0;
            bmi = Math.round((patient.getWeightKg() / (heightM * heightM)) * 10.0) / 10.0;

            if (bmi < 18.5) bmiCategory = "Underweight";
            else if (bmi < 25.0) bmiCategory = "Normal weight";
            else if (bmi < 30.0) bmiCategory = "Overweight";
            else bmiCategory = "Obese";
        }

        return PatientProfileResponse.builder()
                .patientId(patient.getId())
                .userId(patient.getUser().getId())
                .fullName(patient.getUser().getFullName())
                .email(patient.getUser().getEmail())
                .dateOfBirth(patient.getDateOfBirth())
                .age(age)
                .gender(patient.getGender())
                .heightCm(patient.getHeightCm())
                .weightKg(patient.getWeightKg())
                .bmi(bmi)
                .bmiCategory(bmiCategory)
                .bloodGroup(patient.getBloodGroup())
                .allergies(patient.getAllergies())
                .existingConditions(patient.getExistingConditions())
                .familyHistory(patient.getFamilyHistory())
                .smokingStatus(patient.getSmokingStatus())
                .alcoholStatus(patient.getAlcoholStatus())
                .activityLevel(patient.getActivityLevel())
                .emergencyContact(patient.getEmergencyContact())
                .build();
    }
}
