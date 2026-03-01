import { getSessionOrThrow } from "@/app/api/_utils/session";
import { JournalistLayout } from "../layouts/JournalistLayout";
import { DashboardAnalytics } from "../organisms/DashboardAnalytics";
import { postService } from "@/app/_services/post.service";
import { redirect } from "next/navigation";

export const DashboardPage = async () => {

    const session = await getSessionOrThrow();
    if (!session) redirect("/");

    const { user } = session;

    const { posts, total } = await postService.findAll(
        user.id,
        user.role,
        undefined,
        undefined,
        "all",
    );

    return (
        <JournalistLayout>
            <DashboardAnalytics posts={posts} total={total}></DashboardAnalytics>
        </JournalistLayout>
    );
}