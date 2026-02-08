import Link from "next/link";
import Image from "next/image";
import { Calendar, User } from "lucide-react";
import { PostWithRelations } from "@/app/_types/Post";

interface SearchResultCardProps {
  post: PostWithRelations;
}

export const SearchResultCard = ({ post }: SearchResultCardProps) => {
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Imagem */}
        {post.photoUrl && (
          <div className="md:w-80 h-48 md:h-auto relative overflow-hidden shrink-0">
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
  );
};