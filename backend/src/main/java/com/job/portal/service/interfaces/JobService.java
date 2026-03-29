package com.job.portal.service.interfaces;

import com.job.portal.model.Job;

import java.util.List;

public interface JobService {

    Job createJob(Job job);

    Job updateJob(Long jobId, Job job);

    void deleteJob(Long jobId);

    List<Job> listJobs(String title, String location);

    List<Job> listActiveJobs();

    List<Job> listJobsByEmployer(Long employerUserId);

    Job getJob(Long jobId);
}
