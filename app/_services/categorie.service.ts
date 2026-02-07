import { categoryRepository } from "../_db/_repositories/categories.repository";

class CategoryService{

    async getAll(){
        return await categoryRepository.getAll();
    }

    async getByName(name: string){
        return await categoryRepository.getByName(name);
    }

    async getById(id: number){
        return await categoryRepository.getById(id);
    }

}

export const categoryService = new CategoryService();