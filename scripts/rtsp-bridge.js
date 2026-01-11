const express = require('express');
const http = require('http');
const ffmpegPath = require('ffmpeg-static');
const net = require('net');
const { execSync } = require('child_process');
const WebSocket = require('ws');

/**
 * RTSP BRIDGE - HIGH QUALITY EDITION
 * Custom WebSocket + FFmpeg (No rtsp-relay)
 */

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/api/stream' });

const PORT = 2001;
let RTSP_URL = process.argv[2];

if (!RTSP_URL) {
    console.error('❌ Error: No RTSP URL provided.');
    process.exit(1);
}

// 1. Force Cleanup
try {
    const stdout = execSync(`netstat -ano | findstr :${PORT}`).toString();
    stdout.split('\n').forEach(line => {
        if (line.includes('LISTENING')) {
            const pid = line.trim().split(/\s+/).pop();
            if (pid && pid !== process.pid.toString()) {
                console.log(`--- Killing existing process ${pid} ---`);
                try { execSync(`taskkill /F /PID ${pid}`); } catch (e) { }
            }
        }
    });
} catch (e) { }

// 2. Parse URL
RTSP_URL = RTSP_URL.replace(/\[|\]/g, '');
const lastAt = RTSP_URL.lastIndexOf('@');
if (lastAt !== -1) {
    const creds = RTSP_URL.substring(7, lastAt);
    const host = RTSP_URL.substring(lastAt + 1);
    const [u, ...p] = creds.split(':');
    RTSP_URL = `rtsp://${u}:${encodeURIComponent(p.join(':'))}@${host}`;
}

console.log('🚀 HIGH-QUALITY BRIDGE STARTING...');
console.log('Target:', RTSP_URL);

// 3. WebSocket Logic
const { spawn } = require('child_process');

wss.on('connection', (ws) => {
    console.log(`📸 Viewport Connected [${new Date().toLocaleTimeString()}]`);

    const ffmpeg = spawn(ffmpegPath, [
        '-loglevel', 'error',
        '-rtsp_transport', 'tcp', // Force TCP to avoid artifacts and Smearing
        '-i', RTSP_URL,
        '-f', 'mpegts',
        '-codec:v', 'mpeg1video',
        '-s', '960x540',
        '-b:v', '2000k',
        '-r', '25',
        '-bf', '0',
        '-an',
        '-'
    ]);

    ffmpeg.stdout.on('data', (data) => {
        if (ws.readyState === WebSocket.OPEN) ws.send(data);
    });

    ffmpeg.stderr.on('data', (data) => {
        console.error(`[FFmpeg Error] ${data.toString()}`);
    });

    ffmpeg.on('close', () => {
        console.log('FFmpeg closed');
        ws.close();
    });

    ws.on('close', () => {
        console.log('Client left');
        ffmpeg.kill('SIGKILL');
    });
});

server.listen(PORT, () => {
    console.log(`✅ Bridge Live at ws://localhost:${PORT}/api/stream`);
});
