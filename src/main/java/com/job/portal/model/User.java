package com.job.portal.model;

import com.job.portal.model.enums.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "USERS")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User
    {
        @Id
        @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "users_seq_gen")
        @SequenceGenerator(name = "users_seq_gen", sequenceName = "USERS_SEQ", allocationSize = 1)
        @Column(name = "USER_ID")
        private Long userId;

        @Column(name = "EMAIL", nullable = false, unique = true, length = 200)
        private String email;

        @Column(name = "PASSWORD_HASH", nullable = false, length = 255)
        private String passwordHash;

        @Enumerated(EnumType.STRING)
        @Column(name = "ROLE", nullable = false, length = 30)
        private Role role;

        @Column(name = "IS_ACTIVE", nullable = false)
        private Boolean isActive;

    }
