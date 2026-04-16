import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { User, Mail, Calendar, ChevronLeft, CheckCircle2, XCircle, Clock, Save, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStatusVariant } from '../../utils/statusUtils';

interface Application {
    applicationId: number;
    student: {
        email: string;
        userId: number;
    };
    status: string;
    appliedAt: string;
    employerNotes?: string;
    resumeUrlAtApply?: string;
}

const ViewCandidates: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchApplications();
    }, [jobId]);

    // [API CALL] GET /employers/applications/:jobId — loads all applicants for this job
    const fetchApplications = async () => {
        try {
            const response = await api.get(`/employers/applications/${jobId}`);
            setApplications(response.data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    // [API CALL] PUT /employers/applications/:appId/status — updates applicant status and/or notes
    const updateStatus = async (appId: number, status: string, notes?: string) => {
        setUpdating(appId);
        try {
            await api.put(`/employers/applications/${appId}/status`, {
                status,
                employerNotes: notes || ''
            });
            fetchApplications();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update application status.');
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div className="container py-12 fade-in">
            <div className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    {/* NAVIGATE: go back to /employer/dashboard (Manage Jobs page) */}
                    <motion.button
                        whileHover={{ x: -5 }}
                        onClick={() => navigate('/employer/dashboard')}
                        className="flex items-center gap-2 text-muted hover:text-white mb-6 transition-colors group no-underline"
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}
                    >
                        <ChevronLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Talent Pipeline</span>
                    </motion.button>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
                        Talent <span className="text-gradient">Review</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 500 }}>
                        Reviewing candidates for Job <span style={{ color: 'var(--accent)' }}>#{jobId}</span>
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="glass h-56 animate-pulse rounded-3xl"></div>)}
                </div>
            ) : applications.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-40 glass rounded-[2.5rem]"
                    style={{ borderStyle: 'dashed' }}
                >
                    <div className="inline-flex p-8 bg-white/5 rounded-full mb-8 text-muted opacity-20">
                        <User size={64} />
                    </div>
                    <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>No candidates yet</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto' }}>
                        The word hasn't spread yet. Once candidates apply, they'll appear here for your review.
                    </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-8">
                    <AnimatePresence mode="popLayout">
                        {applications.map((app) => (
                            <motion.div
                                key={app.applicationId}
                                layout
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <Card className="glass-hover overflow-hidden p-0" style={{ borderRadius: 'var(--radius-lg)' }}>
                                    <div className="p-8 md:p-10 flex flex-col lg:flex-row justify-between gap-10">
                                        <div className="flex items-start gap-8">
                                            <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] text-muted transition-all duration-500 group-hover:scale-110 group-hover:text-primary">
                                                <User size={40} />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                                    {app.student.email.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                                </h3>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-center gap-3 text-muted">
                                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                                            <Mail size={16} />
                                                        </div>
                                                        <span className="text-sm font-semibold">{app.student.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-muted">
                                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                                            <Calendar size={16} />
                                                        </div>
                                                        <span className="text-sm font-semibold">Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-8 lg:items-end lg:w-96">
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] text-muted font-black tracking-widest uppercase">Current Status</span>
                                                <Badge variant={getStatusVariant(app.status)} className="px-5 py-2 text-xs uppercase tracking-widest font-black">
                                                    {app.status.replace('_', ' ')}
                                                </Badge>
                                            </div>

                                            <div className="flex flex-wrap gap-3 lg:justify-end">
                                                {/* [API CALL] triggers updateStatus → PUT /employers/applications/:appId/status */}
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="gap-2 py-3 px-5 border-white/5 hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/30"
                                                    onClick={() => updateStatus(app.applicationId, 'SHORTLISTED')}
                                                    disabled={updating === app.applicationId}
                                                >
                                                    <CheckCircle2 size={18} />
                                                    <span>Shortlist</span>
                                                </Button>
                                                {/* [API CALL] triggers updateStatus → PUT /employers/applications/:appId/status */}
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="gap-2 py-3 px-5 border-white/5 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                                                    onClick={() => updateStatus(app.applicationId, 'UNDER_REVIEW')}
                                                    disabled={updating === app.applicationId}
                                                >
                                                    <Clock size={18} />
                                                    <span>In Review</span>
                                                </Button>
                                                {/* [API CALL] triggers updateStatus → PUT /employers/applications/:appId/status */}
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="gap-2 py-3 px-5 border-white/5 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30"
                                                    onClick={() => updateStatus(app.applicationId, 'REJECTED')}
                                                    disabled={updating === app.applicationId}
                                                >
                                                    <XCircle size={18} />
                                                    <span>Reject</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Bar: Resume & Notes */}
                                    <div className="bg-white/3 border-t border-white/5 p-8 flex flex-col md:flex-row justify-between items-center gap-8">
                                        {/* UI: opens the applicant's resume PDF in a new tab (no API call) */}
                                        <motion.a
                                            whileHover={{ scale: 1.02 }}
                                            href={app.resumeUrlAtApply || '#'}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-4 text-sm font-bold text-muted hover:text-primary transition-all no-underline px-6 py-3 rounded-2xl border border-white/5 hover:border-primary/30"
                                        >
                                            <FileText size={20} />
                                            <span>Open Applicant Portfolio</span>
                                        </motion.a>
                                        <div className="flex-grow max-w-lg w-full relative group">
                                            {/* [API CALL] onBlur triggers updateStatus → PUT /employers/applications/:appId/status (saves notes) */}
                                            <Input
                                                placeholder="Internal recruitment notes..."
                                                className="py-4 pr-12 text-sm bg-black/20"
                                                defaultValue={app.employerNotes || ''}
                                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                                    if (e.target.value !== app.employerNotes) {
                                                        updateStatus(app.applicationId, app.status, e.target.value);
                                                    }
                                                }}
                                            />
                                            <Save size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-muted opacity-0 group-focus-within:opacity-100 transition-all" />
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default ViewCandidates;
