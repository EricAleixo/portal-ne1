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