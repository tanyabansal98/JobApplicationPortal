package com.job.portal.controller;

import com.job.portal.model.User;
import com.job.portal.model.enums.Role;
import com.job.portal.service.interfaces.UserService;
import com.job.portal.util.LogUtil;
import org.slf4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LogUtil.getLogger(AuthController.class);
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // POST /api/auth/register → register a new user
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            String roleStr = request.get("role");

            if (roleStr == null || roleStr.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Role is required (STUDENT, EMPLOYER, ADMIN)."));
            }

            Role role = Role.valueOf(roleStr.toUpperCase());
            User user = userService.register(email, password, role);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "User registered successfully.",
                    "userId", user.getUserId(),
                    "email", user.getEmail(),
                    "role", user.getRole().name()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Registration failed", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // POST /api/auth/login → simple login (password check)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");

            if (email == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required."));
            }

            User user = userService.findByEmail(email);

            if (!user.getIsActive()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Account is deactivated. Contact admin."));
            }

            // For now, return user info (JWT integration comes later)
            return ResponseEntity.ok(Map.of(
                    "message", "Login successful.",
                    "userId", user.getUserId(),
                    "email", user.getEmail(),
                    "role", user.getRole().name()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password."));
        } catch (Exception e) {
            log.error("Login failed", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
