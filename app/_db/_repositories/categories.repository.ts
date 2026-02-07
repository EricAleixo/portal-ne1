import { db } from "..";
import { categories } from "../schema";
import { eq } from "drizzle-orm";

type CreateCategoryDTO = {
  name: string;
  slug: string;
  color: string;
};

type UpdateCategoryDTO = {
  name?: string;
  slug?: string;
  color?: string;
};

class CategoryRepository {
  async getAll() {
    return db.query.categories.findMany();
  }

  async getById(id: number) {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    return result[0] ?? null;
  }

  async getBySlug(slug: string) {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    return result[0] ?? null;
  }

  async create(data: CreateCategoryDTO) {
    const result = await db
      .insert(categories)
      .values({
        name: data.name,
        slug: data.slug,
        color: data.color,
      })
      .returning();

    return result[0];
  }

  async update(id: number, data: UpdateCategoryDTO) {
    const result = await db
      .update(categories)
      .set({
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.color && { color: data.color }),
      })
      .where(eq(categories.id, id))
      .returning();

    return result[0] ?? null;
  }

  async deleteById(id: number) {
    const result = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();

    return result[0] ?? null;
  }

}

export const categoryRepository = new CategoryRepository();
