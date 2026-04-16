// ─────────────────────────────────────────────────────────────────────────────
// Shared utility: maps an application status string to a Badge colour variant.
// Used by both MyApplications and ViewCandidates pages.
// ─────────────────────────────────────────────────────────────────────────────

export type StatusVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

export const getStatusVariant = (status: string): StatusVariant => {
    switch (status) {
        case 'SUBMITTED':
        case 'PENDING': return 'info';

        case 'UNDER_REVIEW':
        case 'SHORTLISTED': return 'warning';

        case 'OFFER_EXTENDED':
        case 'HIRED':
        case 'OFFER_ACCEPTED': return 'success';

        case 'REJECTED':
        case 'OFFER_DECLINED': return 'error';

        default: return 'default';
    }
};
