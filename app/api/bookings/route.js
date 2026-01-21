import { NextResponse } from 'next/server';
import { convex } from '@/lib/convex';
import { api } from '@/convex/_generated/api';

export async function POST(req) {
    try {
        const body = await req.json();
        const { userId, serviceName, date, notes } = body;

        // Basic validation
        if (!serviceName || !date) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // In Convex, we need a valid ID. For demo, if no userId, we might need a fallback
        // but ideally the client should provide it after login.
        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
        }

        await convex.mutation(api.users.createBooking, {
            userId,
            serviceName,
            bookingDate: date,
            notes: notes || ""
        });

        return NextResponse.json({ success: true, message: 'Booking confirmed!' });
    } catch (error) {
        console.error('Booking error:', error);
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}
