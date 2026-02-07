import { categoryRepository } from "../_db/_repositories/categories.repository";
import slugify from "slugify";

class CategoryService {
  async getAll() {
    return categoryRepository.getAll();
  }

  async getById(id: number) {
    return categoryRepository.getById(id);
  }

  async getBySlug(slug: string) {
    return categoryRepository.getBySlug(slug);
  }

  async create(data: { name: string; color: string }) {
    const slug = slugify(data.name, {
      lower: true,
      strict: true,
    });

    return categoryRepository.create({
      name: data.name,
      slug,
      color: data.color,
    });
  }

  async update(
    id: number,
    data: { name?: string; color?: string }
  ) {
    const slug = data.name
      ? slugify(data.name, { lower: true, strict: true })
      : undefined;

    return categoryRepository.update(id, {
      ...data,
      ...(slug && { slug }),
    });
  }

  async delete(id: number){
    return await categoryRepository.deleteById(id);
  }
}

export const categoryService = new CategoryService();
