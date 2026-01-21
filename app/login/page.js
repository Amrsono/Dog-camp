'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                const role = data.user.role;
                // Simple client-side storage for demo
                localStorage.setItem('user', JSON.stringify(data.user));

                if (role === 'admin') {
                    router.push('/dashboard/admin');
                } else {
                    router.push('/dashboard/customer');
                }
            } else {
                const err = await res.json();
                setError(err.error);
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--dark)] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/hero.png')] bg-cover bg-center opacity-20 filter blur-sm"></div>
            <Navbar />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-10 w-full max-w-md relative z-10 mx-4"
            >
                <h2 className="text-3xl font-bold text-center mb-8 text-[var(--light)]">Welcome Back</h2>

                {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[rgba(255,255,255,0.05)] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--primary)] transition-colors"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[rgba(255,255,255,0.05)] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--primary)] transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[var(--primary)] hover:bg-[var(--secondary)] text-white font-bold py-3 rounded-lg shadow-lg shadow-red-500/30 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                        Sign In
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-400">
                    <p>Don't have an account? <a href="/register" className="text-[var(--secondary)] hover:underline">Register here</a></p>
                </div>
            </motion.div>
        </div>
    );
}
