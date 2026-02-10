import { defineConfig } from "drizzle-kit";
import "dotenv/config";


export default defineConfig({
  schema: "./app/_db/schema",
  out: "./app/_db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
});
