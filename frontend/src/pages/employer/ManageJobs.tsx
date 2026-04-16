import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Edit2, Archive, Users, X, Check, MapPin, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Job {
    jobId?: number;
    title: string;
    description: string;
    location: string;
    jobType: string;
    isActive?: boolean;
}

const EMPTY_JOB: Job = { title: '', description: '', location: '', jobType: 'Full-time' };

const ManageJobs: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentJob, setCurrentJob] = useState<Job>(EMPTY_JOB);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) fetchJobs();
    }, [user]);

    // [API CALL] GET /employers/jobs/:userId — loads all jobs posted by this employer
    const fetchJobs = async () => {
        try {
            const response = await api.get(`/employers/jobs/${user?.userId}`);
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    // [API CALL] POST /employers/jobs — creates a new job listing
    // [API CALL] PUT  /employers/jobs/:jobId — updates an existing job listing
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (currentJob.jobId) {
                await api.put(`/employers/jobs/${currentJob.jobId}`, currentJob);
            } else {
                await api.post('/employers/jobs', { ...currentJob, employer: { userId: user?.userId } });
            }
            // UI: close the form and return to the job list
            setIsEditing(false);
            setCurrentJob(EMPTY_JOB);
            fetchJobs();
        } catch (error) {
            console.error('Error saving job:', error);
            alert('Failed to save job.');
        }
    };

    // UI: opens the job form pre-filled with the selected job for editing
    const handleEdit = (job: Job) => {
        setCurrentJob(job);
        setIsEditing(true);
    };

    // UI: opens the blank job creation form
    const handleOpenForm = () => {
        setCurrentJob(EMPTY_JOB);
        setIsEditing(true);
    };

    // [API CALL] DELETE /employers/jobs/:jobId — archives (soft-deletes) the job
    const handleArchive = async (jobId: number) => {
        if (!window.confirm('Are you sure you want to archive this job?')) return;
        try {
            await api.delete(`/employers/jobs/${jobId}`);
            fetchJobs();
        } catch (error) {
            console.error('Error archiving job:', error);
        }
    };

    return (
        <div className="container py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Manage Jobs
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Scale your engineering team with ease
                    </p>
                </div>

                {/* UI: only show this button when the form is not already open */}
                {!isEditing && (
                    <Button onClick={handleOpenForm} size="lg" className="gap-2 shrink-0">
                        <Plus size={20} />
                        <span>Post a New Role</span>
                    </Button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {isEditing ? (
                    <motion.div
                        key="edit-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="max-w-2xl mx-auto p-8 card">
                            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {currentJob.jobId ? 'Edit Job Posting' : 'Create New Job Listing'}
                                </h2>
                                {/* UI: closes the form without saving */}
                                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* On submit: calls handleSubmit which hits the backend API */}
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <Input
                                    label="Job Title"
                                    placeholder="e.g. Senior Software Engineer"
                                    value={currentJob.title}
                                    onChange={(e) => setCurrentJob({ ...currentJob, title: e.target.value })}
                                    required
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Location"
                                        placeholder="e.g. San Francisco, CA"
                                        value={currentJob.location}
                                        onChange={(e) => setCurrentJob({ ...currentJob, location: e.target.value })}
                                        required
                                    />
                                    <div className="flex flex-col gap-1">
                                        <label className="label">Job Type</label>
                                        <select
                                            className="input appearance-none bg-white"
                                            value={currentJob.jobType}
                                            onChange={(e) => setCurrentJob({ ...currentJob, jobType: e.target.value })}
                                        >
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Internship">Internship</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="label">Description</label>
                                    <textarea
                                        className="input min-h-[150px] resize-y"
                                        placeholder="Tell us about the role..."
                                        value={currentJob.description}
                                        onChange={(e) => setCurrentJob({ ...currentJob, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="flex gap-4 mt-6">
                                    {/* [API CALL] triggers handleSubmit → POST or PUT to backend */}
                                    <Button type="submit" className="flex-1 py-3">
                                        {currentJob.jobId ? 'Update Posting' : 'Publish Job'}
                                    </Button>
                                    {/* UI: cancels and closes the form */}
                                    <Button type="button" variant="secondary" className="px-8" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        key="job-list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 gap-4"
                    >
                        {loading ? (
                            [1, 2, 3].map(i => <div key={i} className="bg-white border border-gray-200 h-32 animate-pulse rounded-lg"></div>)
                        ) : jobs.length === 0 ? (
                            <div className="text-center py-24 bg-white border border-dashed border-gray-300 rounded-lg">
                                <div className="inline-flex p-5 bg-gray-50 rounded-full mb-4 text-gray-400">
                                    <Briefcase size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No jobs posted yet</h3>
                                <p className="text-gray-500 max-w-sm mx-auto">Start by posting your first job opportunity to reach thousands of candidates.</p>
                                {/* UI: opens the blank job creation form */}
                                <Button onClick={handleOpenForm} className="mt-6">Post a Job</Button>
                            </div>
                        ) : (
                            jobs.map((job) => (
                                <div key={job.jobId} className={`bg-white border text-gray-800 rounded-lg p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-md ${!job.isActive ? 'opacity-60 border-gray-200 bg-gray-50' : 'border-gray-200'}`}>
                                    <div className="flex items-start md:items-center gap-5">
                                        <div className="p-3 bg-indigo-50 text-primary rounded-xl shrink-0 hidden sm:block">
                                            <Briefcase size={28} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                                                {!job.isActive && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold uppercase">Archived</span>}
                                            </div>
                                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 font-medium">
                                                <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</span>
                                                <span className="flex items-center gap-1.5"><Check size={16} /> {job.jobType}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                                        {/* NAVIGATE: goes to /employer/candidates/:jobId to view applicants */}
                                        <Button
                                            variant="secondary"
                                            onClick={() => navigate(`/employer/candidates/${job.jobId}`)}
                                            className="gap-2 text-sm hover:text-primary hover:border-primary/30"
                                        >
                                            <Users size={16} />
                                            <span>Applicants</span>
                                        </Button>
                                        {/* UI: opens the form pre-filled with this job's data */}
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleEdit(job)}
                                            className="px-3 border-gray-200 text-gray-600 hover:text-accent hover:border-accent/30"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </Button>
                                        {/* [API CALL] triggers handleArchive → DELETE /employers/jobs/:jobId */}
                                        <Button
                                            variant="secondary"
                                            onClick={() => job.jobId && handleArchive(job.jobId)}
                                            className="px-3 border-gray-200 text-gray-600 hover:text-danger hover:border-danger/30"
                                            title="Archive"
                                            disabled={!job.isActive}
                                        >
                                            <Archive size={16} />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageJobs;
