import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Use sqlite wrapper for async/await support
export async function getDb() {
    return open({
        filename: path.join(process.cwd(), 'dogcamp.db'),
        driver: sqlite3.Database
    });
}
