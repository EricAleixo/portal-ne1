import { categoryService } from "@/app/_services/categorie.service";
import { PageHeader } from "../molecules/PageHeader";
import { CategoryForm } from "../organisms/CategoryForm";
import { notFound } from "next/navigation";

export const EditCategoryPage = async ({id}: {id: string}) => {
      
      // Buscar categoria
      const category = await categoryService.getById(parseInt(id));
      if (!category) notFound();
    
      return (
        <>
          <PageHeader 
            title="Editar Categoria" 
            description="Atualize as informações da categoria"
          />
          <CategoryForm initialData={category} isEditing />
        </>
      );
}