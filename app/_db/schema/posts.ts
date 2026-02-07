import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { categories } from "./categories";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  
  title: text("title").notNull(),

  slug: text("slug").notNull().unique(),

  description: text("description").notNull(),

  content: text("content").notNull(),

  photoUrl: text("photo_url"),
  
  tags: text("tags").array().notNull().default([]),

  views: integer("views").notNull().default(0),

  authorId: integer("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),

  published: boolean("published").notNull().default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),

  updatedAt: timestamp("updated_at").notNull().defaultNow(),

  publishedAt: timestamp("published_at")
});