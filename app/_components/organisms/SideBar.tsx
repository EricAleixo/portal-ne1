import Image from "next/image";
import { Tags, Users } from 'lucide-react';
import Link from 'next/link';

export const Sidebar = ({type}: {type: string}) => {

    const isAdmin = type == "ADMIN";

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white/70 backdrop-blur-xl border-r border-white/20 z-50 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 shadow-xl">
            {/* Logo */}
            <div className="flex items-center gap-2 px-8 py-6 mb-8">
                <Image src={"/images/logo.png"} alt="Logo portal" width={40} height={40}></Image>
                <span className="text-2xl font-bold bg-linear-to-r from-[#283583] to-[#3d4ba8] bg-clip-text text-transparent">
                    NE1
                </span>
            </div>
            
            {/* Navigation */}
            <nav className="flex flex-col px-4 gap-4">
                <Link
                    href={"/journalist/posts"}
                    className="relative flex items-center gap-4 px-6 py-4 text-[#283583] bg-linear-to-r from-blue-50/60 to-indigo-50/40 backdrop-blur-sm rounded-xl font-semibold transition-all hover:from-blue-100/70 hover:to-indigo-100/50 group shadow-md border border-blue-200/30"
                >
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b from-[#C4161C] to-[#e01b22] rounded-r-full shadow-lg"></div>
                    <svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        className="shrink-0 group-hover:scale-110 transition-transform duration-200"
                    >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                    </svg>
                    <span>Postagens</span>
                </Link>
                {
                    isAdmin &&
                    <>
                        <Link
                            href={"/users"}
                            className="relative flex items-center gap-4 px-6 py-4 text-[#283583] bg-linear-to-r from-blue-50/60 to-indigo-50/40 backdrop-blur-sm rounded-xl font-semibold transition-all hover:from-blue-100/70 hover:to-indigo-100/50 group shadow-md border border-blue-200/30"
                        >
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b from-[#50c416] to-[#1ee01b] rounded-r-full shadow-lg"></div>
                            <Users></Users>
                            <span>Jornalistas</span>
                        </Link>
                        <Link
                            href={"/category"}
                            className="relative flex items-center gap-4 px-6 py-4 text-[#283583] bg-linear-to-r from-blue-50/60 to-indigo-50/40 backdrop-blur-sm rounded-xl font-semibold transition-all hover:from-blue-100/70 hover:to-indigo-100/50 group shadow-md border border-blue-200/30"
                        >
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b from-purple-600 to-pink-600 rounded-r-full shadow-lg"></div>
                            <Tags></Tags>
                            <span>Categorias</span>
                        </Link>
                    </>
                }
            </nav>
        </aside>
    );
};