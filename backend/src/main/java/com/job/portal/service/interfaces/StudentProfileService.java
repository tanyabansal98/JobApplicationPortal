package com.job.portal.service.interfaces;

import com.job.portal.model.StudentProfile;

public interface StudentProfileService {

    StudentProfile getProfile(Long userId);

    StudentProfile createOrUpdateProfile(StudentProfile profile);
}
