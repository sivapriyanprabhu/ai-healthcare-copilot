package com.healthcopilot.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String specialization;

    @Column(name = "license_number", nullable = false)
    private String licenseNumber;

    @Column(name = "hospital_affiliation")
    private String hospitalAffiliation;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Doctor() {}

    public Doctor(Long id, User user, String specialization, String licenseNumber, String hospitalAffiliation, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.user = user;
        this.specialization = specialization;
        this.licenseNumber = licenseNumber;
        this.hospitalAffiliation = hospitalAffiliation;
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

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getHospitalAffiliation() { return hospitalAffiliation; }
    public void setHospitalAffiliation(String hospitalAffiliation) { this.hospitalAffiliation = hospitalAffiliation; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static DoctorBuilder builder() { return new DoctorBuilder(); }

    public static class DoctorBuilder {
        private Long id;
        private User user;
        private String specialization;
        private String licenseNumber;
        private String hospitalAffiliation;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public DoctorBuilder id(Long id) { this.id = id; return this; }
        public DoctorBuilder user(User user) { this.user = user; return this; }
        public DoctorBuilder specialization(String specialization) { this.specialization = specialization; return this; }
        public DoctorBuilder licenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; return this; }
        public DoctorBuilder hospitalAffiliation(String hospitalAffiliation) { this.hospitalAffiliation = hospitalAffiliation; return this; }
        public DoctorBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public DoctorBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Doctor build() {
            return new Doctor(id, user, specialization, licenseNumber, hospitalAffiliation, createdAt, updatedAt);
        }
    }
}
