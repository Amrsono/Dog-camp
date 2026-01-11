'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function LiveFeed({ streamUrl, isLive = true, autoPlay = true, children }) {
    const videoRef = useRef(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const isMjpeg = streamUrl?.toLowerCase().includes('mjpeg') ||
        streamUrl?.toLowerCase().includes('mjpg') ||
        streamUrl?.toLowerCase().endsWith('.jpg');

    const isWebSocket = streamUrl?.startsWith('ws://') || streamUrl?.startsWith('wss://');
    const canvasRef = useRef(null);

    useEffect(() => {
        if (isLive && streamUrl) {
            if (isMjpeg) {
                // For MJPEG, the img tag handles loading/error directly
                setIsLoading(true); // Set loading true initially, img onLoad will set false
                setError(null);
            } else if (isWebSocket) {
                setIsLoading(true);
                setError(null);

                // Dynamic import of the browser player to avoid SSR issues
                import('rtsp-relay/browser').then(({ loadPlayer }) => {
                    if (canvasRef.current) {
                        try {
                            loadPlayer({
                                url: streamUrl,
                                canvas: canvasRef.current,
                                onDisconnect: () => setError("Disconnected from bridge server"),
                            });
                            setIsLoading(false);
                        } catch (err) {
                            setError("Failed to initialize WebSocket player");
                            setIsLoading(false);
                        }
                    }
                }).catch(() => {
                    setError("Relay driver not found. Ensure dependencies are installed.");
                    setIsLoading(false);
                });

            } else if (videoRef.current) {
                setIsLoading(true);
                setError(null);

                // For standard IP cam streams that browser can handle (HLS, MJPEG, or direct RTSP-to-Web links)
                videoRef.current.src = streamUrl;

                const handleCanPlay = () => {
                    setIsLoading(false);
                    if (autoPlay) {
                        videoRef.current.play().catch(err => {
                            console.error("Autoplay failed:", err);
                        });
                    }
                };

                const handleError = (e) => {
                    console.error("Video error:", e);
                    setError("Camera signal lost or invalid stream URL");
                    setIsLoading(false);
                };

                videoRef.current.addEventListener('canplay', handleCanPlay);
                videoRef.current.addEventListener('error', handleError);

                return () => {
                    if (videoRef.current) {
                        videoRef.current.removeEventListener('canplay', handleCanPlay);
                        videoRef.current.removeEventListener('error', handleError);
                    }
                };
            }
        }
    }, [streamUrl, isLive, autoPlay, isMjpeg, isWebSocket]);

    return (
        <div className="relative w-full h-full bg-[#020617] rounded-3xl overflow-hidden border border-white/10 group">
            {/* Loading State */}
            {isLoading && !error && !isMjpeg && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-900/40 backdrop-blur-sm">
                    <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400 text-sm font-medium animate-pulse">ESTABLISHING SECURE LINK...</p>
                </div>
            )}

            {/* Error State */}
            {error ? (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                        <span className="text-3xl">📡</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2 italic">NO SIGNAL</h4>
                    <p className="text-gray-400 text-sm max-w-[250px] leading-relaxed">
                        {error}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold border border-white/10 transition-colors"
                    >
                        RETRY CONNECTION
                    </button>
                </div>
            ) : isMjpeg ? (
                <img
                    src={streamUrl}
                    alt="Live Stream"
                    className="w-full h-full object-cover"
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setError("Failed to load MJPEG stream");
                        setIsLoading(false);
                    }}
                />
            ) : isWebSocket ? (
                <canvas
                    ref={canvasRef}
                    className="w-full h-full object-contain bg-black"
                    style={{ imageRendering: 'auto' }}
                />
            ) : (
                <video
                    ref={videoRef}
                    autoPlay={autoPlay}
                    muted
                    playsInline
                    className={`w-full h-full object-cover transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                />
            )}

            {/* UI Overlays */}
            <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 bg-red-600 px-3 py-1.5 rounded-full border border-red-400/50 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                            <div className="h-2 w-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                            <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">LIVE Cam 01</span>
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono tracking-tighter bg-black/40 backdrop-blur-md px-2 py-0.5 rounded self-start">
                            {new Date().toISOString().split('T')[1].slice(0, 8)} UTC
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="bg-purple-600 backdrop-blur-md px-2 py-1 rounded-lg border border-purple-400/50 shadow-[0_0_10px_rgba(147,51,234,0.3)]">
                            <span className="text-[10px] font-bold text-white tracking-widest">4K</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-end">
                    <div className="flex items-center gap-4 text-white/60">
                        <div className="flex flex-col">
                            <span className="text-[8px] uppercase tracking-widest opacity-50">Audio</span>
                            <span className="text-xs font-bold">2-Way Active</span>
                        </div>
                    </div>
                </div>

                {/* Centered Controls Overlay */}
                {children && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="pointer-events-auto">
                            {children}
                        </div>
                    </div>
                )}
            </div>

            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_100%),linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[5] bg-[length:100%_2px,2px_100%] opacity-20 group-hover:opacity-30 transition-opacity"></div>
        </div>
    );
}
