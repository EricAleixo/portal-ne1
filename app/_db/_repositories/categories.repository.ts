import { db } from "..";

export class CategorieRepository{

    async getAll(){
        return await db.query.categories.findMany();
    }

}

export const categoriesService = new CategorieRepository();