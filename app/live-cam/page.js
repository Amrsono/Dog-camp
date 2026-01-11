'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LiveCam() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to customer dashboard cam tab
        router.push('/dashboard/customer');
    }, [router]);

    return (
        <div className="min-h-screen bg-[var(--dark)] flex items-center justify-center text-white">
            <p className="animate-pulse">Redirecting to secure feed...</p>
        </div>
    );
}
