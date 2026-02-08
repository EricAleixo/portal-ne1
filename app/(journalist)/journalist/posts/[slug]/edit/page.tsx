import { JournalistLayout } from "@/app/_components/layouts/JournalistLayout";
import { EditPost } from "@/app/_components/organisms/EditPost";
import { categoryService } from "@/app/_services/categorie.service";
import { postService } from "@/app/_services/post.service";
import { notFound } from "next/navigation";

export default async function Edit({params} : {params: Promise<{slug: string}>}){

    const { slug } = await params;
    const post = await postService.findBySlug(slug);
    const categories = await categoryService.getAll();

    if(!post){
        notFound();
    }

    return(
        <JournalistLayout>
            <EditPost post={post} categories={categories}></EditPost>
        </JournalistLayout>
    )

}