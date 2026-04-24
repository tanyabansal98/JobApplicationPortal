import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import api from '../../services/api';
import { LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // [API CALL] POST /auth/login — authenticates the user and returns a session token
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });
            // UI: store user session in context so the app knows who is logged in
            login(response.data);
            // NAVIGATE: redirect to /dashboard — which auto-redirects to the role-specific page
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.error || 'Invalid email or password.');
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
                            <LogIn size={32} />
                        </motion.div>
                        <p className="text-sm font-medium text-primary mb-1 uppercase tracking-wider">Welcome to the Job Application Portal</p>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                        <p className="text-gray-500 text-center">Sign in to continue your journey</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6 text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

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

                        {/* [API CALL] triggers handleSubmit → POST /auth/login */}
                        <Button type="submit" size="lg" isLoading={isLoading} className="mt-2 text-lg">
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-gray-500">
                        Don't have an account?{' '}
                        {/* NAVIGATE: go to /register page */}
                        <Link to="/register" className="text-primary font-semibold hover:underline">
                            Create account
                        </Link>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default LoginPage;
