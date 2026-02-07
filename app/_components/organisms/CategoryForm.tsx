// app/_components/categorias/CategoryForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormInput } from "../molecules/FormInput";
import { FormActions } from "@/app/_actions/FormActions";
import { CategoryPreview } from "../molecules/CategoryPreview";
import { FormColorPicker } from "../molecules/FormColorPicker";
import { Tag, Sparkles } from "lucide-react";
import { categoryService } from "@/services/category.service";

interface CategoryFormProps {
  initialData?: {
    id?: number;
    name: string;
    color: string;
  };
  isEditing?: boolean;
}

export const CategoryForm = ({
  initialData,
  isEditing = false,
}: CategoryFormProps) => {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || "");
  const [color, setColor] = useState(initialData?.color || "#3B82F6");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing && initialData?.id) {
        await categoryService.update(initialData.id, {
          name,
          color,
        });
      } else {
        await categoryService.create({
          name,
          color,
        });
      }

      router.push("/category");
      router.refresh();
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      alert("Erro ao salvar categoria");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/category");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50/30 to-pink-50/40">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Info Card */}
          <div className="bg-linear-to-br from-purple-600 via-purple-700 to-pink-600 rounded-xl p-6 shadow-lg shadow-purple-200/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]" />

            <div className="relative flex items-start gap-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-white/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg mb-1">
                  {isEditing ? "Editar Categoria" : "Nova Categoria"}
                </h2>
                <p className="text-purple-100 text-sm">
                  {isEditing
                    ? "Atualize as informações da categoria abaixo"
                    : "Preencha os campos para criar uma nova categoria"}
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 sm:p-8 space-y-8">
              {/* Nome da Categoria */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nome da Categoria
                </label>
                <FormInput
                  value={name}
                  onChange={setName}
                  placeholder="Ex: Tecnologia, Esportes, Política..."
                  required
                />
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Cor da Categoria
                </label>
                <FormColorPicker value={color} onChange={setColor} />
              </div>

              {/* Divider */}
              <div className="border-t border-slate-200" />

              {/* Preview Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-slate-500" />
                  <h3 className="text-sm font-semibold text-slate-700">
                    Pré-visualização
                  </h3>
                </div>
                <CategoryPreview name={name} color={color} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <FormActions
            isSubmitting={isSubmitting}
            isEditing={isEditing}
            onCancel={handleCancel}
          />
        </form>
      </main>
    </div>
  );
};
