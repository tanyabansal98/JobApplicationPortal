package com.job.portal.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "JOBS")
@Getter @Setter @NoArgsConstructor @Builder

public class Job
{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "jobs_seq_gen")
    @SequenceGenerator(name = "jobs_seq_gen", sequenceName = "JOBS_SEQ", allocationSize = 1)
    @Column(name = "JOB_ID")
    private Long jobId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "EMPLOYER_USER_ID", nullable = false)
    private User employer; // role should be EMPLOYER

    @Column(name = "TITLE", nullable = false, length = 200)
    private String title;

    @Column(name = "LOCATION", length = 200)
    private String location;

    @Column(name = "JOB_TYPE", length = 50) // e.g. COOP / INTERN
    private String jobType;

    @Column(name = "DESCRIPTION", length = 4000)
    private String description;

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;



}
