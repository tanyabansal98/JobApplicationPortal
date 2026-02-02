package com.job.portal.service.impl;

import com.job.portal.model.Job;
import com.job.portal.repository.JobRepository;
import com.job.portal.service.interfaces.JobService;
import com.job.portal.util.LogUtil;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobServiceImpl implements JobService {
   
    private static final Logger log = LogUtil.getLogger(JobServiceImpl.class);
    private final JobRepository jobRepository;

    public JobServiceImpl(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @Override
    public List<Job> listJobs(String title, String location) {
        log.debug("Listing jobs with filters title='{}', location='{}'", title, location);

        if (title != null && !title.isBlank()) return jobRepository.findByTitleContainingIgnoreCase(title);
        if (location != null && !location.isBlank()) return jobRepository.findByLocationContainingIgnoreCase(location);

        return jobRepository.findAll();
    }

    @Override
    public Job getJob(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));
    }
}
