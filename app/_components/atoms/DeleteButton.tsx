// app/_components/categorias/actions/DeleteButton.tsx
'use client'

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { DeleteConfirmModal } from "../molecules/DeleteConfirmModal";

interface DeleteButtonProps {
  categoryId: number;
  categoryName: string;
}

export const DeleteButton = ({ categoryId, categoryName }: DeleteButtonProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
        title="Excluir categoria"
      >
        <Trash2 size={18} />
      </button>
      
      {showModal && (
        <DeleteConfirmModal
          categoryId={categoryId}
          categoryName={categoryName}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};