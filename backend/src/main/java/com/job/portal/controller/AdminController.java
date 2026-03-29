package com.job.portal.controller;

import com.job.portal.model.Application;
import com.job.portal.model.User;
import com.job.portal.service.interfaces.AdminService;
import com.job.portal.service.interfaces.ApplicationService;
import com.job.portal.util.LogUtil;
import org.slf4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private static final Logger log = LogUtil.getLogger(AdminController.class);
    private final AdminService adminService;
    private final ApplicationService applicationService;

    public AdminController(AdminService adminService, ApplicationService applicationService) {
        this.adminService = adminService;
        this.applicationService = applicationService;
    }

    // GET /api/admin/users → list all users
    @GetMapping("/users")
    public ResponseEntity<List<User>> listUsers() {
        return ResponseEntity.ok(adminService.listAllUsers());
    }

    // PUT /api/admin/users/{userId}/deactivate → deactivate a user
    @PutMapping("/users/{userId}/deactivate")
    public ResponseEntity<?> deactivateUser(@PathVariable Long userId) {
        try {
            adminService.deactivateUser(userId);
            return ResponseEntity.ok(Map.of("message", "User deactivated successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // PUT /api/admin/users/{userId}/activate → activate a user
    @PutMapping("/users/{userId}/activate")
    public ResponseEntity<?> activateUser(@PathVariable Long userId) {
        try {
            adminService.activateUser(userId);
            return ResponseEntity.ok(Map.of("message", "User activated successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/admin/dashboard → dashboard stats
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // GET /api/admin/applications → view all applications
    @GetMapping("/applications")
    public ResponseEntity<List<Application>> allApplications() {
        return ResponseEntity.ok(applicationService.getAll());
    }
}
