import { categoryService } from "@/app/_services/categorie.service";
import Link from "next/link"; // ✅ CORRETO
import Image from "next/image";

export const Header = async ({
  currentCategory,
}: {
  currentCategory?: string;
}) => {
  const allCategories = await categoryService.getAll();
  
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b-4 border-[#C4161C] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center justify-between">
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

          <nav className="hidden md:flex items-center gap-8">
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
                  href={`/categorias/${category.name.toLowerCase().replace(/\s+/g, "-")}`} // ✅ CORRETO
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

            <Link
              href="/sobre"
              className="text-gray-900 hover:text-[#C4161C] font-black uppercase text-sm tracking-wide transition-all duration-300 relative group"
            >
              <span>Sobre</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C4161C] group-hover:w-full transition-all duration-300" />
            </Link>
          </nav>

          <Link
            href="/journalist/"
            className="px-6 py-3 bg-linear-to-r from-[#283583] to-[#3d4ba8] hover:from-[#1e2660] hover:to-[#283583] text-white font-black uppercase text-xs tracking-wide rounded-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            Área do Jornalista
          </Link>
        </div>
      </div>
    </header>
  );
};