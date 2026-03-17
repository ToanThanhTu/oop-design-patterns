import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import "dotenv/config"

const sqlite = new Database(process.env.DB_FILE_NAME!)
sqlite.pragma("journal_mode = WAL")

export const db = drizzle(sqlite)
