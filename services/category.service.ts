import { api } from "./api";

export type Category = {
  id: number;
  name: string;
  color: string;
};

type CreateCategoryDTO = {
  name: string;
  color: string;
};

type UpdateCategoryDTO = {
  name?: string;
  color?: string;
};

class CategoryService {
  async getAll(): Promise<Category[]> {
    const response = await api.get<Category[]>("/category");
    return response.data;
  }

  async getById(id: number): Promise<Category> {
    const response = await api.get<Category>(`/category/${id}`);
    return response.data;
  }

  async create(data: CreateCategoryDTO): Promise<Category> {
    const response = await api.post<Category>("/category", data);
    return response.data;
  }

  async update(
    id: number,
    data: UpdateCategoryDTO
  ): Promise<Category> {
    const response = await api.put<Category>(
      `/category/${id}`,
      data
    );
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/category/${id}`);
  }
}

export const categoryService = new CategoryService();
