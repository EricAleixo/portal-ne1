import { Container } from "@/app/_components/layouts/Container";
import { PageHeader } from "@/app/_components/molecules/PageHeader";
import { CategoryForm } from "@/app/_components/organisms/CategoryForm";

export default function NewCategoryPage() {
  return (
    <>
      <PageHeader 
        title="Nova Categoria" 
        description="Crie uma nova categoria para organizar seus posts"
      />
      <CategoryForm />
    </>
  );
}