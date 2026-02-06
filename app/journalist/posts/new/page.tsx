import { JournalistLayout } from "@/app/_components/layouts/JornalistLayout";
import { CreatePost } from "@/app/_components/organisms/CreatePost";
import { categoriesService } from "@/app/_db/_repositories/categories.repository";

export default async function NewPost(){

    const categories = await categoriesService.getAll();

    return(
        <JournalistLayout>
            <CreatePost categories={categories}></CreatePost>
        </JournalistLayout>
    )
}