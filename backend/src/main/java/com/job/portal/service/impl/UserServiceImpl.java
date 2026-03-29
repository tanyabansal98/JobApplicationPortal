package com.job.portal.service.impl;

import com.job.portal.model.User;
import com.job.portal.model.enums.Role;
import com.job.portal.repository.UserRepository;
import com.job.portal.service.BaseService;
import com.job.portal.service.ServiceHelper;
import com.job.portal.service.interfaces.UserService;
import com.job.portal.util.LogUtil;
import org.slf4j.Logger;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserServiceImpl extends BaseService implements UserService {

    private static final Logger log = LogUtil.getLogger(UserServiceImpl.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ── Override BaseService.validate() with email-specific rules ──
    @Override
    public String validate(String input) {
        String baseError = super.validate(input);
        if (baseError != null)
            return baseError;

        if (!ServiceHelper.isValidEmail(input)) {
            return "Invalid email format: " + input;
        }
        return null;
    }

    @Override
    @Transactional
    public User register(String email, String password, Role role) {
        log.debug("Registering user with email='{}', role={}", email, role);

        // 1. Validate email
        String emailError = validate(email);
        if (emailError != null)
            throw new IllegalArgumentException(emailError);

        // 2. Normalize
        email = email.trim().toLowerCase();

        // 3. Check duplicate
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email '" + email + "' is already registered.");
        }

        // 4. Validate password
        if (ServiceHelper.isBlank(password) || password.length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters.");
        }

        // 5. Build and save
        User user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .role(role)
                .isActive(true)
                .build();

        User saved = userRepository.save(user);
        log.info("User registered: id={}, email={}, role={}", saved.getUserId(), saved.getEmail(), saved.getRole());
        return saved;
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @Override
    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
    }

    @Override
    public List<User> listAll() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public void deactivateUser(Long userId) {
        User user = findById(userId);
        user.setIsActive(false);
        userRepository.save(user);
        log.info("User deactivated: id={}", userId);
    }

    @Override
    @Transactional
    public void activateUser(Long userId) {
        User user = findById(userId);
        user.setIsActive(true);
        userRepository.save(user);
        log.info("User activated: id={}", userId);
    }
}
