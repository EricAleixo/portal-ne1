import { postService } from "@/app/_services/post.service";
import { Calendar, ArrowLeft, Tag, User, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { Header } from "../organisms/Header";

interface PostShowPageProps {
  slug: string;
}

export const PostShowPage = async ({ slug }: PostShowPageProps) => {
  const post = await postService.findBySlug(slug);

  if (!post) {
    notFound();
  }

  const postWithRelations = await postService.findById(post.id);

  if (!postWithRelations) {
    notFound();
  }

  const categoryBadgeStyle = {
    background: `linear-gradient(135deg, ${postWithRelations.category?.color}20, ${postWithRelations.category?.color}40)`,
    color: postWithRelations.category?.color || "#283583",
    borderColor: `${postWithRelations.category?.color}55`,
  };

  

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      <Header/>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#283583] hover:text-[#1e2866] mb-8 transition-colors font-medium group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Voltar para o início
        </Link>

        {/* Hero Section com imagem */}
        {postWithRelations.photoUrl ? (
          <div className="mb-8">
            <div className="relative w-full h-100 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={postWithRelations.photoUrl}
                alt={postWithRelations.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Título e descrição abaixo da imagem */}
            <div className="mt-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {postWithRelations.title}
              </h1>
              {postWithRelations.description && (
                <p className="text-xl text-gray-600 leading-relaxed">
                  {postWithRelations.description}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="relative mb-8 rounded-2xl overflow-hidden shadow-lg bg-linear-to-br from-[#283583] to-[#1e2866] p-12">
            {/* Decoração com cores da marca */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {postWithRelations.title}
              </h1>
              {postWithRelations.description && (
                <p className="text-xl text-blue-100 leading-relaxed">
                  {postWithRelations.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Meta informações com cores da identidade */}
        <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-2">
            {postWithRelations.author?.photoProfile &&
            !postWithRelations.author.photoProfile.includes(
              "avatar-placeholder",
            ) ? (
              <Image
                src={postWithRelations.author.photoProfile}
                alt={postWithRelations.author.name || "Autor"}
                width={40}
                height={40}
                className="rounded-full border-2 border-[#283583]"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#283583] to-[#1e2866] flex items-center justify-center text-white font-bold border-2 border-[#283583]">
                {postWithRelations.author?.name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
            <span className="text-gray-700 font-medium">
              {postWithRelations.author?.name || "Autor Desconhecido"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(
                postWithRelations.publishedAt || postWithRelations.createdAt,
              ).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>
              {Math.ceil(postWithRelations.content.split(" ").length / 200)}{" "}
              min de leitura
            </span>
          </div>

          {postWithRelations.category && (
            <div
              className="px-4 py-1.5 rounded-full text-sm font-medium border"
              style={categoryBadgeStyle}
            >
              {postWithRelations.category.name}
            </div>
          )}
        </div>

        {/* Conteúdo principal */}
        <article
          className="prose prose-lg max-w-none mb-12
            prose-headings:text-gray-900 prose-headings:font-bold
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-a:text-[#283583] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900
            prose-code:text-[#283583] prose-code:bg-blue-50 prose-code:px-2 prose-code:py-1 prose-code:rounded
            prose-pre:bg-gray-900 prose-pre:text-gray-100
            prose-img:rounded-xl prose-img:shadow-lg"
          dangerouslySetInnerHTML={{ __html: postWithRelations.content }}
        />

        {/* Tags */}
        {postWithRelations.tags && postWithRelations.tags.length > 0 && (
          <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-[#283583]" />
              <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {postWithRelations.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-linear-to-r from-blue-50 to-indigo-50 text-[#283583] rounded-lg text-sm font-medium border border-blue-100 hover:border-[#283583] transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer com ações - cores da identidade */}
        <div className="pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          Última atualização:{" "}
          {new Date(postWithRelations.updatedAt).toLocaleDateString("pt-BR")}
        </div>
      </div>
    </div>
  );
};