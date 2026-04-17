import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Briefcase, MapPin, DollarSign, Search, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface Job {
    jobId: number;
    title: string;
    description: string;
    location: string;
    salary: number;
    employerId: number;
    displayCompanyName: string;
}

const JobBoard: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [applying, setApplying] = useState<number | null>(null);
    const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        fetchJobs();
        if (user) fetchMyApplications();
    }, [user]);

    // [API CALL] GET /students/jobs — fetches all active job listings
    const fetchJobs = async () => {
        try {
            const response = await api.get('/students/jobs');
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    // [API CALL] GET /students/applications/:userId — fetches this student's applications
    // Used to mark jobs that have already been applied to
    const fetchMyApplications = async () => {
        try {
            const response = await api.get(`/students/applications/${user?.userId}`);
            setAppliedJobs(response.data.map((app: any) => app.job.jobId));
        } catch (error) {
            console.error('Error fetching my applications:', error);
        }
    };

    // [API CALL] POST /students/apply — submits a new job application for this student
    const handleApply = async (jobId: number) => {
        if (!user) return;
        setApplying(jobId);
        try {
            await api.post('/students/apply', {
                studentUserId: user.userId,
                jobId,
                resumeUrl: `https://storage.jobportal.com/resumes/${user.userId}.pdf`
            });
            // UI: mark this job as applied without re-fetching
            setAppliedJobs(prev => [...prev, jobId]);
        } catch (error: any) {
            console.error('Apply error:', error);
            alert(error.response?.data?.error || 'Failed to apply.');
        } finally {
            setApplying(null);
        }
    };

    // UI: filter jobs client-side based on the search input (no API call)
    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Find Your Dream Job
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Curated opportunities for the next generation of talent
                    </p>
                </div>

                {/* UI: search input — filters the job list locally, does NOT call the backend */}
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search roles, skills, or locations..."
                        className="w-full border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white h-72 rounded-lg border border-gray-200 animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredJobs.map((job) => {
                            const hasApplied = appliedJobs.includes(job.jobId);
                            return (
                                <motion.div
                                    key={job.jobId}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className={`card h-full flex flex-col transition-all duration-200 ${hasApplied ? 'opacity-80 bg-gray-50' : 'hover:shadow-md hover:border-primary/30'}`}>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`p-3 rounded-xl ${hasApplied ? 'bg-green-100 text-green-600' : 'bg-indigo-50 text-primary'}`}>
                                                    {hasApplied ? <CheckCircle size={24} /> : <Briefcase size={24} />}
                                                </div>
                                                {hasApplied && (
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full text-xs font-bold uppercase">
                                                        Applied
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className={`text-xl font-bold mb-1 ${hasApplied ? 'text-gray-700' : 'text-gray-900'}`}>
                                                {job.title}
                                            </h3>
                                            <div className="mb-3">
                                                <span className="text-sm font-semibold text-primary/80 uppercase tracking-wider">
                                                    {job.displayCompanyName}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                                                {job.description}
                                            </p>

                                            <div className="flex flex-col gap-2 mb-6">
                                                <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                                    <MapPin size={16} className="text-gray-400" />
                                                    <span>{job.location}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                                    <DollarSign size={16} className="text-gray-400" />
                                                    <span>{job.salary ? `$${job.salary.toLocaleString()} / year` : 'Salary Not Disclosed'}</span>
                                                </div>
                                            </div>

                                            {/* [API CALL] triggers handleApply → POST /students/apply */}
                                            <Button
                                                variant={hasApplied ? 'secondary' : 'primary'}
                                                className="w-full justify-center group/btn py-3 mt-auto"
                                                onClick={() => !hasApplied && handleApply(job.jobId)}
                                                disabled={hasApplied || applying === job.jobId}
                                            >
                                                <span>{hasApplied ? 'Already Applied' : applying === job.jobId ? 'Applying...' : 'Quick Apply'}</span>
                                                {applying === job.jobId ? (
                                                    <Loader2 className="animate-spin ml-2" size={18} />
                                                ) : (
                                                    !hasApplied && <ArrowRight size={18} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {!loading && filteredJobs.length === 0 && (
                <div className="text-center py-20 bg-white border border-dashed border-gray-300 rounded-lg">
                    <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
                        <Search size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No results found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">Try adjusting your search filters to find what you're looking for.</p>
                </div>
            )}
        </div>
    );
};

export default JobBoard;
