import { LanguageProvider } from './context/LanguageContext';
import { ConvexClientProvider } from './ConvexClientProvider';
import './globals.css'

export const metadata = {
    title: 'Dog-Camp | Premium Dog Hosting',
    description: 'A customized dog world where owners stay connected.',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Cairo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </head>
            <body className="antialiased min-h-screen" suppressHydrationWarning>
                <ConvexClientProvider>
                    <LanguageProvider>
                        {children}
                    </LanguageProvider>
                </ConvexClientProvider>
            </body>
        </html>
    )
}
