"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { postService } from "@/services/posts.service";
import { PostWithRelations } from "@/app/_types/Post";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Loader2 } from "lucide-react";

export const SearchButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<PostWithRelations[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focar no input quando abrir o modal
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Fechar modal com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Pesquisar ao digitar (debounce)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        setIsLoading(true);
        try {
          const { posts, total: totalResults } = await postService.search(
            searchTerm,
            8,
            0
          );
          setResults(posts);
          setTotal(totalResults);
        } catch (error) {
          console.error("Erro ao pesquisar:", error);
          setResults([]);
          setTotal(0);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setTotal(0);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm("");
    setResults([]);
    setTotal(0);
  };

  const handleViewAll = () => {
    if (searchTerm.length >= 2) {
      router.push(`/pesquisa?q=${encodeURIComponent(searchTerm)}`);
      handleClose();
    }
  };

  const handleResultClick = () => {
    handleClose();
  };

  return (
    <>
      {/* Botão de Pesquisa */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 border-2 border-gray-200 rounded-lg transition-all duration-300 hover:shadow-md group"
      >
        <Search className="w-5 h-5 text-gray-600 group-hover:text-[#C4161C] transition-colors" />
        <span className="hidden md:inline text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">
          Pesquisar
        </span>
      </button>

      {/* Modal de Pesquisa */}
      {isOpen && (
        <div className="fixed inset-0 z-1000000 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={handleClose}
          />

          <div className="absolute top-0 h-screen w-screen bg-black/60 backdrop-blur-sm flex items-center justify-center">
            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 slide-in-from-top-4 duration-200">
              {/* Header com Input */}
              <div className="border-b-2 border-gray-200 p-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Pesquisar notícias..."
                    className="w-full pl-14 pr-12 py-4 text-lg font-medium border-0 focus:outline-none focus:ring-0 placeholder:text-gray-400"
                  />
                  <button
                    onClick={handleClose}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {/* Dica de pesquisa */}
                <p className="mt-3 text-xs font-medium text-gray-500 pl-14">
                  Digite pelo menos 2 caracteres para pesquisar
                </p>
              </div>
              {/* Resultados */}
              <div className="max-h-[60vh] overflow-y-auto">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 text-[#C4161C] animate-spin mb-4" />
                    <p className="text-sm font-medium text-gray-500">
                      Procurando notícias...
                    </p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="py-2">
                    {results.map((post) => (
                      <Link
                        key={post.id}
                        href={`/posts/${post.slug}`}
                        onClick={handleResultClick}
                        className="flex gap-4 px-6 py-4 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 last:border-b-0 group"
                      >
                        {/* Thumbnail */}
                        {post.photoUrl && (
                          <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              width={200}
                              height={200}
                              src={post.photoUrl}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {post.category && (
                            <span
                              className="inline-block px-2 py-1 text-[10px] font-black uppercase tracking-wide rounded mb-2"
                              style={{
                                backgroundColor: `${post.category.color}20`,
                                color: post.category.color,
                              }}
                            >
                              {post.category.name}
                            </span>
                          )}
                          <h4 className="font-black text-sm text-gray-900 line-clamp-2 mb-1 group-hover:text-[#C4161C] transition-colors">
                            {post.title}
                          </h4>
                          {post.description && (
                            <p className="text-xs text-gray-500 line-clamp-1 font-medium">
                              {post.description}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : searchTerm.length >= 2 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="font-black text-lg text-gray-900 mb-2">
                      Nenhum resultado encontrado
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      Tente pesquisar com outras palavras-chave
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-linear-to-br from-[#C4161C]/10 to-[#283583]/10 flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-[#283583]" />
                    </div>
                    <h3 className="font-black text-lg text-gray-900 mb-2">
                      Comece a pesquisar
                    </h3>
                    <p className="text-sm text-gray-500 font-medium max-w-xs">
                      Digite o que você está procurando e encontre as melhores
                      notícias
                    </p>
                  </div>
                )}
              </div>
              {/* Footer - Ver Todos */}
              {total > 8 && results.length > 0 && (
                <div className="border-t-2 border-gray-200 p-4">
                  <button
                    onClick={handleViewAll}
                    className="w-full px-6 py-3 bg-linear-to-r from-[#C4161C] to-[#e01b22] hover:from-[#a01318] hover:to-[#C4161C] text-white font-black uppercase text-sm tracking-wide rounded-lg transition-all duration-300 hover:shadow-xl"
                  >
                    Ver todos os {total} resultados
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};