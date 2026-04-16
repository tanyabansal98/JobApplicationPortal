import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, LogOut, LayoutDashboard, ShieldCheck, UserCircle } from 'lucide-react';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="bg-header text-white py-4 px-6 md:px-10 sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 no-underline group">
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="p-2.5 rounded-xl bg-primary"
                    >
                        <Briefcase className="text-white" size={20} />
                    </motion.div>
                    <span className="text-2xl font-bold tracking-tight text-white">
                        Job<span className="text-blue-300">Portal</span>
                    </span>
                </Link>

                <div className="flex items-center gap-10">
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/dashboard" className="text-gray-200 hover:text-white font-medium flex items-center gap-2 transition-colors">
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </Link>

                        {user.role === 'EMPLOYER' && (
                            <Link to="/employer/dashboard" className="text-gray-200 hover:text-white font-medium flex items-center gap-2 transition-colors">
                                <Briefcase size={18} />
                                <span>Manage Jobs</span>
                            </Link>
                        )}

                        {user.role === 'STUDENT' && (
                            <Link to="/jobs" className="text-gray-200 hover:text-white font-medium flex items-center gap-2 transition-colors">
                                <Briefcase size={18} />
                                <span>Find Jobs</span>
                            </Link>
                        )}

                        {user.role === 'ADMIN' && (
                            <Link to="/admin/dashboard" className="text-gray-200 hover:text-white font-medium flex items-center gap-2 transition-colors">
                                <ShieldCheck size={18} />
                                <span>Admin Panel</span>
                            </Link>
                        )}
                    </div>

                    <div className="h-8 w-px bg-gray-600"></div>

                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-semibold text-white">{user.email.split('@')[0]}</span>
                                <span className="text-xs font-bold text-blue-300 uppercase tracking-wide">{user.role}</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                <UserCircle size={24} className="text-white" />
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="p-2.5 text-gray-300 hover:text-red-400 rounded-lg transition-colors flex items-center gap-2"
                            title="Logout"
                        >
                            <LogOut size={20} />
                            <span className="hidden sm:inline font-medium">Logout</span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
