import { ReactNode } from "react";
import { JournalistLayout } from "../_components/layouts/JournalistLayout";
import { getSessionOrThrow } from "../api/_utils/session";
import { notFound, redirect } from "next/navigation";

export default async function UserLayout({children}: {children: ReactNode}){

    try{
        const session = await getSessionOrThrow();
        const { user } = session;
        if(!(user.role === "ADMIN")){
            notFound();
        }
        
    }catch{
        notFound();
    }

    return(
        <JournalistLayout>
            {children}
        </JournalistLayout>
    )
}