package com.healthcopilot.repository;

import com.healthcopilot.entity.Doctor;
import com.healthcopilot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUser(User user);
    Optional<Doctor> findByUserId(Long userId);
}
