package com.job.portal.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "STUDENT_PROFILE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @Column(name = "USER_ID")
    private Long userId;

    @OneToOne(optional = false)
    @MapsId
    @JoinColumn(name = "USER_ID")
    private User user;

    @Column(name = "FULL_NAME", length = 200)
    private String fullName;

    @Column(name = "PHONE", length = 20)
    private String phone;

    @Column(name = "MAJOR", length = 100)
    private String major;

    @Column(name = "GRADUATION_YEAR")
    private Integer graduationYear;

    @Column(name = "LINKEDIN_URL", length = 500)
    private String linkedInUrl;

    @Column(name = "RESUME_URL", length = 500)
    private String resumeUrl;
}
