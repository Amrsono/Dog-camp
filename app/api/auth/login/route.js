import { NextResponse } from 'next/server';
import { convex } from '@/lib/convex';
import { api } from '@/convex/_generated/api';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        let user = await convex.query(api.users.getUserByEmail, { email });

        // Auto-seed admin if it doesn't exist (for demo purposes)
        if (!user && email === 'admin@dogcamp.com') {
            await convex.mutation(api.users.seedUsers, {});
            user = await convex.query(api.users.getUserByEmail, { email });
        }

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
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
