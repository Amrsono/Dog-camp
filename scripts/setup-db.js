const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(process.cwd(), 'dogcamp.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

function initDb() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'customer'
    )`);

        // Dogs Table
        db.run(`CREATE TABLE IF NOT EXISTS dogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER,
      name TEXT,
      breed TEXT,
      age INTEGER,
      diet_plan TEXT,
      photo_url TEXT,
      FOREIGN KEY(owner_id) REFERENCES users(id)
    )`);

        // Bookings/Transactions
        db.run(`CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      service_type TEXT,
      amount REAL,
      date TEXT,
      status TEXT DEFAULT 'pending',
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

        // Insert Admin User if not exists
        // Password is 'admin123' (in a real app, hash this!)
        db.run(`INSERT OR IGNORE INTO users (name, email, password, role) 
            VALUES ('Admin', 'admin@dogcamp.com', 'admin123', 'admin')`);

        // Insert Demo Customer
        db.run(`INSERT OR IGNORE INTO users (name, email, password, role) 
            VALUES ('John Doe', 'john@example.com', 'password', 'customer')`);

        console.log('Database tables initialized.');
    });
}

initDb();

module.exports = db;
