'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteConfirmModalProps {
  categoryId: number;
  categoryName: string;
  onClose: () => void;
}

export const DeleteConfirmModal = ({ categoryId, categoryName, onClose }: DeleteConfirmModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      router.refresh();
      onClose();
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      alert('Erro ao deletar categoria');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Confirmar exclusão</h3>
        <p className="text-gray-600 mb-6">
          Tem certeza que deseja excluir a categoria <strong>{categoryName}</strong>? 
          Esta ação não pode ser desfeita.
        </p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
};