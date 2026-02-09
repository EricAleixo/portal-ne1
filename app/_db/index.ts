import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import "dotenv/config"

const isProd = process.env.NODE_ENV === 'production'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    ssl: isProd ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool, { schema });