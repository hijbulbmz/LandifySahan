package com.landify.landify_backend.controller;

import com.landify.landify_backend.dto.LoginRequest;
import com.landify.landify_backend.dto.SignupRequest;
import com.landify.landify_backend.model.User;
import com.landify.landify_backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    /**
     * POST /api/auth/signup
     */
    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@RequestBody SignupRequest request) {
        // ... (existing signup code)
        if (request.getOwnerName() == null || request.getOwnerName().isBlank() ||
                request.getEmail() == null || request.getEmail().isBlank() ||
                request.getPhone() == null || request.getPhone().isBlank() ||
                request.getPassword() == null || request.getPassword().isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "All fields are required."));
        }

        if (userRepository.existsByEmail(request.getEmail().toLowerCase())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email is already registered."));
        }

        User user = new User();
        user.setOwnerName(request.getOwnerName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPhone(request.getPhone().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("message", "Account created successfully."));
    }

    /**
     * POST /api/auth/login
     * Accepts: { email, password }
     * Returns: 200 OK — on success
     * 401 Unauthorized — on invalid credentials
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {

        if (request.getEmail() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required."));
        }

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail().toLowerCase().trim());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                // Return success and minimal user data
                return ResponseEntity.ok(Map.of(
                        "message", "Login successful",
                        "user", Map.of(
                                "id", user.getId(),
                                "ownerName", user.getOwnerName(),
                                "email", user.getEmail())));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid email or password."));
    }
}
