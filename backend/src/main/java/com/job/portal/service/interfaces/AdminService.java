package com.job.portal.service.interfaces;

import com.job.portal.model.User;

import java.util.List;
import java.util.Map;

public interface AdminService {

    List<User> listAllUsers();

    void deactivateUser(Long userId);

    void activateUser(Long userId);

    Map<String, Object> getDashboardStats();
}
