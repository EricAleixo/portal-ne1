import { relations } from "drizzle-orm";
import { users } from "./users";
import { posts } from "./posts";
import { categories } from "./categories";

export const userRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postRelatios = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts),
}));
