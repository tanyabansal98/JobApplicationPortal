package com.job.portal.model.enums;

/**
 * Application Status Enum — 16 states covering the full
 * end-to-end job application workflow lifecycle.
 *
 * Flow examples:
 * DRAFT → SUBMITTED → UNDER_REVIEW → SHORTLISTED → INTERVIEW_SCHEDULED
 * → INTERVIEW_COMPLETED → OFFER_EXTENDED → OFFER_ACCEPTED → HIRED
 *
 * SUBMITTED → UNDER_REVIEW → REJECTED
 * SUBMITTED → WITHDRAWN (by student)
 */
public enum ApplicationStatus {

    DRAFT, // Student started but hasn't submitted
    SUBMITTED, // Student submitted application
    PENDING, // Awaiting initial review
    UNDER_REVIEW, // Employer reviewing
    SHORTLISTED, // Employer shortlisted candidate
    INTERVIEW_SCHEDULED, // Interview date set
    INTERVIEW_COMPLETED, // Interview finished
    ASSESSMENT_PENDING, // Awaiting assessment/test
    ASSESSMENT_COMPLETED, // Assessment done
    OFFER_EXTENDED, // Job offer sent to student
    OFFER_ACCEPTED, // Student accepted the offer
    OFFER_DECLINED, // Student declined the offer
    HIRED, // Onboarding confirmed
    REJECTED, // Employer rejected application
    WITHDRAWN, // Student withdrew application
    ON_HOLD // Application paused
}
