package com.job.portal.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "EMPLOYER_PROFILE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployerProfile {

    @Id
    @Column(name = "USER_ID")
    private Long userId;

    @OneToOne(optional = false)
    @MapsId
    @JoinColumn(name = "USER_ID")
    private User user;

    @Column(name = "COMPANY_NAME", length = 200)
    private String companyName;

    @Column(name = "INDUSTRY", length = 100)
    private String industry;

    @Column(name = "WEBSITE", length = 500)
    private String website;

    @Column(name = "DESCRIPTION", length = 2000)
    private String description;
}
