"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PostWithRelations } from "@/app/_types/Post";
import { postService } from "@/services/posts.service";
import { Search, Loader2 } from "lucide-react";
import { SearchResultCard } from "../molecules/SearchResultCard";

export const SearchResultsContainer = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [total, setTotal] = useState(0);
  const LIMIT = 15;
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Buscar resultados
  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) return;

      // Se offset === 0, é a primeira busca
      const isFirstLoad = offset === 0;
      
      if (isFirstLoad) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const { posts: newPosts, total: totalResults } = await postService.search(
          query,
          LIMIT,
          offset
        );

        if (isFirstLoad) {
          setPosts(newPosts as PostWithRelations[]);
        } else {
          setPosts((prev) => [...prev, ...(newPosts as PostWithRelations[])]);
        }

        setTotal(totalResults);
      } catch (error) {
        console.error("Erro ao buscar resultados:", error);
        setPosts([]);
        setTotal(0);
      } finally {
        if (isFirstLoad) {
          setIsLoading(false);
        } else {
          setIsLoadingMore(false);
        }
      }
    };

    fetchResults();
  }, [query, offset]);

  // Reset ao mudar query
  useEffect(() => {
    setOffset(0);
    setPosts([]);
  }, [query]);

  const handleLoadMore = () => {
    setOffset((prev) => prev + LIMIT);
  };

  // Verificar se tem mais posts
  const hasMore = posts.length < total;
  const isEndOfResults = !hasMore && posts.length > 0;

  // Validação de query mínima
  if (query.length < 2) {
    return (
      <div className="text-center py-16">
        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Pesquisar Notícias
        </h1>
        <p className="text-gray-600">
          Digite pelo menos 2 caracteres para pesquisar
        </p>
      </div>
    );
  }

  // Loading inicial
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-[#C4161C] animate-spin" />
      </div>
    );
  }

  // Sem resultados
  if (!isLoading && posts.length === 0) {
    return (
      <div className="text-center py-16">
        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Nenhum resultado encontrado
        </h2>
        <p className="text-gray-600">
          Tente pesquisar com outros termos para{" "}
          <span className="font-bold text-[#C4161C]">"{query}"</span>
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          Resultados da Pesquisa
        </h1>
        <p className="text-gray-600">
          {total} {total === 1 ? "resultado encontrado" : "resultados encontrados"} para{" "}
          <span className="font-bold text-[#C4161C]">"{query}"</span>
        </p>
      </div>

      {/* Lista de Resultados */}
      <div className="space-y-6">
        {posts.map((post) => (
          <SearchResultCard key={post.id} post={post} />
        ))}
      </div>

      {/* Botões de Paginação */}
      <div className="mt-8 text-center">
        {hasMore ? (
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-8 py-3 bg-[#C4161C] hover:bg-[#a01218] text-white font-bold rounded-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Carregando...
              </span>
            ) : (
              "Ver Mais"
            )}
          </button>
        ) : isEndOfResults ? (
          <div className="py-4">
            <p className="text-gray-500 font-medium">
              Você chegou ao fim dos resultados
            </p>
          </div>
        ) : null}
      </div>
    </>
  );
};