import { redirect } from "next/navigation";
import { ReactNode } from "react"
import { Sidebar } from "../organisms/SideBar";
import { JournalismHeader } from "../organisms/JournalismHeader";
import { getSessionOrThrow } from "@/app/api/_utils/session";

export const JournalistLayout = async ({children} : {children: ReactNode}) => {
  const session = await getSessionOrThrow();

  if (!session?.user?.name || !session.user.active) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Sidebar type={session.user.role} />
      <div className="flex-1 ml-0 lg:ml-64 transition-all duration-300">
        <JournalismHeader 
          user={{
            name: session.user.name,
            avatarUrl: session.user.photoProfile ?? undefined,
            role: session.user.role
          }}
        />
        <main className="px-4 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}