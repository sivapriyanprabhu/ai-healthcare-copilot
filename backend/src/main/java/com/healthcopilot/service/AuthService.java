package com.healthcopilot.service;

import com.healthcopilot.dto.LoginRequest;
import com.healthcopilot.dto.RegisterRequest;
import com.healthcopilot.dto.AuthResponse;
import com.healthcopilot.dto.UserDTO;
import com.healthcopilot.entity.Patient;
import com.healthcopilot.entity.Role;
import com.healthcopilot.entity.User;
import com.healthcopilot.repository.PatientRepository;
import com.healthcopilot.repository.RoleRepository;
import com.healthcopilot.repository.UserRepository;
import com.healthcopilot.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Pattern;

@Service
public class AuthService {

    private static final Pattern STRONG_PASSWORD_PATTERN = Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?~`]).{8,}$");

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public void validateStrongPassword(String password) {
        if (password == null || !STRONG_PASSWORD_PATTERN.matcher(password).matches()) {
            throw new RuntimeException("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
        }
    }

    public AuthResponse login(LoginRequest loginRequest) {
        validateStrongPassword(loginRequest.getPassword());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        String jwt = tokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"ROLE_PATIENT".equalsIgnoreCase(user.getRole().getName())) {
            throw new RuntimeException("Access denied: This portal is exclusively for patient accounts.");
        }

        return AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .user(UserDTO.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .role(user.getRole().getName())
                        .build())
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        validateStrongPassword(registerRequest.getPassword());

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        String roleName = "ROLE_PATIENT";
        Role role = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(Role.builder().name(roleName).build()));

        User user = User.builder()
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .fullName(registerRequest.getFullName())
                .role(role)
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        if ("ROLE_PATIENT".equalsIgnoreCase(roleName)) {
            Patient patient = Patient.builder()
                    .user(savedUser)
                    .build();
            patientRepository.save(patient);
        }

        String token = tokenProvider.generateTokenFromUsername(savedUser.getEmail());

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .user(UserDTO.builder()
                        .id(savedUser.getId())
                        .email(savedUser.getEmail())
                        .fullName(savedUser.getFullName())
                        .role(savedUser.getRole().getName())
                        .build())
                .build();
    }
}
