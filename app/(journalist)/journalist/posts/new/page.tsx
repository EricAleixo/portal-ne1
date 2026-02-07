import { JournalistLayout } from "@/app/_components/layouts/JornalistLayout";
import { CreatePost } from "@/app/_components/organisms/CreatePost";
import { categoryService } from "@/app/_services/categorie.service";

export default async function NewPost(){

    const categories = await categoryService.getAll();

    return(
        <JournalistLayout>
            <CreatePost categories={categories}></CreatePost>
        </JournalistLayout>
    )
}