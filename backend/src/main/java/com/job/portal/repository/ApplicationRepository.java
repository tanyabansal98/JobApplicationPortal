package com.job.portal.repository;

import com.job.portal.model.Application;
import com.job.portal.model.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByStudent_UserId(Long studentUserId);

    Optional<Application> findByStudent_UserIdAndJob_JobId(Long studentUserId, Long jobId);

    List<Application> findByJob_JobId(Long jobId);

    List<Application> findByStatus(ApplicationStatus status);

    List<Application> findByJob_Employer_UserId(Long employerUserId);
}
