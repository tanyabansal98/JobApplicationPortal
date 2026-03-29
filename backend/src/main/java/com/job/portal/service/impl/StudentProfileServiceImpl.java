package com.job.portal.service.impl;

import com.job.portal.model.StudentProfile;
import com.job.portal.model.User;
import com.job.portal.repository.StudentProfileRepository;
import com.job.portal.repository.UserRepository;
import com.job.portal.service.BaseService;
import com.job.portal.service.ServiceHelper;
import com.job.portal.service.interfaces.StudentProfileService;
import com.job.portal.util.LogUtil;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentProfileServiceImpl extends BaseService implements StudentProfileService {

    private static final Logger log = LogUtil.getLogger(StudentProfileServiceImpl.class);
    private final StudentProfileRepository profileRepository;
    private final UserRepository userRepository;

    public StudentProfileServiceImpl(StudentProfileRepository profileRepository,
            UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    // ── Override BaseService.validate() with name-specific rules ──
    @Override
    public String validate(String input) {
        String baseError = super.validate(input);
        if (baseError != null)
            return baseError;

        if (input.trim().length() < 2) {
            return "Name must be at least 2 characters.";
        }
        return null;
    }

    @Override
    public StudentProfile getProfile(Long userId) {
        return profileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Student profile not found for user: " + userId));
    }

    @Override
    @Transactional
    public StudentProfile createOrUpdateProfile(StudentProfile profile) {
        log.debug("Creating/updating student profile for user: {}", profile.getUserId());

        // Validate name
        if (!ServiceHelper.isBlank(profile.getFullName())) {
            String nameError = validate(profile.getFullName());
            if (nameError != null)
                throw new IllegalArgumentException(nameError);
            profile.setFullName(ServiceHelper.capitalizeName(profile.getFullName().trim()));
        }

        // Ensure user exists
        User user = userRepository.findById(profile.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + profile.getUserId()));
        profile.setUser(user);

        return profileRepository.save(profile);
    }
}
