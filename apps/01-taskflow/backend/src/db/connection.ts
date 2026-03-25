import Database from "better-sqlite3"
import "dotenv/config"
import { drizzle } from "drizzle-orm/better-sqlite3"

const sqlite = new Database(process.env.DB_FILE_NAME!)
sqlite.pragma("journal_mode = WAL")
sqlite.pragma("foreign_keys = ON")

export const db = drizzle(sqlite)
