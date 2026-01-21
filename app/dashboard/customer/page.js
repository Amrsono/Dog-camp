'use client';
import Navbar from '../../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';
import LiveFeed from '../../components/LiveFeed';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function CustomerDashboard() {
    const [activeTab, setActiveTab] = useState('cam');
    const [treatSent, setTreatSent] = useState(false);
    const [streamUrl, setStreamUrl] = useState(''); // User can set their IP cam URL here
    const [user, setUser] = useState(null);
    const { t } = useLanguage();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const dispatchTreat = () => {
        setTreatSent(true);
        setTimeout(() => setTreatSent(false), 3000); // Reset after 3 seconds
    };

    const tabs = [
        { id: 'cam', label: t?.dashboard?.tabs?.cam || 'Live Cam 📹' },
        { id: 'food', label: t?.dashboard?.tabs?.food || 'Diet & Meals 🍖' },
        { id: 'training', label: t?.dashboard?.tabs?.training || 'Training 🎓' },
        { id: 'walking', label: t?.dashboard?.tabs?.walking || 'Walking Schedule 🐕' },
    ];

    return (
        <div className="min-h-screen bg-[var(--dark)] text-white">
            <Navbar />

            <div className="pt-20 px-4 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">{t?.dashboard?.hello || 'Hello,'} <span className="text-[var(--primary)]">{user?.name || 'Explorer'}</span></h1>
                <p className="text-gray-400 mb-8">{t?.dashboard?.status || (user?.dogName ? `Here is how "${user.dogName}" is doing today.` : 'Here is how your companion is doing today.')}</p>

                {/* Tab Navigation */}
                <div className="flex overflow-x-auto space-x-4 mb-8 pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 rounded-full whitespace-nowrap transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-[var(--primary)] text-white shadow-lg shadow-red-500/30'
                                : 'glass text-gray-300 hover:bg-white/5'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">

                    <AnimatePresence mode="wait">
                        {activeTab === 'cam' && (
                            <motion.div
                                key="cam"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="lg:col-span-3"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="glass p-4 rounded-3xl relative overflow-hidden aspect-video bg-black flex items-center justify-center group">
                                        {/* Real Live Feed or Placeholder */}
                                        {streamUrl ? (
                                            <div className="relative w-full h-full">
                                                <LiveFeed streamUrl={streamUrl} />
                                                <button
                                                    onClick={() => setStreamUrl('')}
                                                    className="absolute bottom-4 right-4 z-30 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-full border border-white/10 transition-all opacity-0 group-hover:opacity-100 pointer-events-auto"
                                                >
                                                    CHANGE CAMERA
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <Image
                                                    src="/images/dog_running.png"
                                                    alt="Live Stream"
                                                    fill
                                                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                                />
                                                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                                                    {t?.dashboard?.cam?.live || 'LIVE'}
                                                </div>
                                                <div className="z-10 text-center px-6">
                                                    <div className="mb-6">
                                                        <h3 className="text-sm font-bold mb-2 text-white/80">Configure IP Camera</h3>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter URL (HLS/MJPEG/.mp4)"
                                                            value={streamUrl}
                                                            onChange={(e) => setStreamUrl(e.target.value)}
                                                            className="bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 w-full max-w-xs backdrop-blur-md shadow-2xl"
                                                        />
                                                        <p className="text-[10px] text-gray-400 mt-2 italic">Note: Browsers do not support direct rtsp:// links.</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="glass p-8 flex flex-col justify-center items-center text-center">
                                        <h2 className="text-3xl font-bold mb-6">{t?.dashboard?.cam?.treatTitle || 'Treat Dispatcher 3000'}</h2>
                                        <p className="text-gray-400 mb-8">{t?.dashboard?.cam?.treatDesc || 'Buddy is being a good boy? Send him a snack instantly!'}</p>

                                        <button
                                            onClick={dispatchTreat}
                                            disabled={treatSent}
                                            className={`w-64 h-64 rounded-full border-8 border-[var(--secondary)] flex items-center justify-center transition-all duration-300 transform active:scale-95 ${treatSent ? 'bg-[var(--secondary)] scale-95' : 'hover:bg-[var(--secondary)]/10'}`}
                                        >
                                            <span className="block text-center">
                                                <span className="text-6xl block mb-2">{treatSent ? '🦴' : '🍖'}</span>
                                                <span className="font-bold text-xl">{treatSent ? (t?.dashboard?.cam?.dispatched || 'DISPATCHED!') : (t?.dashboard?.cam?.dispatch || 'PRESS TO DISPATCH')}</span>
                                            </span>
                                        </button>
                                        {treatSent && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-4 text-[var(--accent)] font-bold"
                                            >
                                                {t?.dashboard?.cam?.reviewing || 'Reviewing treat inventory... Dispensed!'}
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'food' && (
                            <motion.div
                                key="food"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="lg:col-span-3 glass p-8"
                            >
                                <h2 className="text-2xl font-bold mb-6">{t?.dashboard?.food?.title || 'Today\'s Menu'}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
                                        <div key={meal} className="bg-white/5 p-6 rounded-xl border border-white/10">
                                            <h3 className="text-[var(--accent)] font-bold text-lg mb-2">{meal}</h3>
                                            <p className="text-sm text-gray-300 mb-4">Premium Salmon & Rice Mix with vitamin supplements.</p>
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>08:00 AM</span>
                                                <span className="text-green-400">{t?.dashboard?.food?.served || '✓ Served'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <h3 className="font-bold mb-4">{t?.dashboard?.food?.customize || 'Customize Diet Plan'}</h3>
                                    <div className="flex gap-4">
                                        <button className="bg-[var(--primary)] px-4 py-2 rounded text-sm font-bold">{t?.dashboard?.food?.update || 'Update Preferences'}</button>
                                        <button className="border border-white/20 px-4 py-2 rounded text-sm hover:bg-white/10">{t?.dashboard?.food?.allergies || 'Allergies Info'}</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'training' && (
                            <motion.div
                                key="training"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="lg:col-span-3"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="glass p-6">
                                        <h2 className="text-xl font-bold mb-4">{t?.dashboard?.training?.title || 'Current Progress'}</h2>
                                        <div className="space-y-4">
                                            <div className="bg-white/5 p-4 rounded-lg">
                                                <div className="flex justify-between mb-2">
                                                    <span>Sit & Stay</span>
                                                    <span className="text-[var(--secondary)] font-bold">85%</span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                                    <div className="bg-[var(--secondary)] h-2.5 rounded-full" style={{ width: '85%' }}></div>
                                                </div>
                                            </div>
                                            <div className="bg-white/5 p-4 rounded-lg">
                                                <div className="flex justify-between mb-2">
                                                    <span>Leash Walking</span>
                                                    <span className="text-[var(--accent)] font-bold">40%</span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                                    <div className="bg-[var(--accent)] h-2.5 rounded-full" style={{ width: '40%' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="glass p-6">
                                        <h2 className="text-xl font-bold mb-4">{t?.dashboard?.training?.recordings || 'Session Recordings'}</h2>
                                        <div className="space-y-3">
                                            {['Session #12 - Agility', 'Session #11 - Obedience', 'Session #10 - Socialization'].map((video, i) => (
                                                <div key={i} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                                                    <div className="w-12 h-12 bg-[var(--primary)]/20 rounded-lg flex items-center justify-center text-[var(--primary)]">▶</div>
                                                    <div>
                                                        <p className="font-bold text-sm">{video}</p>
                                                        <p className="text-xs text-gray-500">{t?.dashboard?.training?.recorded || 'Recorded yesterday'}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'walking' && (
                            <motion.div
                                key="walking"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="lg:col-span-3 glass p-8"
                            >
                                <h2 className="text-2xl font-bold mb-6">{t?.dashboard?.walking?.title || 'Walking Schedule'}</h2>
                                <p className="mb-4">{t?.dashboard?.walking?.desc || 'Select preferred walking times for Buddy.'}</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {['Morning (7AM)', 'Noon (12PM)', 'Afternoon (4PM)', 'Evening (8PM)'].map(time => (
                                        <label key={time} className="flex items-center space-x-3 p-4 border border-white/20 rounded-lg cursor-pointer hover:bg-white/5">
                                            <input type="checkbox" className="form-checkbox h-5 w-5 text-[var(--primary)] rounded focus:ring-0" defaultChecked />
                                            <span>{time}</span>
                                        </label>
                                    ))}
                                </div>
                                <button className="mt-6 bg-[var(--primary)] px-6 py-2 rounded-lg font-bold">{t?.dashboard?.walking?.save || 'Save Schedule'}</button>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
