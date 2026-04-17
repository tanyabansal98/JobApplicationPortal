package com.job.portal.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "JOBS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "jobs_seq_gen")
    @SequenceGenerator(name = "jobs_seq_gen", sequenceName = "JOBS_SEQ", allocationSize = 1)
    @Column(name = "JOB_ID")
    private Long jobId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "EMPLOYER_USER_ID", nullable = false)
    private User employer;

    @Column(name = "TITLE", nullable = false, length = 200)
    private String title;

    @Column(name = "LOCATION", length = 200)
    private String location;

    @Column(name = "JOB_TYPE", length = 50)
    private String jobType;

    @Column(name = "DESCRIPTION", length = 4000)
    private String description;

    @Column(name = "DEADLINE")
    private LocalDateTime deadline;

    @Column(name = "IS_ACTIVE", nullable = false)
    private Boolean isActive;

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

    @JsonProperty("displayCompanyName")
    public String getDisplayCompanyName() {
        if (employer != null && employer.getEmployerProfile() != null) {
            return "Boston - " + employer.getEmployerProfile().getCompanyName();
        }
        return "Boston - Unknown Company";
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.isActive == null)
            this.isActive = true;
    }
}
