package com.job.portal.service.interfaces;

import com.job.portal.model.EmployerProfile;

public interface EmployerProfileService {

    EmployerProfile getProfile(Long userId);

    EmployerProfile createOrUpdateProfile(EmployerProfile profile);
}
