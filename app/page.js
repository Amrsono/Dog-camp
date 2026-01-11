'use client';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from './context/LanguageContext';

export default function Home() {
    const { t, lang } = useLanguage();

    return (
        <main className={`min-h-screen text-white overflow-x-hidden ${lang === 'ar' ? 'rtl font-arabic' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <Navbar />

            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[128px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[128px]"></div>
            </div>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center pt-20">
                <div className="max-w-7xl mx-auto px-4 w-full grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-block px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md mb-6">
                            <span className="text-purple-300 font-semibold tracking-wide text-sm">{t?.home?.badge || '✨ THE FUTURE OF DOG HOSTING'}</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
                            {t?.home?.title1 || 'Smart Care for'} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 animate-gradient-x">
                                {t?.home?.title2 || 'Modern Dogs'}
                            </span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-8 max-w-lg leading-relaxed">
                            {t?.home?.desc || 'Experience the world\'s first AI-powered dog hosting platform. Live 4K streaming, remote treat dispatch, and biometric health monitoring.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/register" className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-lg shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] hover:scale-105 transition-all duration-300 text-center overflow-hidden">
                                <span className="relative z-10">{t?.home?.startTrial || 'Start Free Trial'}</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>
                            <Link href="#demo" className="px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 font-bold text-lg transition-colors flex items-center justify-center gap-2">
                                <span>▶</span> {t?.home?.watchDemo || 'Watch Demo'}
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-900/40 bg-[#0f172a]/50 backdrop-blur-xl p-2">
                            {/* Replaced placeholder with potential for dynamic content */}
                            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden relative group">
                                <Image
                                    src="/images/dog_hero_ui.png"
                                    alt="Dashboard"
                                    fill
                                    className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                                    priority
                                />
                                {/* UI Overlay Mockup */}
                                <div className="absolute bottom-4 left-4 right-4 p-4 glass rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                                        <div>
                                            <div className="text-xs text-gray-400 uppercase">{t?.home?.statusLabel || 'STATUS'}</div>
                                            <div className="font-bold">{t?.home?.statusValue || 'Playful & Happy'}</div>
                                        </div>
                                    </div>
                                    <div className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-lg text-xs font-bold border border-purple-500/30">
                                        {t?.home?.hpmLabel || 'HPM: 98'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Decorative blobs */}
                        <div className="absolute -top-10 -right-10 h-32 w-32 bg-cyan-500/30 rounded-full blur-[40px]"></div>
                        <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-pink-500/30 rounded-full blur-[40px]"></div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 relative z-10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">{t?.home?.featuresTitle || 'Space-Age Services'}</h2>
                        <p className="text-gray-400">{t?.home?.featuresDesc || 'Everything your dog needs, managed from your phone.'}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {(t?.home?.features || [
                            { title: 'Smart Hosting', desc: 'Climate controlled smart-pods with auto-cleaning tech.', color: 'from-blue-500 to-cyan-500', icon: '🏠' },
                            { title: 'Tele-Treats', desc: ' dispense organic treats remotely via our low-latency app.', color: 'from-pink-500 to-rose-500', icon: '🦴' },
                            { title: 'Vet Connect', desc: '24/7 AI health monitoring and instant vet video calls.', color: 'from-green-500 to-emerald-500', icon: '🩺' },
                            { title: 'Live 4K Cam', desc: 'Crystal clear streaming with night vision and 2-way audio.', color: 'from-purple-500 to-indigo-500', icon: '📹' },
                            { title: 'Grooming', desc: 'Automated spa sessions and styling by expert humans.', color: 'from-yellow-400 to-orange-500', icon: '✂️' },
                            { title: 'Training AI', desc: 'Behavioral analysis and obedience tracking.', color: 'from-red-500 to-pink-500', icon: '🧠' }
                        ]).map((item, i) => {
                            // Map colors and icons based on index since translations only have text
                            const colors = ['from-blue-500 to-cyan-500', 'from-pink-500 to-rose-500', 'from-green-500 to-emerald-500', 'from-purple-500 to-indigo-500', 'from-yellow-400 to-orange-500', 'from-red-500 to-pink-500'];
                            const icons = ['🏠', '🦴', '🩺', '📹', '✂️', '🧠'];
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:to-white/5 transition-all duration-300"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl blur-xl" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}></div>
                                    <div className="relative h-full bg-[#0f172a] rounded-xl p-8 border border-white/5 hover:border-white/20 transition-all duration-300 group-hover:-translate-y-1 text-center sm:text-start">
                                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colors[i]} flex items-center justify-center text-2xl mb-6 shadow-lg mx-auto sm:mx-0`}>
                                            {icons[i]}
                                        </div>
                                        <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                        <p className="text-gray-400 leading-relaxed text-sm">
                                            {item.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
