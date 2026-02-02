package com.job.portal.service.interfaces;

import com.job.portal.model.Job;

import java.util.List;

public class JobService {
    List<Job> listJobs(String title, String location);
    Job getJob(Long jobId);
}
