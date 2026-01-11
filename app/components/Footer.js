'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Footer() {
    const [year, setYear] = useState('');

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    const FooterLink = ({ href, children }) => (
        <li>
            <Link
                href={href}
                className="group flex items-center text-gray-400 hover:text-[var(--primary)] transition-all duration-300"
            >
                <span className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-2">›</span>
                {children}
            </Link>
        </li>
    );

    return (
        <footer className="relative border-t border-white/10 bg-[#030014] pt-24 pb-12 overflow-hidden z-10">
            {/* Gradient Top Line */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-50"></div>

            {/* Decorative Glow */}
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[128px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            <h3 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 tracking-tight">
                                DOG CAMP
                            </h3>
                        </Link>
                        <p className="text-gray-400 leading-relaxed max-w-sm">
                            The world's first AI-powered luxury dog hosting platform. We combine premium care with cutting-edge technology to keep you connected.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            {/* Social Placeholders */}
                            {['𝕏', '📸', '▶', '💼'].map((icon, i) => (
                                <button key={i} className="w-10 h-10 rounded-full bg-white/5 hover:bg-[var(--primary)] hover:scale-110 flex items-center justify-center transition-all duration-300">
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Services Column */}
                    <div>
                        <h4 className="font-bold text-white mb-8 text-lg">Services</h4>
                        <ul className="space-y-4">
                            <FooterLink href="/services">Smart Hosting</FooterLink>
                            <FooterLink href="/live-cam">Live 4K Cam</FooterLink>
                            <FooterLink href="/services">Tele-Treats</FooterLink>
                            <FooterLink href="/services">Grooming Spa</FooterLink>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="font-bold text-white mb-8 text-lg">Company</h4>
                        <ul className="space-y-4">
                            <FooterLink href="/about">About Us</FooterLink>
                            <FooterLink href="/careers">Careers</FooterLink>
                            <FooterLink href="/contact">Contact</FooterLink>
                            <FooterLink href="/blog">Dog Blog</FooterLink>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h4 className="font-bold text-white mb-8 text-lg">Legal</h4>
                        <ul className="space-y-4">
                            <FooterLink href="/privacy">Privacy Policy</FooterLink>
                            <FooterLink href="/terms">Terms of Service</FooterLink>
                            <FooterLink href="/cookies">Cookie Policy</FooterLink>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>© {year} Dog-Camp Inc. All rights reserved.</p>
                    <div className="flex gap-8">
                        <span>Made with 💜 for Dogs</span>
                        <span>San Francisco, CA</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
