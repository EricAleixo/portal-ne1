import { Container } from "../layouts/Container";
import { PageHeader } from "../molecules/PageHeader";
import { CategoryForm } from "../organisms/CategoryForm";

export const EditCategoryPage = ({id}: {id: string}) => {
      
      // Buscar categoria
      // const category = await categoryService.findById(parseInt(id));
      // if (!category) notFound();
    
      // Dados mockados para exemplo
      const category = {
        id: parseInt(id),
        name: "Tecnologia",
        color: "#3B82F6"
      };
    
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