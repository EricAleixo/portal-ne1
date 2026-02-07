import { ReactNode } from "react";
import { JournalistLayout } from "../_components/layouts/JornalistLayout";

export default async function UserLayout({children}: {children: ReactNode}){
    return(
        <JournalistLayout>
            {children}
        </JournalistLayout>
    )
}