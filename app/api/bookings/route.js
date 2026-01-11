import { NextResponse } from 'next/server';
import { createBooking, initDb } from '../../lib/db_init';

// Ensure DB is properly initialized on first run
let dbInitialized = false;

export async function POST(req) {
    if (!dbInitialized) {
        await initDb();
        dbInitialized = true;
    }

    try {
        const body = await req.json();
        const { userId, serviceName, date, notes } = body;

        // Basic validation
        if (!serviceName || !date) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Use a default user ID (1) if not provided, for demo purposes if auth isn't strict
        const finalUserId = userId || 1;

        await createBooking(finalUserId, serviceName, date, notes);

        return NextResponse.json({ success: true, message: 'Booking confirmed!' });
    } catch (error) {
        console.error('Booking error:', error);
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}
