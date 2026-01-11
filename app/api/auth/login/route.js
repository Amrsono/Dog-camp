import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        const db = await getDb();

        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 });
        }

        // In a real app, compare hashed passwords!
        if (user.password !== password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Basic session/cookie handling would happen here. 
        // For this demo, we'll return the user info (minus password)
        const { password: _, ...userWithoutPass } = user;

        return NextResponse.json({ user: userWithoutPass });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
