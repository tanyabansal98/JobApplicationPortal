package com.job.portal.service.impl;

import com.job.portal.model.Job;
import com.job.portal.model.User;
import com.job.portal.repository.JobRepository;
import com.job.portal.repository.UserRepository;
import com.job.portal.service.BaseService;
import com.job.portal.service.ServiceHelper;
import com.job.portal.service.interfaces.JobService;
import com.job.portal.util.LogUtil;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class JobServiceImpl extends BaseService implements JobService {

    private static final Logger log = LogUtil.getLogger(JobServiceImpl.class);
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobServiceImpl(JobRepository jobRepository, UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    // ── Override BaseService.validate() with job-title-specific rules ──
    @Override
    public String validate(String input) {
        String baseError = super.validate(input);
        if (baseError != null)
            return baseError;

        if (input.trim().length() < 3) {
            return "Job title must be at least 3 characters.";
        }
        if (input.trim().length() > 200) {
            return "Job title must not exceed 200 characters.";
        }
        return null;
    }

    @Override
    @Transactional
    public Job createJob(Job job) {
        log.debug("Creating job: title='{}'", job.getTitle());

        // 1. Validate title
        String titleError = validate(job.getTitle());
        if (titleError != null)
            throw new IllegalArgumentException(titleError);

        // 2. Sanitize
        job.setTitle(ServiceHelper.capitalizeName(job.getTitle().trim()));
        if (job.getLocation() != null)
            job.setLocation(job.getLocation().trim());

        // 3. Verify employer exists
        User employer = userRepository.findById(job.getEmployer().getUserId())
                .orElseThrow(() -> new RuntimeException("Employer not found: " + job.getEmployer().getUserId()));
        job.setEmployer(employer);

        Job saved = jobRepository.save(job);
        log.info("Job created: id={}, title='{}'", saved.getJobId(), saved.getTitle());
        return saved;
    }

    @Override
    @Transactional
    public Job updateJob(Long jobId, Job job) {
        log.debug("Updating job: id={}", jobId);

        Job existing = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        // Validate & sanitize title
        String titleError = validate(job.getTitle());
        if (titleError != null)
            throw new IllegalArgumentException(titleError);

        existing.setTitle(ServiceHelper.capitalizeName(job.getTitle().trim()));
        if (job.getLocation() != null)
            existing.setLocation(job.getLocation().trim());
        if (job.getJobType() != null)
            existing.setJobType(job.getJobType());
        if (job.getDescription() != null)
            existing.setDescription(job.getDescription());
        if (job.getDeadline() != null)
            existing.setDeadline(job.getDeadline());

        return jobRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        // Soft delete — set isActive to false
        job.setIsActive(false);
        jobRepository.save(job);
        log.info("Job archived (soft delete): id={}", jobId);
    }

    @Override
    public List<Job> listJobs(String title, String location) {
        log.debug("Listing jobs with filters title='{}', location='{}'", title, location);

        if (title != null && !title.isBlank())
            return jobRepository.findByTitleContainingIgnoreCase(title);
        if (location != null && !location.isBlank())
            return jobRepository.findByLocationContainingIgnoreCase(location);

        return jobRepository.findAll();
    }

    @Override
    public List<Job> listActiveJobs() {
        return jobRepository.findByIsActiveTrue();
    }

    @Override
    public List<Job> listJobsByEmployer(Long employerUserId) {
        return jobRepository.findByEmployer_UserId(employerUserId);
    }

    @Override
    public Job getJob(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));
    }
}
