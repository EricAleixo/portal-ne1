// app/_components/molecules/CategoryCard.tsx
'use client';
import { Tag, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  color: string;
}

interface CategoryCardProps {
  category: Category;
  onDelete: (formData: FormData) => Promise<void>;
}

export const CategoryCard = ({ category, onDelete }: CategoryCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
      return;
    }

    setIsDeleting(true);
    const formData = new FormData();
    formData.append('categoryId', category.id.toString());
    
    try {
      await onDelete(formData);
    } catch (error) {
      alert('Erro ao excluir categoria');
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Color Header */}
      <div 
        className="h-2 w-full"
        style={{ backgroundColor: category.color }}
      />

      <div className="p-5">
        {/* Header com ações */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ring-1 ring-slate-200"
              style={{ 
                backgroundColor: `${category.color}20`,
              }}
            >
              <Tag 
                className="w-5 h-5" 
                style={{ color: category.color }}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {category.name}
              </h3>
            </div>
          </div>

          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              disabled={isDeleting}
            >
              <MoreVertical className="w-4 h-4 text-slate-500" />
            </button>

            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                  <Link
                    href={`/category/${category.id}/edit`}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Editar
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {isDeleting ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Color Preview */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          <span className="text-xs font-medium text-slate-500">Cor:</span>
          <code 
            className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold shadow-sm"
            style={{ 
              backgroundColor: category.color,
              color: getContrastColor(category.color)
            }}
          >
            {category.color}
          </code>
        </div>
      </div>
    </div>
  );
};

// Função auxiliar para determinar se o texto deve ser claro ou escuro
function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
} 