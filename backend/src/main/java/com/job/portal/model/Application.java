package com.job.portal.model;

import com.job.portal.model.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "APPLICATIONS", uniqueConstraints = @UniqueConstraint(name = "UK_APP_STUDENT_JOB", columnNames = {
        "STUDENT_USER_ID", "JOB_ID" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "apps_seq_gen")
    @SequenceGenerator(name = "apps_seq_gen", sequenceName = "APPLICATIONS_SEQ", allocationSize = 1)
    @Column(name = "APPLICATION_ID")
    private Long applicationId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "STUDENT_USER_ID", nullable = false)
    private User student;

    @ManyToOne(optional = false)
    @JoinColumn(name = "JOB_ID", nullable = false)
    private Job job;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false, length = 30)
    private ApplicationStatus status;

    @Column(name = "APPLIED_AT", nullable = false)
    private LocalDateTime appliedAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    @Column(name = "RESUME_URL_AT_APPLY", length = 500)
    private String resumeUrlAtApply;

    @Column(name = "EMPLOYER_NOTES", length = 2000)
    private String employerNotes;

    @PrePersist
    protected void onCreate() {
        this.appliedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null)
            this.status = ApplicationStatus.SUBMITTED;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
