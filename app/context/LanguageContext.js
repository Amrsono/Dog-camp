'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../lib/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState('en');

    useEffect(() => {
        // Check local storage or browser preference
        const savedLang = localStorage.getItem('site_lang');
        if (savedLang) {
            setLang(savedLang);
        }
    }, []);

    useEffect(() => {
        // Update document direction
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        if (lang === 'ar') {
            document.body.classList.add('font-ar');
        } else {
            document.body.classList.remove('font-ar');
        }

        localStorage.setItem('site_lang', lang);
    }, [lang]);

    const t = translations[lang];

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
