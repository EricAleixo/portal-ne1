import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { userRoleEnum } from "./roles";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    actived: boolean("actived").default(true),
    role: userRoleEnum("role").notNull().default("JOURNALIST"),
    createdAt: timestamp("created_at").defaultNow()
})