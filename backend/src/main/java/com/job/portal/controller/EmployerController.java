package com.job.portal.controller;

import com.job.portal.model.Application;
import com.job.portal.model.EmployerProfile;
import com.job.portal.model.Job;
import com.job.portal.model.User;
import com.job.portal.model.enums.ApplicationStatus;
import com.job.portal.service.interfaces.ApplicationService;
import com.job.portal.service.interfaces.EmployerProfileService;
import com.job.portal.service.interfaces.JobService;
import com.job.portal.service.interfaces.UserService;
import com.job.portal.util.LogUtil;
import org.slf4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employers")
public class EmployerController {

    private static final Logger log = LogUtil.getLogger(EmployerController.class);
    private final EmployerProfileService profileService;
    private final JobService jobService;
    private final ApplicationService applicationService;
    private final UserService userService;

    public EmployerController(EmployerProfileService profileService,
            JobService jobService,
            ApplicationService applicationService,
            UserService userService) {
        this.profileService = profileService;
        this.jobService = jobService;
        this.applicationService = applicationService;
        this.userService = userService;
    }

    // GET /api/employers/profile/{userId} → get employer profile
    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {
        try {
            EmployerProfile profile = profileService.getProfile(userId);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // POST /api/employers/profile → create employer profile
    @PostMapping("/profile")
    public ResponseEntity<?> createProfile(@RequestBody EmployerProfile profile) {
        try {
            EmployerProfile saved = profileService.createOrUpdateProfile(profile);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // PUT /api/employers/profile/{userId} → update employer profile
    @PutMapping("/profile/{userId}")
    public ResponseEntity<?> updateProfile(@PathVariable Long userId,
            @RequestBody EmployerProfile profile) {
        try {
            profile.setUserId(userId);
            EmployerProfile updated = profileService.createOrUpdateProfile(profile);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // POST /api/employers/jobs → post a new job
    @PostMapping("/jobs")
    public ResponseEntity<?> postJob(@RequestBody Job job) {
        try {
            Job created = jobService.createJob(job);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // PUT /api/employers/jobs/{jobId} → update a job
    @PutMapping("/jobs/{jobId}")
    public ResponseEntity<?> updateJob(@PathVariable Long jobId, @RequestBody Job job) {
        try {
            Job updated = jobService.updateJob(jobId, job);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE /api/employers/jobs/{jobId} → archive a job (soft delete)
    @DeleteMapping("/jobs/{jobId}")
    public ResponseEntity<?> deleteJob(@PathVariable Long jobId) {
        try {
            jobService.deleteJob(jobId);
            return ResponseEntity.ok(Map.of("message", "Job archived successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/employers/jobs/{userId} → list employer's jobs
    @GetMapping("/jobs/{userId}")
    public ResponseEntity<List<Job>> myJobs(@PathVariable Long userId) {
        return ResponseEntity.ok(jobService.listJobsByEmployer(userId));
    }

    // GET /api/employers/applications/{jobId} → view applications for a job
    @GetMapping("/applications/{jobId}")
    public ResponseEntity<List<Application>> viewApplications(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getByJob(jobId));
    }

    // PUT /api/employers/applications/{appId}/status → update application status
    @PutMapping("/applications/{appId}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Long appId,
            @RequestBody Map<String, String> request) {
        try {
            String statusStr = request.get("status");
            String notes = request.get("employerNotes");

            if (statusStr == null || statusStr.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Status is required."));
            }

            ApplicationStatus newStatus = ApplicationStatus.valueOf(statusStr.toUpperCase());
            Application updated = applicationService.updateStatus(appId, newStatus, notes);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
}
