// app/_components/organisms/CategoriasList.tsx
'use client';
import { useState } from 'react';
import { Tag, Plus } from 'lucide-react';
import Link from 'next/link';
import { SearchBar } from '../molecules/SearchBar';
import { CategoryCard } from '../molecules/CategoryCard';

interface Category {
  id: number;
  name: string;
  color: string;
}

interface CategoriasListProps {
  categories: Category[];
}

export const CategoriasList = ({ categories }: CategoriasListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header com busca */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar onSearch={setSearchTerm} />
        
        <Link
          href="/category/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold text-sm rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-purple-200/50 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Nova Categoria
        </Link>
      </div>

      {/* Lista de categorias */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white rounded-xl p-16 text-center shadow-sm border border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-600 font-medium">
            {searchTerm ? 'Nenhuma categoria encontrada' : 'Nenhuma categoria cadastrada'}
          </p>
          {searchTerm && (
            <p className="text-sm text-slate-400 mt-2">
              Tente ajustar os termos de busca
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
};