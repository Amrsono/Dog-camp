const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

let RTSP_URL = process.argv[2];

if (!RTSP_URL) {
    console.error('Usage: node scripts/test-cam.js "rtsp://user:pass@ip:554/stream1"');
    process.exit(1);
}

console.log('--- FFmpeg Protocol Diagnostic ---');
console.log('Target:', RTSP_URL);

async function runTest(args, label) {
    return new Promise((resolve) => {
        console.log(`\n--- Testing ${label} ---`);
        const ffmpeg = spawn(ffmpegPath, args);
        let output = '';

        ffmpeg.stderr.on('data', (data) => {
            output += data.toString();
            process.stdout.write(data);
        });

        ffmpeg.on('close', (code) => {
            if (code === 0) {
                console.log(`\n✅ ${label} SUCCESS!`);
                resolve(true);
            } else {
                console.log(`\n❌ ${label} FAILED (Code ${code})`);
                resolve(false);
            }
        });
    });
}

(async () => {
    // Test 1: Standard TCP
    const success1 = await runTest([
        '-rtsp_transport', 'tcp',
        '-i', RTSP_URL,
        '-frames:v', '1',
        '-f', 'null',
        '-'
    ], 'TCP TRANSPORT');
    if (success1) process.exit(0);

    // Test 2: UDP (Sometimes needed)
    const success2 = await runTest([
        '-rtsp_transport', 'udp',
        '-i', RTSP_URL,
        '-frames:v', '1',
        '-f', 'null',
        '-'
    ], 'UDP TRANSPORT');
    if (success2) process.exit(0);

    // Test 3: No auth in URL (Check if it prompts)
    const lastAtIndex = RTSP_URL.lastIndexOf('@');
    const hostPart = RTSP_URL.substring(lastAtIndex + 1);
    const success3 = await runTest([
        '-i', `rtsp://${hostPart}`,
        '-frames:v', '1',
        '-f', 'null',
        '-'
    ], 'NO AUTH IN URL (Check Response)');

    console.log('\n🚫 DIAGNOSTIC SUMMARY:');
    console.log('The "400 Bad Request" error strongly suggests the camera does not understand the request.');
    console.log('CRITICAL: Check Tapo App -> Settings -> Advanced Settings -> Camera Account.');
    console.log('Ensure you created a USERNAME and PASSWORD there (this is NOT your Tapo email/password).');
})();
