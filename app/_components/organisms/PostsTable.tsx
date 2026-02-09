import React from "react";
import { FileText, Eye, Edit2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { PostWithRelations } from "@/app/_types/Post";
import Link from "next/link";
import { DeletePostButton } from "../molecules/DeletePostButton";
import Image from "next/image";

interface PostsTableProps {
  posts?: PostWithRelations[];
  currentPage: number;
  totalPages: number;
}

export const PostsTable: React.FC<PostsTableProps> = ({
  posts = [],
  currentPage,
  totalPages,
}) => {
  // Empty state
  if (posts.length === 0) {
    return (
      <article className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 sm:p-8 border-b border-gray-200/50 bg-linear-to-r from-blue-50/30 to-purple-50/30">
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#283583] to-[#3d4ba8] bg-clip-text text-transparent h-11">
            Postagens
          </h1>
          <Link
            href="/journalist/posts/new"
            aria-label="Criar nova postagem"
            className="w-full sm:w-auto bg-linear-to-r from-[#C4161C] to-[#e01b22] hover:from-[#a01318] hover:to-[#C4161C] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nova Postagem</span>
          </Link>
        </header>

        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-100/50 to-purple-100/50 backdrop-blur-sm flex items-center justify-center mb-6 shadow-lg border border-white/40">
            <FileText className="w-10 h-10 text-[#283583]" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-[#283583] to-[#5FAD56] bg-clip-text text-transparent mb-2">
            Nenhum post encontrado
          </h2>
          <p className="text-gray-600 mb-8 max-w-md">
            Comece criando seu primeiro post e compartilhe suas notícias com o mundo.
          </p>
          <Link
            href="/journalist/posts/new"
            aria-label="Criar primeiro post"
            className="bg-linear-to-r from-[#283583] to-[#3d4ba8] hover:from-[#1e2968] hover:to-[#283583] text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Criar Primeiro Post</span>
          </Link>
        </div>
      </article>
    );
  }

  const categoryBadgeStyle = (color: string) => ({
    background: `linear-gradient(135deg, ${color}20, ${color}40)`,
    color,
    borderColor: `${color}55`,
  });

  // Gera array de números de página para exibir
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = 5;
      }

      if (currentPage >= totalPages - 2) {
        start = totalPages - 4;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <article className="bg-white/60 rounded-2xl shadow-xl border border-white/20">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 sm:p-8 border-b border-gray-200/50 bg-linear-to-r from-blue-50/30 via-purple-50/20 to-green-50/30">
        <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#283583] to-[#3d4ba8] bg-clip-text text-transparent h-11">
          Postagens
        </h1>
        <Link
          href="/journalist/posts/new"
          aria-label="Criar nova postagem"
          className="w-full sm:w-auto bg-linear-to-r from-[#C4161C] to-[#e01b22] hover:from-[#a01318] hover:to-[#C4161C] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Postagem</span>
        </Link>
      </header>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full" role="table" aria-label="Tabela de postagens">
          <thead className="bg-linear-to-r from-gray-50/60 to-blue-50/40 backdrop-blur-sm border-b-2 border-gray-200/50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Postagem
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Categoria
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Visualizações
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/50">
            {posts.map((post) => (
              <tr
                key={post.id}
                className="hover:bg-linear-to-r hover:from-blue-50/30 hover:to-purple-50/20 transition-all duration-200"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    {post.photoUrl ? (
                      <Image
                        width={400}
                        height={400}
                        src={post.photoUrl}
                        alt={post.title}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200/50"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-linear-to-br from-blue-100/50 to-indigo-100/50 border border-blue-200/30 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-[#283583]" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{post.title}</span>
                      {post.description && (
                        <span className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                          {post.description}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border"
                    style={categoryBadgeStyle(post.category?.color || "#283583")}
                  >
                    {post.category?.name || "Sem categoria"}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      post.published
                        ? "bg-linear-to-r from-green-100/50 to-emerald-100/50 text-[#5FAD56] border border-[#5FAD56]/30"
                        : "bg-linear-to-r from-amber-100/50 to-yellow-100/50 text-amber-700 border border-amber-300/30"
                    }`}
                  >
                    {post.published ? "Publicado" : "Rascunho"}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-gray-600">
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span>{post.views || 0}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex gap-2">
                    <Link
                      href={`/journalist/posts/${post.slug}`}
                      className="p-2 bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-lg hover:bg-linear-to-r hover:from-green-50 hover:to-emerald-50 hover:border-[#5FAD56]/30 hover:text-[#5FAD56] text-gray-600 transition-all duration-200 hover:shadow-md group"
                      title="Visualizar"
                      aria-label={`Visualizar ${post.title}`}
                    >
                      <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </Link>
                    <Link
                      href={`/journalist/posts/${post.slug}/edit`}
                      className="p-2 bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-lg hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-[#283583]/30 hover:text-[#283583] text-gray-600 transition-all duration-200 group"
                      title="Editar"
                      aria-label={`Editar ${post.title}`}
                    >
                      <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </Link>
                    <DeletePostButton postSlug={post.slug} postTitle={post.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden p-4 space-y-4">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-5 hover:shadow-lg transition-all duration-300 hover:border-gray-300/50"
          >
            <div className="flex items-start gap-3 mb-4">
              {post.photoUrl ? (
                <Image
                  width={400}
                  height={400}
                  src={post.photoUrl}
                  alt={post.title}
                  className="w-20 h-20 rounded-lg object-cover border border-gray-200/50 shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-linear-to-br from-blue-100/50 to-indigo-100/50 border border-blue-200/30 shrink-0 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-[#283583]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{post.title}</h3>
                {post.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border"
                    style={categoryBadgeStyle(post.category?.color || "#283583")}
                  >
                    {post.category?.name || "Sem categoria"}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      post.published
                        ? "bg-linear-to-r from-green-100/50 to-emerald-100/50 text-[#5FAD56] border border-[#5FAD56]/30"
                        : "bg-linear-to-r from-amber-100/50 to-yellow-100/50 text-amber-700 border border-amber-300/30"
                    }`}
                  >
                    {post.published ? "Publicado" : "Rascunho"}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{post.views || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
              <div className="flex gap-2">
                <Link
                  href={`/journalist/posts/${post.slug}`}
                  className="p-2 bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-lg hover:bg-linear-to-r hover:from-green-50 hover:to-emerald-50 hover:border-[#5FAD56]/30 hover:text-[#5FAD56] text-gray-600 transition-all duration-200 group"
                  title="Visualizar"
                  aria-label={`Visualizar ${post.title}`}
                >
                  <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </Link>
                <Link
                  href={`/journalist/posts/${post.slug}/edit`}
                  className="p-2 bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-lg hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-[#283583]/30 hover:text-[#283583] text-gray-600 transition-all duration-200 group"
                  title="Editar"
                  aria-label={`Editar ${post.title}`}
                >
                  <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </Link>
                <DeletePostButton postSlug={post.slug} postTitle={post.title} />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200/50 bg-linear-to-r from-gray-50/30 to-blue-50/20">
          {/* Botão Anterior */}
          <Link
            href={currentPage > 1 ? `/journalist/posts?page=${currentPage - 1}` : "#"}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
              currentPage > 1
                ? "bg-white/60 border border-gray-200/60 text-gray-700 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-[#283583]/30 hover:text-[#283583]"
                : "bg-gray-100/50 border border-gray-200/30 text-gray-400 cursor-not-allowed"
            }`}
            aria-disabled={currentPage <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </Link>

          {/* Números das páginas */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => {
              if (page === "...") {
                return (
                  <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                    ...
                  </span>
                );
              }

              const pageNum = page as number;
              const isActive = pageNum === currentPage;

              return (
                <Link
                  key={pageNum}
                  href={`/journalist/posts?page=${pageNum}`}
                  className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-linear-to-r from-[#283583] to-[#3d4ba8] text-white shadow-md"
                      : "bg-white/60 border border-gray-200/60 text-gray-700 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-[#283583]/30 hover:text-[#283583]"
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}
          </div>

          {/* Botão Próximo */}
          <Link
            href={currentPage < totalPages ? `/journalist/posts?page=${currentPage + 1}` : "#"}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
              currentPage < totalPages
                ? "bg-white/60 border border-gray-200/60 text-gray-700 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-[#283583]/30 hover:text-[#283583]"
                : "bg-gray-100/50 border border-gray-200/30 text-gray-400 cursor-not-allowed"
            }`}
            aria-disabled={currentPage >= totalPages}
          >
            <span className="hidden sm:inline">Próximo</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </article>
  );
};