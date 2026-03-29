package com.job.portal.repository;

import com.job.portal.model.EmployerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployerProfileRepository extends JpaRepository<EmployerProfile, Long> {
}
