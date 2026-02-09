import { PostsTable } from "../organisms/PostsTable";
import { JournalistLayout } from "../layouts/JournalistLayout";
import { PostWithRelations } from "@/app/_types/Post";
import { postService } from "@/app/_services/post.service";
import { redirect } from "next/navigation";
import { getSessionOrThrow } from "@/app/api/_utils/session";

interface JournalistPostagensProps {
  currentPage: number;
}

export const JournalistPostagens = async ({ currentPage }: JournalistPostagensProps) => {
  const session = await getSessionOrThrow();
  if (!session) redirect("/");

  const { user } = session;
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const { posts, total } = await postService.findAll(
    user.id,
    user.role,
    limit,
    offset
  );

  const totalPages = Math.ceil(total / limit);

  return (
    <JournalistLayout>
      <PostsTable 
        posts={posts} 
        currentPage={currentPage} 
        totalPages={totalPages} 
      />
    </JournalistLayout>
  );
};