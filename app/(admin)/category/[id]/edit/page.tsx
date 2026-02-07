import { Container } from "@/app/_components/layouts/Container";
import { PageHeader } from "@/app/_components/molecules/PageHeader";
import { CategoryForm } from "@/app/_components/organisms/CategoryForm";
import { EditCategoryPage } from "@/app/_components/pages/EditCategoryPage";

interface EditCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCategory({ params }: EditCategoryPageProps) {
  const { id } = await params;
  
  return(
    <EditCategoryPage id={id}/>
  )
}