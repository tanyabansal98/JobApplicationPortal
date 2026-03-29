package com.job.portal.service.interfaces;

import com.job.portal.model.User;
import com.job.portal.model.enums.Role;

import java.util.List;

public interface UserService {

    User register(String email, String password, Role role);

    User findByEmail(String email);

    User findById(Long userId);

    List<User> listAll();

    void deactivateUser(Long userId);

    void activateUser(Long userId);
}
