'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteUserButtonProps {
  userId: number;
  onDelete: (formData: FormData) => Promise<void>;
}

export const DeleteUserButton = ({ userId, onDelete }: DeleteUserButtonProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const formData = new FormData();
    formData.append('userId', userId.toString());
    
    try {
      await onDelete(formData);
    } catch (error) {
      console.error('Erro ao deletar:', error);
      setIsDeleting(false);
    }
  };

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        type="button"
        className="px-4 py-2.5 bg-linear-to-r from-[#C4161C] to-[#e01b22] hover:from-[#a01318] hover:to-[#C4161C] text-white font-black uppercase text-xs tracking-wide rounded-lg transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        Excluir
      </button>
    );
  }

  return (
    <div className="absolute inset-0 bg-red-50/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 rounded-2xl">
      <p className="text-sm font-bold text-red-800 mb-3 text-center">
        Confirmar exclusão?
      </p>
      <div className="flex gap-2 w-full">
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
          type="button"
          className="flex-1 px-3 py-2 border-2 border-gray-300 text-gray-700 font-black uppercase text-xs rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
        >
          Não
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          type="button"
          className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs rounded-lg transition-all disabled:opacity-50"
        >
          {isDeleting ? '...' : 'Sim'}
        </button>
      </div>
    </div>
  );
};