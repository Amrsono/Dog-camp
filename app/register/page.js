'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // For this demo, we can just redirect to login or mock success
        // In a real app, POST to /api/auth/register

        // Simulate API call
        setError('');
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        // Mock success
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-[var(--dark)] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/hero.png')] bg-cover bg-center opacity-20 filter blur-sm"></div>
            <Navbar />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-10 w-full max-w-md relative z-10"
            >
                <h2 className="text-3xl font-bold text-center mb-8 text-[var(--light)]">Join Dog-Camp</h2>

                {error && <div className="text-red-400 text-center mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-[rgba(255,255,255,0.05)] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--primary)]"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-[rgba(255,255,255,0.05)] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--primary)]"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-[rgba(255,255,255,0.05)] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--primary)]"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[var(--secondary)] hover:bg-[var(--primary)] text-[var(--dark)] font-bold py-3 rounded-lg shadow-lg transition-all duration-300"
                    >
                        Create Account
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-400">
                    <p>Already have an account? <a href="/login" className="text-[var(--primary)] hover:underline">Login</a></p>
                </div>
            </motion.div>
        </div>
    );
}
