// app/_components/categorias/actions/EditButton.tsx
'use client'

import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";

interface EditButtonProps {
  categoryId: number;
}

export const EditButton = ({ categoryId }: EditButtonProps) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/category/${categoryId}/edit`);
  };

  return (
    <button
      onClick={handleEdit}
      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
      title="Editar categoria"
    >
      <Edit size={18} />
    </button>
  );
};