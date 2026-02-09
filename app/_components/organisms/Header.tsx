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
  
  // Condição: primeiras 5 no desktop, todas no dropdown se passar de 5
  const primaryCategories = allCategories.slice(0, 5);
  const hasMoreCategories = allCategories.length > 5;
  const remainingCategories = hasMoreCategories ? allCategories.slice(5) : [];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b-4 border-[#C4161C] shadow-lg">
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
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            <Link
              href="/"
              className="text-gray-900 hover:text-[#C4161C] font-black uppercase text-sm tracking-wide transition-all duration-300 relative group"
            >
              <span>Início</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C4161C] group-hover:w-full transition-all duration-300" />
            </Link>

            {primaryCategories.map((category) => {
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

            {/* Dropdown "Mais" - Apenas se tiver mais de 5 categorias */}
            {hasMoreCategories && (
              <div className="relative group">
                <button className="text-gray-900 hover:text-[#C4161C] font-black uppercase text-sm tracking-wide transition-all duration-300 flex items-center gap-1 cursor-pointer">
                  <span>Mais</span>
                  <svg
                    className="w-4 h-4 transition-transform group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute top-full right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top group-hover:scale-100 scale-95">
                  <div className="bg-white rounded-xl shadow-2xl border-2 border-gray-100 overflow-hidden">
                    <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {remainingCategories.map((category) => {
                        const isActive = category.name === currentCategory;
                        return (
                          <Link
                            key={category.id}
                            href={`/categorias/${category.slug}`}
                            className={`block px-5 py-3.5 font-bold uppercase text-sm tracking-wide transition-all duration-200 border-l-4 ${
                              isActive
                                ? "bg-gray-50"
                                : "hover:bg-gray-50 border-l-transparent"
                            }`}
                            style={
                              isActive
                                ? {
                                    color: category.color,
                                    borderLeftColor: category.color,
                                  }
                                : {}
                            }
                          >
                            <div className="flex items-center justify-between">
                              <span>{category.name}</span>
                              {isActive && (
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Search Button + Área do Jornalista */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <SearchButton />

            {/* Área do Jornalista - Apenas para usuários logados */}
            {session?.user && (
              <Link
                href="/journalist/posts"
                className="hidden md:block px-6 py-3 bg-linear-to-r from-[#283583] to-[#3d4ba8] hover:from-[#1e2660] hover:to-[#283583] text-white font-black uppercase text-xs tracking-wide rounded-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                Área do Jornalista
              </Link>
            )}
          </div>
        </div>

        {/* Menu Mobile - Carrossel Horizontal com TODAS as categorias */}
        <nav className="flex lg:hidden items-center gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          <Link
            href="/"
            className="text-gray-900 hover:text-[#C4161C] font-black uppercase text-xs tracking-wide transition-all whitespace-nowrap snap-start shrink-0 px-1"
          >
            Início
          </Link>
          
          {allCategories.map((category) => {
            const isActive = category.name === currentCategory;
            return (
              <Link
                key={category.id}
                href={`/categorias/${category.slug}`}
                className={`font-black uppercase text-xs tracking-wide transition-all whitespace-nowrap snap-start shrink-0 px-1 relative ${
                  isActive ? "pb-1" : ""
                }`}
                style={isActive ? { color: category.color } : {}}
              >
                {category.name}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                )}
              </Link>
            );
          })}
          
          {/* Indicador visual de scroll */}
          {allCategories.length > 3 && (
            <div className="shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 animate-pulse">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          )}
        </nav>

        {/* Botão Área do Jornalista Mobile */}
        {session?.user && (
          <div className="md:hidden mt-3 pt-3 border-t border-gray-200">
            <Link
              href="/journalist/posts"
              className="block w-full text-center px-6 py-3 bg-linear-to-r from-[#283583] to-[#3d4ba8] hover:from-[#1e2660] hover:to-[#283583] text-white font-black uppercase text-xs tracking-wide rounded-lg transition-all duration-300 active:scale-95"
            >
              Área do Jornalista
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};