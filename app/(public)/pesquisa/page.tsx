"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PostWithRelations } from "@/app/_types/Post";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2, Calendar, User } from "lucide-react";
import { postService } from "@/services/posts.service";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  // Buscar resultados
  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) return;

      setIsLoading(true);
      try {
        const { posts: newPosts, total: totalResults } = await postService.search(
          query,
          limit,
          offset
        );
        
        if (offset === 0) {
          setPosts(newPosts as PostWithRelations[]);
        } else {
          setPosts((prev) => [...prev, ...(newPosts as PostWithRelations[])]);
        }
        
        setTotal(totalResults);
        setHasMore(offset + limit < totalResults);
      } catch (error) {
        console.error("Erro ao buscar resultados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, limit, offset]);

  // Reset ao mudar query
  useEffect(() => {
    setOffset(0);
    setPosts([]);
  }, [query]);

  const handleLoadMore = () => {
    setOffset((prev) => prev + limit);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (query.length < 2) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pesquisar Notícias
          </h1>
          <p className="text-gray-600">
            Digite pelo menos 2 caracteres para pesquisar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Resultados da Pesquisa
          </h1>
          <p className="text-gray-600">
            {isLoading && offset === 0 ? (
              "Pesquisando..."
            ) : (
              <>
                {total} {total === 1 ? "resultado encontrado" : "resultados encontrados"} para{" "}
                <span className="font-bold text-[#C4161C]">"{query}"</span>
              </>
            )}
          </p>
        </div>

        {/* Resultados */}
        {isLoading && offset === 0 ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-[#C4161C] animate-spin" />
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/noticias/${post.slug}`}
                className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Imagem */}
                  {post.photoUrl && (
                    <div className="md:w-80 h-48 md:h-auto relative overflow-hidden">
                      <Image
                        src={post.photoUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Conteúdo */}
                  <div className="flex-1 p-6">
                    {/* Categoria */}
                    {post.category && (
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mb-3"
                        style={{
                          backgroundColor: `${post.category.color}20`,
                          color: post.category.color,
                        }}
                      >
                        {post.category.name}
                      </span>
                    )}

                    {/* Título */}
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-3 group-hover:text-[#C4161C] transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    {/* Descrição */}
                    {post.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.description}
                      </p>
                    )}

                    {/* Metadados */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {post.author && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{post.author.name}</span>
                        </div>
                      )}
                      {post.publishedAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Nenhum resultado encontrado
            </h2>
            <p className="text-gray-600">
              Tente pesquisar com outros termos
            </p>
          </div>
        )}

        {/* Botão Carregar Mais */}
        {hasMore && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-8 py-3 bg-[#C4161C] hover:bg-[#a01218] text-white font-bold rounded-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Carregando...
                </span>
              ) : (
                "Carregar Mais"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}