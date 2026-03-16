package com.landify.controller;

// import com.landify.dto.ApiResponse;
import com.landify.common.response.ApiResponse;
import com.landify.dto.AuthResponse;
import com.landify.dto.LoginRequest;
import com.landify.dto.RegisterRequest;
import com.landify.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Object>> registerUser(@RequestBody RegisterRequest request) {
        String message = authService.register(request);
        return ResponseEntity.status(201)
                .body(ApiResponse.success(null, message));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> loginUser(@RequestBody LoginRequest request) {
        String token = authService.login(request);
        return ResponseEntity.ok(
                ApiResponse.success(new AuthResponse(token), "Login successful")
        );
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<String>> profile() {
        return ResponseEntity.ok(
                ApiResponse.success("Protected profile endpoint accessed", "Profile accessed")
        );
    }
}
