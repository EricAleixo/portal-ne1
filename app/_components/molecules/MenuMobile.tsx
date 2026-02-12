"use client"

import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string | null;
  color: string;
}

interface MenuMobileProps {
  allCategories: Category[];
  currentCategory?: string;
}

export const MenuMobile = ({ allCategories, currentCategory }: MenuMobileProps) => {

  return (
    <>
      {/* Menu Mobile - Carrossel Horizontal com Setas de Navegação */}
      <div className="lg:hidden relative flex items-center gap-2 border-t border-b border-gray-300 py-3">
        {/* Seta Esquerda */}
        <button
          onClick={(e) => {
            const nav = e.currentTarget.nextElementSibling as HTMLElement;
            nav.scrollBy({ left: -150, behavior: 'smooth' });
          }}
          className="shrink-0 w-8 h-8 flex items-center justify-center text-gray-600 hover:text-[#C4161C] transition-colors"
          aria-label="Rolar para esquerda"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Carrossel de Categorias */}
        <nav className="flex items-center gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory flex-1">
          <Link
            href="/"
            className="text-gray-600 hover:text-[#C4161C] font-black uppercase tracking-wide transition-all whitespace-nowrap snap-start shrink-0 px-1 text-md"
          >
            Início
          </Link>
          
          {allCategories.map((category) => {
            const isActive = category.name === currentCategory;
            return (
              <Link
                key={category.id}
                href={`/categorias/${category.slug}`}
                className={`font-black uppercase text-md tracking-wide transition-all whitespace-nowrap snap-start shrink-0 px-1 relative text-gray-600 ${
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
        </nav>

        {/* Seta Direita */}
        <button
          onClick={(e) => {
            const nav = e.currentTarget.previousElementSibling as HTMLElement;
            nav.scrollBy({ left: 150, behavior: 'smooth' });
          }}
          className="shrink-0 w-8 h-8 flex items-center justify-center text-gray-600 hover:text-[#C4161C] transition-colors"
          aria-label="Rolar para direita"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </>
  );
};