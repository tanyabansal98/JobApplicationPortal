package com.job.portal.controller;

import com.job.portal.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DbTestController {

    @Autowired
    private JobRepository jobRepository;

    @GetMapping("/test-db")
    public Map<String, Object> testDatabaseConnection() {
        Map<String, Object> response = new HashMap<>();
        try {
            long jobCount = jobRepository.count();
            response.put("status", "SUCCESS");
            response.put("message", "Connected to Oracle 19c Cloud Database!");
            response.put("existing_job_count", jobCount);
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", "Handshake failed: " + e.getMessage());
        }
        return response;
    }
}
