// app/_components/pages/CategoriasPage.tsx
import { categoryService } from "@/app/_services/categorie.service";
import { Tag, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { CategoriasList } from "../organisms/CategoriasList";

export const CategoriasPage = async () => {
  const categories = await categoryService.getAll();


  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50/30 to-pink-50/40">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/journalist/posts"
                className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all duration-200 hover:-translate-x-0.5 group"
              >
                <ArrowLeft className="w-4 h-4 text-slate-700 group-hover:text-slate-900" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Gerenciamento de Categorias
                </h1>
                <p className="text-sm text-slate-500 font-medium mt-0.5">
                  Gerencie as categorias do site
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Card */}
        <div className="mb-6 bg-linear-to-br from-purple-600 via-purple-700 to-pink-600 rounded-xl p-6 shadow-lg shadow-purple-200/50 relative overflow-hidden group hover:shadow-xl hover:shadow-purple-200/60 transition-all duration-300">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]" />
          
          <div className="relative flex items-center gap-5">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/20 group-hover:scale-105 transition-transform duration-300">
              <Tag className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-purple-100 font-medium text-xs uppercase tracking-wider mb-1">
                Total de Categorias
              </p>
              <p className="text-4xl font-bold text-white">{categories.length}</p>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <CategoriasList categories={categories} />
      </main>
    </div>
  );
};