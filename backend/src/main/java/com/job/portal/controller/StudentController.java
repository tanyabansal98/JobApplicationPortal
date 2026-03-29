package com.job.portal.controller;

import com.job.portal.model.Application;
import com.job.portal.model.Job;
import com.job.portal.model.StudentProfile;
import com.job.portal.service.interfaces.ApplicationService;
import com.job.portal.service.interfaces.JobService;
import com.job.portal.service.interfaces.StudentProfileService;
import com.job.portal.util.LogUtil;
import org.slf4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private static final Logger log = LogUtil.getLogger(StudentController.class);
    private final StudentProfileService profileService;
    private final JobService jobService;
    private final ApplicationService applicationService;

    public StudentController(StudentProfileService profileService,
            JobService jobService,
            ApplicationService applicationService) {
        this.profileService = profileService;
        this.jobService = jobService;
        this.applicationService = applicationService;
    }

    // GET /api/students/profile/{userId} → get student profile
    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {
        try {
            StudentProfile profile = profileService.getProfile(userId);
            return ResponseEntity.ok(profile);
        }

        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // POST /api/students/profile → create student profile
    @PostMapping("/profile")
    public ResponseEntity<?> createProfile(@RequestBody StudentProfile profile) {
        try {
            StudentProfile saved = profileService.createOrUpdateProfile(profile);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        }

        catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }

        catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // PUT /api/students/profile/{userId} → update student profile
    @PutMapping("/profile/{userId}")
    public ResponseEntity<?> updateProfile(@PathVariable Long userId,
            @RequestBody StudentProfile profile) {
        try {
            profile.setUserId(userId);
            StudentProfile updated = profileService.createOrUpdateProfile(profile);
            return ResponseEntity.ok(updated);
        }

        catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }

        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/students/jobs → browse all active jobs
    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> browseJobs() {
        return ResponseEntity.ok(jobService.listActiveJobs());
    }

    // POST /api/students/apply → apply to a job
    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody Map<String, Object> request) {
        try {
            Long studentUserId = Long.valueOf(request.get("studentUserId").toString());
            Long jobId = Long.valueOf(request.get("jobId").toString());
            String resumeUrl = request.get("resumeUrl") != null ? request.get("resumeUrl").toString() : null;

            Application app = applicationService.apply(studentUserId, jobId, resumeUrl);
            return ResponseEntity.status(HttpStatus.CREATED).body(app);
        }

        catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }

        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }

        catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE /api/students/withdraw/{appId} → withdraw application
    @DeleteMapping("/withdraw/{appId}")
    public ResponseEntity<?> withdraw(@PathVariable Long appId) {
        try {
            Application app = applicationService.withdraw(appId);
            return ResponseEntity.ok(Map.of("message", "Application withdrawn successfully.", "application", app));
        }

        catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }

        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/students/applications/{userId} → view own applications
    @GetMapping("/applications/{userId}")
    public ResponseEntity<List<Application>> myApplications(@PathVariable Long userId) {
        return ResponseEntity.ok(applicationService.getByStudent(userId));
    }
}
