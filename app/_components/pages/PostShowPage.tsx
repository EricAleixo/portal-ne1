import { postService } from '@/app/_services/post.service';
import { Calendar, Eye, ArrowLeft, Tag, User, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';

interface PostShowPageProps {
  slug: string
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
    color: postWithRelations.category?.color || '#283583',
    borderColor: `${postWithRelations.category?.color}55`,
  };

  const session = await getServerSession();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header com logo e navegação */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo e Voltar */}
            <div className="flex items-center gap-6">
              <Link href="/" className="shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="NE1 Notícias"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              </Link>
              
              <Link
                href="/"
                className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-[#283583] transition-colors group"
              >
                <span className="font-medium">Voltar</span>
              </Link>
            </div>
            
            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                  postWithRelations.published
                    ? 'bg-linear-to-r from-green-100/50 to-emerald-100/50 text-[#5FAD56] border border-[#5FAD56]/30'
                    : 'bg-linear-to-r from-amber-100/50 to-yellow-100/50 text-amber-700 border border-amber-300/30'
                }`}
              >
                {postWithRelations.published ? 'Publicado' : 'Rascunho'}
              </span>
            </div>
          </div>
          
          {/* Botão voltar mobile */}
          <Link
            href="/journalist/posts"
            className="sm:hidden flex items-center gap-2 text-gray-600 hover:text-[#283583] transition-colors group mt-3"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Voltar para postagens</span>
          </Link>
        </div>
      </header>

      {/* Hero Section com imagem */}
      <div className="relative">
        {postWithRelations.photoUrl ? (
          <div className="relative h-[60vh] w-full overflow-hidden">
            {/* Overlay com cores da identidade visual */}
            <div className="absolute inset-0 bg-linear-to-t from-[#283583]/80 via-[#C4161C]/20 to-transparent z-10" />
            <Image
              src={postWithRelations.photoUrl}
              alt={postWithRelations.title}
              className="w-full h-full object-cover"
              width={1200}
              height={1200}
            />
            <div className="absolute bottom-0 left-0 right-0 z-20 p-8 lg:p-12">
              <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                  {postWithRelations.title}
                </h1>
                {postWithRelations.description && (
                  <p className="text-xl text-white/95 max-w-3xl drop-shadow-lg">
                    {postWithRelations.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative bg-linear-to-br from-[#283583] via-[#3d4ba8] to-[#4e5fc0] py-20 lg:py-32 overflow-hidden">
            {/* Decoração com cores da marca */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#C4161C]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#5FAD56]/10 rounded-full blur-3xl" />
            
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                {postWithRelations.title}
              </h1>
              {postWithRelations.description && (
                <p className="text-xl text-white/95 max-w-3xl drop-shadow-md">
                  {postWithRelations.description}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Meta informações com cores da identidade */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-linear-to-br from-[#283583]/10 to-[#3d4ba8]/10">
                <User className="w-4 h-4 text-[#283583]" />
              </div>
              <span className="font-medium text-gray-900">
                {postWithRelations.author?.name || 'Autor Desconhecido'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-linear-to-br from-[#C4161C]/10 to-[#e01b22]/10">
                <Calendar className="w-4 h-4 text-[#C4161C]" />
              </div>
              <time className="font-medium">
                {new Date(postWithRelations.publishedAt || postWithRelations.createdAt).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </time>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-linear-to-br from-[#5FAD56]/10 to-emerald-500/10">
                <Clock className="w-4 h-4 text-[#5FAD56]" />
              </div>
              <span className="font-medium">
                {Math.ceil(postWithRelations.content.split(' ').length / 200)} min de leitura
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-linear-to-br from-blue-500/10 to-indigo-500/10">
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-medium">{postWithRelations.views || 0} visualizações</span>
            </div>

            {postWithRelations.category && (
              <span
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border ml-auto shadow-sm"
                style={categoryBadgeStyle}
              >
                {postWithRelations.category.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="prose prose-lg prose-slate max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h1:text-4xl prose-h1:text-[#283583]
            prose-h2:text-3xl prose-h2:text-[#283583]
            prose-h3:text-2xl prose-h3:text-gray-800
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-a:text-[#C4161C] prose-a:no-underline hover:prose-a:underline prose-a:font-medium
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-blockquote:border-l-4 prose-blockquote:border-[#C4161C] prose-blockquote:bg-gray-50 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:italic
            prose-img:rounded-xl prose-img:shadow-xl prose-img:border prose-img:border-gray-200
            prose-code:bg-[#283583]/5 prose-code:text-[#283583] prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-medium
            prose-pre:bg-[#283583] prose-pre:text-gray-100 prose-pre:shadow-lg"
          dangerouslySetInnerHTML={{ __html: postWithRelations.content }}
        />

        {/* Tags */}
        {postWithRelations.tags && postWithRelations.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t-2 border-gradient-to-r from-[#283583]/20 via-[#C4161C]/20 to-[#5FAD56]/20">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="p-2 rounded-lg bg-linear-to-br from-[#283583]/10 to-[#3d4ba8]/10">
                <Tag className="w-5 h-5 text-[#283583]" />
              </div>
              {postWithRelations.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-linear-to-r from-gray-100 to-gray-50 hover:from-[#283583]/10 hover:to-[#3d4ba8]/10 text-gray-700 hover:text-[#283583] rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer border border-gray-200 hover:border-[#283583]/30 shadow-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Footer com ações - cores da identidade */}
      <div className="bg-linear-to-r from-white/80 via-blue-50/40 to-white/80 backdrop-blur-xl border-t border-gray-200/50 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm font-medium">
              Última atualização: {new Date(postWithRelations.updatedAt).toLocaleDateString('pt-BR')}
            </p>
            {
              session?.user &&
              <div className="flex gap-3">
                <Link
                  href={`/journalist/posts/${postWithRelations.slug}/edit`}
                  className="px-6 py-2.5 bg-linear-to-r from-[#283583] to-[#3d4ba8] hover:from-[#1e2660] hover:to-[#283583] text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#283583]/25 hover:-translate-y-0.5"
                >
                  Editar Postagem
                </Link>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}