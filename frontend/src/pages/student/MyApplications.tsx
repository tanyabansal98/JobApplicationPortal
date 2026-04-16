import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { FileText, Trash2, Calendar, Briefcase, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getStatusVariant } from '../../utils/statusUtils';

interface Application {
    applicationId: number;
    job: {
        title: string;
        location: string;
        salary: number;
    };
    status: string;
    appliedAt: string;
    employerNotes?: string;
}

const MyApplications: React.FC = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) fetchApplications();
    }, [user]);

    // [API CALL] GET /students/applications/:userId — loads all applications for this student
    const fetchApplications = async () => {
        try {
            const response = await api.get(`/students/applications/${user?.userId}`);
            setApplications(response.data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    // [API CALL] DELETE /students/withdraw/:appId — withdraws the selected application
    const handleWithdraw = async (appId: number) => {
        if (!window.confirm('Are you sure you want to withdraw this application?')) return;
        try {
            await api.delete(`/students/withdraw/${appId}`);
            // UI: remove the withdrawn application from the list without re-fetching
            setApplications(prev => prev.filter(app => app.applicationId !== appId));
        } catch (error) {
            console.error('Error withdrawing application:', error);
            alert('Failed to withdraw application.');
        }
    };

    return (
        <div className="container py-12">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    My Applications
                </h1>
                <p className="text-gray-500 text-lg">
                    Track your journey and application milestones
                </p>
            </div>

            {loading ? (
                <div className="flex flex-col gap-4">
                    {[1, 2, 3].map(i => <div key={i} className="bg-white border border-gray-200 h-32 rounded-lg animate-pulse"></div>)}
                </div>
            ) : applications.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-24 bg-white border border-dashed border-gray-300 rounded-lg"
                >
                    <div className="inline-flex p-6 bg-gray-50 rounded-full mb-6 text-gray-400">
                        <FileText size={48} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">No applications yet</h3>
                    <p className="text-gray-500 text-lg max-w-md mx-auto mb-8">
                        You haven't applied to any jobs. Start exploring opportunities on the job board!
                    </p>
                    {/* NAVIGATE: go to /jobs (job board) to browse and apply to jobs */}
                    <Button size="lg" className="px-8" onClick={() => navigate('/jobs')}>
                        Find Opportunities
                    </Button>
                </motion.div>
            ) : (
                <div className="flex flex-col gap-4">
                    <AnimatePresence mode="popLayout">
                        {applications.map((app) => (
                            <motion.div
                                key={app.applicationId}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="bg-white border border-gray-200 overflow-hidden p-0 hover:shadow-md transition-shadow">
                                    <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
                                        <div className="flex items-start md:items-center gap-6">
                                            <div className="p-4 bg-indigo-50 text-primary rounded-xl hidden sm:block">
                                                <Briefcase size={28} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{app.job.title}</h3>
                                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 font-medium">
                                                    <span className="flex items-center gap-2"><Calendar size={16} className="text-gray-400" /> {new Date(app.appliedAt).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-2 text-primary">ID: #{app.applicationId}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                                            <div className="flex flex-col items-end gap-2 text-right w-full sm:w-auto">
                                                <Badge variant={getStatusVariant(app.status)} className="px-4 py-1.5 text-xs uppercase tracking-wider font-bold">
                                                    {app.status.replace('_', ' ')}
                                                </Badge>
                                                {app.employerNotes && (
                                                    <span className="text-xs text-gray-500 max-w-[200px] italic font-medium truncate" title={app.employerNotes}>
                                                        " {app.employerNotes} "
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-px bg-gray-200 hidden md:block"></div>
                                                {/* [API CALL] triggers handleWithdraw → DELETE /students/withdraw/:appId */}
                                                <button
                                                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent shadow-none"
                                                    onClick={() => handleWithdraw(app.applicationId)}
                                                    title="Withdraw Application"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                                <Button variant="secondary" className="p-3 border-gray-200 shadow-none text-gray-600 hover:text-primary hover:border-primary/30 hidden sm:flex">
                                                    <ChevronRight size={20} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* UI: progress bar showing application stage visually */}
                                    <div className="h-1.5 w-full bg-gray-100 relative">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: app.status === 'HIRED' || app.status === 'OFFER_ACCEPTED' ? '100%' :
                                                    app.status === 'REJECTED' || app.status === 'WITHDRAWN' ? '0%' :
                                                        app.status === 'OFFER_EXTENDED' ? '80%' :
                                                            app.status === 'SHORTLISTED' ? '60%' : '30%'
                                            }}
                                            className="h-full bg-primary"
                                        ></motion.div>
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

export default MyApplications;
