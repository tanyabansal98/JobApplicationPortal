import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
    Users,
    Briefcase,
    FileText,
    UserX,
    UserCheck,
    Activity,
    BarChart3,
    Search,
    MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface User {
    userId: number;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

interface Stats {
    totalUsers: number;
    activeJobs: number;
    totalApplications: number;
    employerCount: number;
    studentCount: number;
}

const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'users' | 'stats'>('users');
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, statsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/dashboard')
            ]);
            setUsers(usersRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
        try {
            const endpoint = currentStatus ? 'deactivate' : 'activate';
            await api.put(`/admin/users/${userId}/${endpoint}`);
            setUsers(prev => prev.map(u => u.userId === userId ? { ...u, isActive: !currentStatus } : u));
        } catch (error) {
            console.error('Error updating user status:', error);
            alert('Failed to update user status.');
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container py-12">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Admin Command Center
                </h1>
                <p className="text-gray-500 text-lg">
                    Global system oversight and intelligence overview
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    icon={<Users className="text-blue-500" size={24} />}
                    label="Active Ecosystem"
                    value={stats?.totalUsers || 0}
                    trend="+12% this month"
                />
                <StatCard
                    icon={<Briefcase className="text-purple-500" size={24} />}
                    label="Market Demand"
                    value={stats?.activeJobs || 0}
                    trend="+5 new today"
                />
                <StatCard
                    icon={<FileText className="text-green-500" size={24} />}
                    label="Application Velocity"
                    value={stats?.totalApplications || 0}
                    trend="+28 last week"
                />
                <StatCard
                    icon={<Activity className="text-orange-500" size={24} />}
                    label="Core Infrastructure"
                    value="99.9%"
                    trend="Operational"
                />
            </div>

            {/* Interactive Tabs Section */}
            <div className="flex gap-4 mb-8">
                <TabButton
                    active={activeTab === 'users'}
                    onClick={() => setActiveTab('users')}
                    icon={<Users size={20} />}
                    label="User Directory"
                />
                <TabButton
                    active={activeTab === 'stats'}
                    onClick={() => setActiveTab('stats')}
                    icon={<BarChart3 size={20} />}
                    label="System Analytics"
                />
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'users' ? (
                    <motion.div
                        key="users-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="bg-white border border-gray-200 shadow-sm p-0 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
                                <div className="relative w-full md:w-[400px]">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search by identity or role..."
                                        className="w-full border border-gray-300 rounded-md py-2.5 pl-11 pr-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Button variant="secondary" className="gap-2 shrink-0" onClick={fetchData}>
                                    <Activity size={18} />
                                    <span>Sync Data</span>
                                </Button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        {/* Matches the purple header from the second image */}
                                        <tr className="bg-[#783f8e] text-white text-sm">
                                            <th className="px-6 py-4 font-semibold rounded-tl-lg">Identity</th>
                                            <th className="px-6 py-4 font-semibold">Role</th>
                                            <th className="px-6 py-4 font-semibold">Status</th>
                                            <th className="px-6 py-4 font-semibold">Joined</th>
                                            <th className="px-6 py-4 font-semibold text-right rounded-tr-lg">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-700 text-sm">
                                        {loading ? (
                                            <tr><td colSpan={5} className="p-12 text-center text-gray-400 animate-pulse">Synchronizing with node...</td></tr>
                                        ) : filteredUsers.length === 0 ? (
                                            <tr><td colSpan={5} className="p-12 text-center text-gray-500">No users found</td></tr>
                                        ) : filteredUsers.map((u, index) => (
                                            <tr key={u.userId} className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                                                            {u.email[0].toUpperCase()}
                                                        </div>
                                                        <span className="font-semibold text-gray-900">{u.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant={u.role === 'ADMIN' ? 'error' : u.role === 'EMPLOYER' ? 'info' : 'default'} className="uppercase text-[10px] tracking-wider px-2.5 py-1">
                                                        {u.role}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                        <span className={`font-semibold text-xs uppercase tracking-wide ${u.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                                            {u.isActive ? 'Active' : 'Offline'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 font-medium whitespace-nowrap">
                                                    {new Date(u.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button
                                                        variant="secondary"
                                                        className={`text-xs px-4 py-2 hover:bg-transparent ${u.isActive ? 'text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border-red-200' : 'text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 border-green-200'}`}
                                                        onClick={() => toggleUserStatus(u.userId, u.isActive)}
                                                        disabled={!!user && u.userId === user.userId}
                                                    >
                                                        {u.isActive ? <UserX size={14} className="mr-1.5 inline" /> : <UserCheck size={14} className="mr-1.5 inline" />}
                                                        {u.isActive ? 'Revoke' : 'Restore'}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        key="stats-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center justify-center py-32 bg-white border border-dashed border-gray-300 rounded-xl shadow-sm"
                    >
                        <div className="inline-flex p-8 bg-gray-50 rounded-full mb-6">
                            <BarChart3 size={48} className="text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Data Intelligence</h3>
                        <p className="text-gray-500 text-center max-w-sm">
                            We're preparing advanced metrics and system health visualizations. Check back shortly.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number, trend: string }> = ({ icon, label, value, trend }) => (
    <Card className="bg-white border text-gray-800 border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-gray-50 rounded-xl">
                {icon}
            </div>
            <button className="text-gray-400 hover:text-gray-600 p-1">
                <MoreVertical size={18} />
            </button>
        </div>
        <div className="flex flex-col">
            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</span>
            <span className="text-3xl font-bold text-gray-900 mb-2">{value}</span>
            <div className="flex items-center gap-2">
                <div className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-xs font-bold">
                    {trend}
                </div>
            </div>
        </div>
    </Card>
);

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all focus:outline-none ${active ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200'}`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

export default AdminDashboard;
