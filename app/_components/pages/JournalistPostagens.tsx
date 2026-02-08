import { PostsTable } from "../organisms/PostsTable";
import { JournalistLayout } from "../layouts/JournalistLayout";
import {  PostWithRelations } from "@/app/_types/Post";
import { postService } from "@/app/_services/post.service";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getSessionOrThrow } from "@/app/api/_utils/session";

export const JournalistPostagens = async () => {
  const session = await getSessionOrThrow();
  console.log(session)

  if (!session) redirect("/");

  const { user } = session;

  let posts: PostWithRelations[] = await postService.findAll(
    user.id,
    user.role,
  );

  return (
    <JournalistLayout>
      <PostsTable posts={posts}></PostsTable>
    </JournalistLayout>
  );
};
