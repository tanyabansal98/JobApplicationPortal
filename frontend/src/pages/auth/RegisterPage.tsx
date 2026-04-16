import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import api from '../../services/api';
import { UserPlus } from 'lucide-react';
import type { Role } from '../../context/AuthContext';

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<Role>('STUDENT');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // [API CALL] POST /auth/register — creates a new user account in the database
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/auth/register', { email, password, role });
            // UI: show a success message before redirecting
            setSuccess('Registration successful! Redirecting to login...');
            // NAVIGATE: redirect to /login after 2 seconds
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4 bg-background">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[440px]"
            >
                <Card className="p-8 md:p-10 card">
                    <div className="flex flex-col items-center mb-8">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="p-4 rounded-2xl bg-primary text-white mb-6 shadow-md"
                        >
                            <UserPlus size={32} />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Join Us</h1>
                        <p className="text-gray-500 text-center">Create your account to get started</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6 text-sm text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-6 text-sm text-center"
                            >
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* On submit: calls handleSubmit which hits the backend API */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {/* UI: toggle between STUDENT and EMPLOYER role selection */}
                        <div className="flex flex-col gap-2">
                            <label className="label">Account Type</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    onClick={() => setRole('STUDENT')}
                                    className={`p-3 rounded-md cursor-pointer text-center border transition-all ${role === 'STUDENT'
                                        ? 'border-primary bg-indigo-50 text-primary font-semibold'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                        }`}
                                >
                                    Student
                                </div>
                                <div
                                    onClick={() => setRole('EMPLOYER')}
                                    className={`p-3 rounded-md cursor-pointer text-center border transition-all ${role === 'EMPLOYER'
                                        ? 'border-primary bg-indigo-50 text-primary font-semibold'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                        }`}
                                >
                                    Employer
                                </div>
                            </div>
                        </div>

                        {/* [API CALL] triggers handleSubmit → POST /auth/register */}
                        <Button type="submit" size="lg" isLoading={isLoading} className="mt-4 text-lg">
                            Register
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-gray-500">
                        Already have an account?{' '}
                        {/* NAVIGATE: go to /login page */}
                        <Link to="/login" className="text-primary font-semibold hover:underline">
                            Sign In
                        </Link>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
