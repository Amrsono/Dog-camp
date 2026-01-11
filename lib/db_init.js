import { getDb } from './db';

// Initialize the database with required tables
export async function initDb() {
    const db = await getDb();
    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'customer',
      dogName TEXT,
      dogBreed TEXT
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      serviceName TEXT,
      bookingDate TEXT,
      notes TEXT,
      status TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES users(id)
    );
  `);
}

export async function createBooking(userId, serviceName, bookingDate, notes) {
    const db = await getDb();
    await db.run(
        'INSERT INTO bookings (userId, serviceName, bookingDate, notes) VALUES (?, ?, ?, ?)',
        [userId, serviceName, bookingDate, notes]
    );
}
