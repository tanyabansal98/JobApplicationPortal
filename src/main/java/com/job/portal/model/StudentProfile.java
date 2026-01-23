package com.job.portal.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "STUDENT_PROFILE")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StudentProfile
    {
        @Id
        @Column(name = "USER_ID")
        private Long userId;

        @OneToOne(optional = false)
        @MapsId
        @JoinColumn(name = "USER_ID")
        private User user;

        @Column(name = "FULL_NAME", length = 200)
        private String fullName;

        @Column(name = "LINKEDIN_URL", length = 500)
        private String linkedInUrl;

        // keep it simple for now: store file path or URL
        @Column(name = "RESUME_URL", length = 500)
        private String resumeUrl;
    }
