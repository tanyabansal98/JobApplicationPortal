package com.job.portal.service.impl;

import com.job.portal.model.User;
import com.job.portal.repository.ApplicationRepository;
import com.job.portal.repository.JobRepository;
import com.job.portal.repository.UserRepository;
import com.job.portal.service.interfaces.AdminService;
import com.job.portal.service.interfaces.UserService;
import com.job.portal.util.LogUtil;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminServiceImpl implements AdminService {

    private static final Logger log = LogUtil.getLogger(AdminServiceImpl.class);
    private final UserService userService;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public AdminServiceImpl(UserService userService,
            UserRepository userRepository,
            JobRepository jobRepository,
            ApplicationRepository applicationRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    @Override
    public List<User> listAllUsers() {
        return userService.listAll();
    }

    @Override
    public void deactivateUser(Long userId) {
        userService.deactivateUser(userId);
    }

    @Override
    public void activateUser(Long userId) {
        userService.activateUser(userId);
    }

    @Override
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalJobs", jobRepository.count());
        stats.put("totalApplications", applicationRepository.count());
        stats.put("activeJobs", jobRepository.findByIsActiveTrue().size());
        log.debug("Dashboard stats: {}", stats);
        return stats;
    }
}
