import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";

const DB_FILE = process.env.DB_PATH;

let db: Database | null = null;

export async function connectDB(): Promise<Database | null> {
    if (DB_FILE) {
      try {
        db = await open({
          filename: DB_FILE,
          driver: sqlite3.Database,
        });
      } catch(error) {
        console.log(error);
      }
    }
  return db;
}

export function getDB(): Database {
  if (!db) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return db;
}

export async function closeDB(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}