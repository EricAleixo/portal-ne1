import { defineConfig } from "drizzle-kit";
import "dotenv/config";

const isProd = process.env.NODE_ENV === 'production'


export default defineConfig({
  schema: "./app/_db/schema",
  out: "./app/_db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: isProd ? { rejectUnauthorized: false } : false,
  },
});
