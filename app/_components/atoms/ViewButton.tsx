// app/_components/categorias/actions/ViewButton.tsx
'use client'

import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";

interface ViewButtonProps {
  categoryId: number;
}

export const ViewButton = ({ categoryId }: ViewButtonProps) => {
  const router = useRouter();

  const handleView = () => {
    router.push(`/category/${categoryId}`);
  };

  return (
    <button
      onClick={handleView}
      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
      title="Ver categoria"
    >
      <Eye size={18} />
    </button>
  );
};