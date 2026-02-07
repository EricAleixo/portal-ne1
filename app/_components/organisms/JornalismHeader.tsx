'use client';
import Image from "next/image";
import { Badge } from "../atoms/Badge";
import Link from "next/link";
import { LogOut, User, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

export const JournalismHeader = ({ user }: {user: {name: string, avatarUrl: string, role: string}}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const getRoleBadgeStyle = (role: string) => {
    if (role === 'ADMIN') {
      return `
        bg-gradient-to-r 
        from-red-500 
        via-red-400 
        to-red-600
        text-white 
        border-0
        shadow-sm
      `;
    }

    return `
      bg-gradient-to-r 
      from-neutral-800 
      via-neutral-700 
      to-neutral-900
      text-white 
      border-0
      shadow-sm
    `;
  };


  return (
    <header className="w-full h-20 px-6 flex items-center justify-between border-b-2 border-[#C4161C] bg-white/95 backdrop-blur-sm shadow-sm mb-11 sticky top-0 z-50">
      {/* Logo */}
      <Link href={"/"} className="flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95">
        <Image src={"/images/ne11-21.png"} alt={"Logo"} width={180} height={180} priority />
      </Link>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-4 px-3 py-2 rounded-xl hover:bg-linear-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-300 border border-transparent hover:border-gray-200 group"
        >
          {/* User Info */}
          <div className="flex flex-col items-end">
            <span className="font-bold text-gray-800 text-sm group-hover:text-[#3d4ba8] transition-colors">
              {user?.name}
            </span>
            <Badge className={`${getRoleBadgeStyle(user?.role)} font-semibold text-[10px] px-2.5 py-0.5 mt-1 shadow-sm`}>
              {user?.role}
            </Badge>
          </div>
          
          {/* Avatar with status */}
          <div className="relative">
            <div className="absolute -inset-1 bg-linear-to-r from-[#6ec263] to-[#4a9d3f] rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
            <Image
              src={user?.avatarUrl}
              alt="Avatar do usuário"
              className="relative h-12 w-12 rounded-full object-cover border-2 border-white ring-2 ring-[#6ec263] group-hover:ring-[#4a9d3f] transition-all"
              width={60}
              height={60}
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <>
            <div 
              className="fixed inset-0 z-10"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {/* User Info Card */}
              <div className="bg-linear-to-br from-[#3d4ba8] to-[#2a3580] px-5 py-4 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Image
                    src={user?.avatarUrl}
                    alt="Avatar"
                    className="h-14 w-14 rounded-full object-cover border-2 border-white/30 ring-2 ring-white/20"
                    width={56}
                    height={56}
                  />
                  <div>
                    <p className="font-bold text-base">{user?.name}</p>
                    <Badge className="bg-white/20 text-white border-0 font-medium text-xs px-2 py-0.5 mt-1">
                      {user?.role}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {/* Profile Option (opcional) */}
                <button
                  className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <User className="w-5 h-5 text-gray-500 font-semibold" />
                  <span className="font-semibold">Meu Perfil</span>
                </button>


                {/* Divider */}
                <div className="my-2 border-t border-gray-100"></div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 font-semibold group"
                >
                  <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <span>Sair da conta</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};