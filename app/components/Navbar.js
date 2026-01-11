'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { lang, setLang, t } = useLanguage();

    const toggleLang = () => {
        setLang(lang === 'en' ? 'ar' : 'en');
    };

    return (
        <nav className="fixed w-full z-50 top-0 left-0 transition-all duration-300 bg-[#030014]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <span className="text-3xl">🐕</span>
                        <Link href="/" className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                            DOG CAMP
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ms-10 flex items-center gap-6">
                            <Link href="/" className="text-gray-300 hover:text-white transition-colors px-3 py-2 text-sm font-medium hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                                {t?.nav?.home || 'Home'}
                            </Link>
                            <Link href="/services" className="text-gray-300 hover:text-white transition-colors px-3 py-2 text-sm font-medium hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                                {t?.nav?.services || 'Services'}
                            </Link>
                            <Link href="/live-cam" className="text-gray-300 hover:text-white transition-colors px-3 py-2 text-sm font-medium hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                                {t?.nav?.liveCam || 'Live Cam'}
                            </Link>
                            <button
                                onClick={toggleLang}
                                className="text-white bg-white/10 px-3 py-1 rounded-md text-sm font-bold hover:bg-white/20 transition-all"
                            >
                                {lang === 'en' ? '🇺🇸 EN' : '🇪🇬 AR'}
                            </button>
                            <Link href="/login" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2 rounded-full transition-all duration-300 text-xs font-bold shadow-lg shadow-purple-900/20 hover:shadow-purple-700/40 hover:scale-105 border border-white/10">
                                {t?.nav?.login || 'Client Login'}
                            </Link>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden items-center gap-4">
                        <button
                            onClick={toggleLang}
                            className="text-white bg-white/10 px-3 py-1 rounded-md text-sm font-bold hover:bg-white/20 transition-all"
                        >
                            {lang === 'en' ? 'EN' : 'AR'}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-[#0f172a] border-t border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">
                            {t?.nav?.home || 'Home'}
                        </Link>
                        <Link href="/services" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">
                            {t?.nav?.services || 'Services'}
                        </Link>
                        <Link href="/live-cam" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">
                            {t?.nav?.liveCam || 'Live Cam'}
                        </Link>
                        <Link href="/login" className="block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-2 rounded-md text-base font-medium text-center mt-4">
                            {t?.nav?.login || 'Login'}
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
