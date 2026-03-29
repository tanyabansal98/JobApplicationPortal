package com.job.portal.service.impl;

import com.job.portal.model.Application;
import com.job.portal.model.Job;
import com.job.portal.model.User;
import com.job.portal.model.enums.ApplicationStatus;
import com.job.portal.repository.ApplicationRepository;
import com.job.portal.repository.JobRepository;
import com.job.portal.repository.UserRepository;
import com.job.portal.service.BaseService;
import com.job.portal.service.interfaces.ApplicationService;
import com.job.portal.util.LogUtil;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * Application Service — manages the end-to-end job application workflow.
 *
 * Key feature: status transition validation (state machine)
 * ensures applications can only move through allowed states.
 */
@Service
public class ApplicationServiceImpl extends BaseService implements ApplicationService {

    private static final Logger log = LogUtil.getLogger(ApplicationServiceImpl.class);
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    // ── Allowed status transitions (state machine) ──
    private static final Map<ApplicationStatus, Set<ApplicationStatus>> ALLOWED_TRANSITIONS = new HashMap<>();

    static {
        ALLOWED_TRANSITIONS.put(ApplicationStatus.DRAFT,
                Set.of(ApplicationStatus.SUBMITTED, ApplicationStatus.WITHDRAWN));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.SUBMITTED,
                Set.of(ApplicationStatus.UNDER_REVIEW, ApplicationStatus.WITHDRAWN, ApplicationStatus.REJECTED));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.PENDING,
                Set.of(ApplicationStatus.UNDER_REVIEW, ApplicationStatus.WITHDRAWN, ApplicationStatus.REJECTED));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.UNDER_REVIEW,
                Set.of(ApplicationStatus.SHORTLISTED, ApplicationStatus.REJECTED, ApplicationStatus.ON_HOLD));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.SHORTLISTED,
                Set.of(ApplicationStatus.INTERVIEW_SCHEDULED, ApplicationStatus.REJECTED, ApplicationStatus.ON_HOLD));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.INTERVIEW_SCHEDULED,
                Set.of(ApplicationStatus.INTERVIEW_COMPLETED, ApplicationStatus.WITHDRAWN, ApplicationStatus.ON_HOLD));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.INTERVIEW_COMPLETED,
                Set.of(ApplicationStatus.ASSESSMENT_PENDING, ApplicationStatus.OFFER_EXTENDED,
                        ApplicationStatus.REJECTED));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.ASSESSMENT_PENDING,
                Set.of(ApplicationStatus.ASSESSMENT_COMPLETED, ApplicationStatus.ON_HOLD));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.ASSESSMENT_COMPLETED,
                Set.of(ApplicationStatus.OFFER_EXTENDED, ApplicationStatus.REJECTED));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.OFFER_EXTENDED,
                Set.of(ApplicationStatus.OFFER_ACCEPTED, ApplicationStatus.OFFER_DECLINED));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.OFFER_ACCEPTED,
                Set.of(ApplicationStatus.HIRED));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.ON_HOLD,
                Set.of(ApplicationStatus.UNDER_REVIEW, ApplicationStatus.SHORTLISTED, ApplicationStatus.REJECTED));
    }

    public ApplicationServiceImpl(ApplicationRepository applicationRepository,
            UserRepository userRepository,
            JobRepository jobRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
    }

    @Override
    @Transactional
    public Application apply(Long studentUserId, Long jobId, String resumeUrl) {
        log.debug("Student {} applying to job {}", studentUserId, jobId);

        // 1. Verify student exists
        User student = userRepository.findById(studentUserId)
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentUserId));

        // 2. Verify job exists and is active
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));
        if (!job.getIsActive()) {
            throw new IllegalArgumentException("Job is no longer active.");
        }

        // 3. Check for duplicate application
        if (applicationRepository.findByStudent_UserIdAndJob_JobId(studentUserId, jobId).isPresent()) {
            throw new IllegalArgumentException("You have already applied to this job.");
        }

        // 4. Create application
        Application app = Application.builder()
                .student(student)
                .job(job)
                .status(ApplicationStatus.SUBMITTED)
                .resumeUrlAtApply(resumeUrl)
                .build();

        Application saved = applicationRepository.save(app);
        log.info("Application created: id={}, student={}, job={}", saved.getApplicationId(), studentUserId, jobId);
        return saved;
    }

    @Override
    @Transactional
    public Application withdraw(Long applicationId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found: " + applicationId));

        // Validate transition
        validateTransition(app.getStatus(), ApplicationStatus.WITHDRAWN);

        app.setStatus(ApplicationStatus.WITHDRAWN);
        log.info("Application withdrawn: id={}", applicationId);
        return applicationRepository.save(app);
    }

    @Override
    @Transactional
    public Application updateStatus(Long applicationId, ApplicationStatus newStatus, String employerNotes) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found: " + applicationId));

        // Validate transition
        validateTransition(app.getStatus(), newStatus);

        app.setStatus(newStatus);
        if (employerNotes != null)
            app.setEmployerNotes(employerNotes);

        log.info("Application status updated: id={}, {} → {}", applicationId, app.getStatus(), newStatus);
        return applicationRepository.save(app);
    }

    @Override
    public List<Application> getByStudent(Long studentUserId) {
        return applicationRepository.findByStudent_UserId(studentUserId);
    }

    @Override
    public List<Application> getByJob(Long jobId) {
        return applicationRepository.findByJob_JobId(jobId);
    }

    @Override
    public List<Application> getByEmployer(Long employerUserId) {
        return applicationRepository.findByJob_Employer_UserId(employerUserId);
    }

    @Override
    public List<Application> getAll() {
        return applicationRepository.findAll();
    }

    @Override
    public Application getById(Long applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found: " + applicationId));
    }

    // ── Private: validate status transition ──
    private void validateTransition(ApplicationStatus current, ApplicationStatus target) {
        Set<ApplicationStatus> allowed = ALLOWED_TRANSITIONS.get(current);
        if (allowed == null || !allowed.contains(target)) {
            throw new IllegalArgumentException(
                    "Cannot transition from " + current + " to " + target + ".");
        }
    }
}
