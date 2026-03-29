package com.job.portal.service.impl;

import com.job.portal.model.EmployerProfile;
import com.job.portal.model.User;
import com.job.portal.repository.EmployerProfileRepository;
import com.job.portal.repository.UserRepository;
import com.job.portal.service.BaseService;
import com.job.portal.service.ServiceHelper;
import com.job.portal.service.interfaces.EmployerProfileService;
import com.job.portal.util.LogUtil;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployerProfileServiceImpl extends BaseService implements EmployerProfileService {

    private static final Logger log = LogUtil.getLogger(EmployerProfileServiceImpl.class);
    private final EmployerProfileRepository profileRepository;
    private final UserRepository userRepository;

    public EmployerProfileServiceImpl(EmployerProfileRepository profileRepository,
            UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    // ── Override BaseService.validate() with company-name rules ──
    @Override
    public String validate(String input) {
        String baseError = super.validate(input);
        if (baseError != null)
            return baseError;

        if (input.trim().length() < 2) {
            return "Company name must be at least 2 characters.";
        }
        return null;
    }

    @Override
    public EmployerProfile getProfile(Long userId) {
        return profileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Employer profile not found for user: " + userId));
    }

    @Override
    @Transactional
    public EmployerProfile createOrUpdateProfile(EmployerProfile profile) {
        log.debug("Creating/updating employer profile for user: {}", profile.getUserId());

        // Validate company name
        if (!ServiceHelper.isBlank(profile.getCompanyName())) {
            String nameError = validate(profile.getCompanyName());
            if (nameError != null)
                throw new IllegalArgumentException(nameError);
            profile.setCompanyName(ServiceHelper.capitalizeName(profile.getCompanyName().trim()));
        }

        // Ensure user exists
        User user = userRepository.findById(profile.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + profile.getUserId()));
        profile.setUser(user);

        return profileRepository.save(profile);
    }
}
