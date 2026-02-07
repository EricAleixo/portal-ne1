import { db } from "..";
import { categories } from "../schema";
import { eq } from "drizzle-orm"

class CategoryRepository{

    async getAll(){
        return await db.query.categories.findMany();
    }

    async getByName(name: string) {
        const result = await db
        .select()
        .from(categories)
        .where(eq(categories.name, name))
        .limit(1);
        return result[0] || null;
    }

    async getById(id: number) {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
        return result[0] || null;
    }

}

export const categoryRepository = new CategoryRepository();