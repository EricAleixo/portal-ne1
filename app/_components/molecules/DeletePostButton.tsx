"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { postService } from "@/services/posts.service";

interface DeletePostButtonProps {
  postId: number;
  postTitle: string;
}

export const DeletePostButton: React.FC<DeletePostButtonProps> = ({
  postId,
  postTitle,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleDelete = async () => {
    if (!password) {
      setError("Digite sua senha");
      return;
    }

    // Validação extra do ID
    if (!postId || isNaN(Number(postId))) {
      setError("ID do post inválido");
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      await postService.delete(Number(postId), password);
      setShowModal(false);
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao deletar post");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-lg hover:bg-linear-to-r hover:from-red-50 hover:to-pink-50 hover:border-[#C4161C]/30 hover:text-[#C4161C] text-gray-600 transition-all duration-200 hover:shadow-md group"
        title="Deletar"
        aria-label={`Deletar ${postTitle}`}
      >
        <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Confirmar exclusão
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja deletar <strong>{postTitle}</strong>? Esta
              ação não pode ser desfeita.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Digite sua senha para confirmar
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleDelete()}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C4161C] focus:border-transparent"
                placeholder="Sua senha"
                disabled={isDeleting}
                autoFocus
              />
              {error && (
                <p className="text-red-600 text-sm mt-2">{error}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setPassword("");
                  setError("");
                }}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 rounded-xl bg-linear-to-r from-[#C4161C] to-[#e01b22] hover:from-[#a01318] hover:to-[#C4161C] text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deletando..." : "Deletar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};