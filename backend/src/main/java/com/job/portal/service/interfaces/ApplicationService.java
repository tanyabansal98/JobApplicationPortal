package com.job.portal.service.interfaces;

import com.job.portal.model.Application;
import com.job.portal.model.enums.ApplicationStatus;

import java.util.List;

public interface ApplicationService {

    Application apply(Long studentUserId, Long jobId, String resumeUrl);

    Application withdraw(Long applicationId);

    Application updateStatus(Long applicationId, ApplicationStatus newStatus, String employerNotes);

    List<Application> getByStudent(Long studentUserId);

    List<Application> getByJob(Long jobId);

    List<Application> getByEmployer(Long employerUserId);

    List<Application> getAll();

    Application getById(Long applicationId);
}
