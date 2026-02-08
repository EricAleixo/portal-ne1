"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { postService } from "@/services/posts.service";
import { PostWithRelations } from "@/app/_types/Post";
import Link from "next/link";
import { Search, X, Loader2 } from "lucide-react";

export const SearchBarPost = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<PostWithRelations[]>([]);
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pesquisar ao digitar (debounce)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        setIsLoading(true);
        try {
          const { posts, total: totalResults } = await postService.search(searchTerm, 5, 0);
          setResults(posts);
          setTotal(totalResults);
          setIsOpen(true);
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
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleClear = () => {
    setSearchTerm("");
    setResults([]);
    setTotal(0);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleViewAll = () => {
    if (searchTerm.length >= 2) {
      router.push(`/pesquisa?q=${encodeURIComponent(searchTerm)}`);
      setIsOpen(false);
    }
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      {/* Input de Pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Pesquisar notícias..."
          className="w-full pl-10 pr-10 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#C4161C] transition-all duration-300 text-sm"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Dropdown de Resultados */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-2xl border border-gray-200 max-h-100 overflow-hidden z-50">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-[#C4161C] animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="max-h-80 overflow-y-auto">
                {results.map((post) => (
                  <Link
                    key={post.id}
                    href={`/noticias/${post.slug}`}
                    onClick={handleResultClick}
                    className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <h4 className="font-bold text-sm text-gray-900 line-clamp-2 mb-1">
                      {post.title}
                    </h4>
                    {post.description && (
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {post.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>

              {/* Botão Ver Mais */}
              {total > 5 && (
                <button
                  onClick={handleViewAll}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 text-[#C4161C] font-bold text-sm transition-colors border-t border-gray-200"
                >
                  Ver todos os {total} resultados
                </button>
              )}
            </>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              {searchTerm.length < 2
                ? "Digite pelo menos 2 caracteres"
                : "Nenhum resultado encontrado"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};