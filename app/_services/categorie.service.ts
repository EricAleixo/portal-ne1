import { categoriesService } from "../_db/_repositories/categories.repository";

export class CategorieService{

    async getAll(){
        return await categoriesService.getAll();
    }

}