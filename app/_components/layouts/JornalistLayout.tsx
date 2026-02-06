import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react"
import { Sidebar } from "../organisms/SideBar";
import { JournalismHeader } from "../organisms/JornalismHeader";

export const JournalistLayout = async ({children} : {children: ReactNode}) =>{
    const session = await getServerSession();

    if(!session || !session.user.name) redirect("/");

    return(
        <div className="flex min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
            <Sidebar />
            <div className="flex-1 ml-0 lg:ml-64 transition-all duration-300">
                <JournalismHeader user={{
                    name: session.user.name,
                    avatarUrl: "https://github.com/ericAleixo.png"
                }}></JournalismHeader>
                <main className="px-4 md:px-8">
                    {children}
                </main>
            </div>
        </div>
    )
}