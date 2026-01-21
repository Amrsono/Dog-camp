'use client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';

export default function Services() {
    const { t, lang } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error, unauthenticated
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const services = [
        {
            title: t?.services?.luxuryHosting?.title || 'Luxury Hosting',
            price: t?.services?.luxuryHosting?.price || '2,500 EGP/night',
            desc: t?.services?.luxuryHosting?.desc || 'Climate controlled suites.',
            icon: '🏢',
            dogIcon: '🐕'
        },
        {
            title: t?.services?.gourmetFeeding?.title || 'Gourmet Feeding',
            price: t?.services?.gourmetFeeding?.price || '750 EGP/day',
            desc: t?.services?.gourmetFeeding?.desc || 'Chef-prepared meals.',
            icon: '🍖',
            dogIcon: '🐶'
        },
        {
            title: t?.services?.fullGrooming?.title || 'Full Grooming',
            price: t?.services?.fullGrooming?.price || '3,000 EGP/session',
            desc: t?.services?.fullGrooming?.desc || 'Spa quality grooming.',
            icon: '✂️',
            dogIcon: '🐩'
        },
        {
            title: t?.services?.trainingBootCamp?.title || 'Training Boot Camp',
            price: t?.services?.trainingBootCamp?.price || '5,000 EGP/session',
            desc: t?.services?.trainingBootCamp?.desc || '1-on-1 sessions.',
            icon: '🎓',
            dogIcon: '🐕‍🦺'
        },
        {
            title: t?.services?.vetTeleHealth?.title || 'Vet Tele-Health',
            price: t?.services?.vetTeleHealth?.price || '1,500 EGP/call',
            desc: t?.services?.vetTeleHealth?.desc || 'Instant vet calls.',
            icon: '🩺',
            dogIcon: '🏥'
        },
        {
            title: t?.services?.playGroup?.title || 'Play Group',
            price: t?.services?.playGroup?.price || '1,000 EGP/day',
            desc: t?.services?.playGroup?.desc || 'Socialization time.',
            icon: '🎾',
            dogIcon: '🦮'
        },
    ];

    const openModal = (service) => {
        setSelectedService(service);
        setIsModalOpen(true);
        setStatus('idle');
    };

    const submitBooking = async (e) => {
        e.preventDefault();
        setStatus('loading');

        if (!user) {
            setStatus('unauthenticated');
            return;
        }

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceName: selectedService,
                    date,
                    notes,
                    userId: user.email // Use email as userId to match Admin Dashboard logic
                })
            });

            if (res.ok) {
                setStatus('success');
                setTimeout(() => {
                    setIsModalOpen(false);
                    setDate('');
                    setNotes('');
                }, 2000);
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 50, damping: 15 }
        },
        hover: {
            y: -10,
            transition: { type: 'spring', stiffness: 300 }
        }
    };

    return (
        <div className="min-h-screen bg-[var(--dark)] text-white overflow-x-hidden">
            <Navbar />

            {/* Hero Section with Clean Gradient */}
            <div className="relative pt-32 pb-24 bg-gradient-to-b from-purple-900/20 to-[var(--dark)] overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center justify-center text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
                    >
                        {t?.hero?.title || 'VIP Treatment'}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-300 max-w-2xl mx-auto mb-12"
                    >
                        {t?.hero?.subtitle || 'Choose from our premium services.'}
                    </motion.p>
                </div>

                {/* Decorative Wave Divider */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
                    <svg className="relative block w-[calc(100%+1.3px)] h-[60px] text-gray-900/30 fill-current" preserveAspectRatio="none" viewBox="0 0 1200 120">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,6V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                    </svg>
                </div>
            </div>

            {/* Service Cards Grid */}
            <div className="max-w-7xl mx-auto px-4 relative z-10 pb-20 -mt-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {services.map((s, i) => (
                        <motion.div
                            key={i}
                            variants={cardVariants}
                            whileHover="hover"
                            className="bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-[var(--primary)]/50 transition-colors duration-300"
                        >
                            {/* Subtle Watermark Icon */}
                            <div className="absolute -right-6 -bottom-6 text-9xl opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12 select-none grayscale">
                                {s.dogIcon}
                            </div>

                            <div className="flex justify-between items-start mb-6 relative">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-3xl shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                                    {s.icon}
                                </div>
                                <span className="bg-white/5 text-[var(--accent)] font-bold px-4 py-2 rounded-full text-sm border border-white/5 backdrop-blur-sm">
                                    {s.price}
                                </span>
                            </div>

                            <h2 className="text-2xl font-bold mb-3 text-white">{s.title}</h2>
                            <p className="text-gray-400 leading-relaxed mb-8 text-sm">{s.desc}</p>

                            <button
                                onClick={() => openModal(s.title)}
                                className="w-full py-3 rounded-xl bg-white/5 hover:bg-[var(--primary)] border border-white/10 hover:border-transparent transition-all duration-300 font-bold flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-purple-500/20 text-sm cursor-pointer"
                            >
                                <span>{lang === 'ar' ? 'احجز الآن' : 'Reserve Slot'}</span>
                                <span className={lang === 'ar' ? 'rotate-180' : ''}>➜</span>
                            </button>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Booking Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0f172a] border border-white/10 p-8 rounded-3xl w-full max-w-lg shadow-2xl relative"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>

                            <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                                {lang === 'ar' ? 'تأكيد الحجز' : 'Reserve Your Slot'}
                            </h2>
                            <p className="text-gray-400 mb-6 flex items-center gap-2">
                                <span className="text-[var(--primary)]">●</span>
                                {selectedService}
                            </p>

                            {status === 'success' ? (
                                <div className="text-center py-8">
                                    <div className="text-6xl mb-4">🎉</div>
                                    <h3 className="text-xl font-bold text-green-400 mb-2">{lang === 'ar' ? 'تم الحجز بنجاح!' : 'Booking Confirmed!'}</h3>
                                    <p className="text-gray-400">{lang === 'ar' ? 'نحن في انتظارك أنت وصديقك الأليف.' : 'We look forward to seeing you and your pup.'}</p>
                                </div>
                            ) : (
                                <form onSubmit={submitBooking} className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">{lang === 'ar' ? 'التاريخ المفضل' : 'Preferred Date'}</label>
                                        <input
                                            type="date"
                                            required
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[var(--primary)] focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">{lang === 'ar' ? 'ملاحظات إضافية (اختياري)' : 'Additional Notes (Optional)'}</label>
                                        <textarea
                                            rows="3"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder={lang === 'ar' ? 'أي متطلبات خاصة؟' : 'Any special requirements?'}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[var(--primary)] focus:outline-none"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] font-bold text-center hover:opacity-90 transition-opacity mt-4 disabled:opacity-50"
                                    >
                                        {status === 'loading' ? (lang === 'ar' ? 'جاري الحجز...' : 'Processing...') : (lang === 'ar' ? 'تأكيد الحجز' : 'Confirm Booking')}
                                    </button>
                                    {status === 'error' && (
                                        <p className="text-red-400 text-sm text-center mt-2">{lang === 'ar' ? 'حدث خطأ، حاول مرة أخرى.' : 'Something went wrong. Please try again.'}</p>
                                    )}
                                    {status === 'unauthenticated' && (
                                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-center">
                                            <p className="text-red-400 text-sm mb-2">{lang === 'ar' ? 'يجب تسجيل الدخول للحجز.' : 'Please sign in to make a booking.'}</p>
                                            <a href="/login" className="text-white text-sm font-bold underline hover:text-[var(--primary)] transition-colors">
                                                {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In Now'}
                                            </a>
                                        </div>
                                    )}
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
