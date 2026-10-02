package com.healthcopilot;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BCryptHashGeneratorTest {

    @Test
    public void testPasswords() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String currentHash = "$2a$10$e0MYzXyjpJS7Pd0RVvHwHe1g.9b9vJgQZ6aRkYv.zRjJ6N1kR9qGG";
        System.out.println("Matches Patient123!: " + encoder.matches("Patient123!", currentHash));
        System.out.println("Matches Doctor123!: " + encoder.matches("Doctor123!", currentHash));
        System.out.println("Matches Admin123!: " + encoder.matches("Admin123!", currentHash));
        System.out.println("Patient123! hash: " + encoder.encode("Patient123!"));
        System.out.println("Doctor123! hash: " + encoder.encode("Doctor123!"));
        System.out.println("Admin123! hash: " + encoder.encode("Admin123!"));
    }
}
