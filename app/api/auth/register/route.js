import { NextResponse } from 'next/server';
import { convex } from '@/lib/convex';
import { api } from '@/convex/_generated/api';

export async function POST(request) {
    try {
        const { name, email, password, dogName, dogBreed, role = 'customer' } = await request.json();

        const userId = await convex.mutation(api.users.createUser, {
            name,
            email,
            password,
            role,
            dogName,
            dogBreed
        });

        return NextResponse.json({ userId, message: 'User registered successfully' });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
