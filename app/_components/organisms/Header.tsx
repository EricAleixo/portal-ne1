import { categoryService } from "@/app/_services/categorie.service";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SearchButton } from "../molecules/SearchBarPost";

export const Header = async ({
  currentCategory,
}: {
  currentCategory?: string;
}) => {
  const allCategories = await categoryService.getAll();
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-10000000000000 bg-white/95 backdrop-blur-xl border-b-4 border-[#C4161C] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Linha Principal: Logo + Nav Desktop + Search + Área Jornalista */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <Link
            href="/"
            className="shrink-0 transform hover:scale-105 transition-transform"
          >
            <Image
              src="/images/logo.png"
              alt="NE1 Notícias"
              width={160}
              height={50}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link
              href="/"
              className="text-gray-900 hover:text-[#C4161C] font-black uppercase text-sm tracking-wide transition-all duration-300 relative group"
            >
              <span>Início</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C4161C] group-hover:w-full transition-all duration-300" />
            </Link>

            {allCategories.slice(0, 5).map((category) => {
              const isActive = category.name === currentCategory;
              return (
                <Link
                  key={category.id}
                  href={`/categorias/${category.slug}`}
                  className={`font-black uppercase text-sm tracking-wide transition-all duration-300 relative group ${
                    isActive ? "text-opacity-100" : "text-gray-900"
                  }`}
                  style={isActive ? { color: category.color } : {}}
                >
                  <span className="group-hover:opacity-80">
                    {category.name}
                  </span>
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                    style={{ backgroundColor: category.color }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Search Button + Área do Jornalista */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <SearchButton />

            {/* Área do Jornalista - Apenas para usuários logados */}
            {session?.user && (
              <Link
                href="/journalist/"
                className="hidden md:block px-6 py-3 bg-linear-to-r from-[#283583] to-[#3d4ba8] hover:from-[#1e2660] hover:to-[#283583] text-white font-black uppercase text-xs tracking-wide rounded-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                Área do Jornalista
              </Link>
            )}
          </div>
        </div>

        {/* Menu Mobile */}
        <nav className="flex lg:hidden items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <Link
            href="/"
            className="text-gray-900 hover:text-[#C4161C] font-black uppercase text-xs tracking-wide transition-all whitespace-nowrap"
          >
            Início
          </Link>
          {allCategories.slice(0, 5).map((category) => {
            const isActive = category.name === currentCategory;
            return (
              <Link
                key={category.id}
                href={`/categorias/${category.slug}`}
                className="font-black uppercase text-xs tracking-wide transition-all whitespace-nowrap"
                style={isActive ? { color: category.color } : {}}
              >
                {category.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};