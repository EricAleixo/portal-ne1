import { postService } from "@/app/_services/post.service";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, Clock, Newspaper, ArrowLeft } from "lucide-react";
import { PostWithRelations } from "@/app/_types/Post";
import { notFound } from "next/navigation";
import { categoryService } from "@/app/_services/categorie.service";
import { Header } from "@/app/_components/organisms/Header";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const {slug} = await(params); 

  // Buscar categoria
  const category = await categoryService.getBySlug(slug);

  if (!category) {
    notFound();
  }

  // Buscar todos os posts publicados
  const allPosts = await postService.findAllPublished(100, 0);

  // Filtrar posts pela categoria
  const categoryPosts = allPosts.filter(
    (post) => post.category?.id === category.id,
  );

  const allCategories = await categoryService.getAll();

  // Separar posts
  const featuredPost = categoryPosts[0];
  const otherPosts = categoryPosts.slice(1);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header currentCategory={category.name} />

      {/* Hero da Categoria */}
      <section
        className="relative py-20 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${category.color}15, ${category.color}30)`,
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: category.color }}
          />
          <div
            className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: category.color }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-6 mb-6">
            <div
              className="h-20 w-3 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <div>
              <h1 className="text-6xl font-black text-gray-900 uppercase tracking-tight">
                {category.name}
              </h1>
              <p className="text-xl text-gray-600 font-semibold mt-2">
                {categoryPosts.length}{" "}
                {categoryPosts.length === 1 ? "notícia" : "notícias"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {categoryPosts.length === 0 ? (
          <EmptyCategory
            categoryName={category.name}
            categoryColor={category.color}
          />
        ) : (
          <div className="space-y-16">
            {/* Post em Destaque */}
            {featuredPost && (
              <section>
                <h2 className="text-3xl font-black text-gray-900 uppercase mb-8 flex items-center gap-4">
                  <div
                    className="h-10 w-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  Destaque
                </h2>
                <FeaturedPostCard
                  post={featuredPost}
                  categoryColor={category.color}
                />
              </section>
            )}

            {/* Outros Posts */}
            {otherPosts.length > 0 && (
              <section>
                <h2 className="text-3xl font-black text-gray-900 uppercase mb-8 flex items-center gap-4">
                  <div
                    className="h-10 w-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  Todas as Notícias
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      categoryColor={category.color}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer allCategories={allCategories} />
    </div>
  );
}


function FeaturedPostCard({
  post,
  categoryColor,
}: {
  post: PostWithRelations;
  categoryColor: string;
}) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500"
    >
      <div className="relative h-125">
        {post.photoUrl ? (
          <img
            src={post.photoUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${categoryColor}40, ${categoryColor}80)`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-10">
          <span
            className="inline-block px-5 py-2.5 text-sm font-black uppercase mb-5 rounded-lg shadow-lg"
            style={{ backgroundColor: categoryColor, color: "white" }}
          >
            {post.category?.name}
          </span>
          <h3 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-4 group-hover:text-[#F9C74F] transition-colors">
            {post.title}
          </h3>
          {post.description && (
            <p className="text-white/90 text-lg line-clamp-2 font-medium mb-6">
              {post.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm font-bold">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(
                  post.publishedAt || post.createdAt,
                ).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Eye className="w-4 h-4" />
              <span>{post.views || 0}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Clock className="w-4 h-4" />
              <span>{Math.ceil(post.content.split(" ").length / 200)} min</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function PostCard({
  post,
  categoryColor,
}: {
  post: PostWithRelations;
  categoryColor: string;
}) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4"
      style={{ borderColor: categoryColor }}
    >
      <div className="relative h-56 overflow-hidden bg-gray-100">
        {post.photoUrl ? (
          <img
            src={post.photoUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <Newspaper className="w-20 h-20 text-gray-400" />
          </div>
        )}
      </div>

      <div className="p-6 space-y-3">
        <h3 className="text-xl font-black text-gray-900 group-hover:opacity-80 transition-opacity line-clamp-2 leading-tight">
          {post.title}
        </h3>

        {post.description && (
          <p className="text-gray-600 text-sm line-clamp-2 font-medium">
            {post.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t-2 border-gray-100 font-bold">
          <span>
            {new Date(post.publishedAt || post.createdAt).toLocaleDateString(
              "pt-BR",
            )}
          </span>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{post.views || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function EmptyCategory({
  categoryName,
  categoryColor,
}: {
  categoryName: string;
  categoryColor: string;
}) {
  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <div
        className="w-32 h-32 mx-auto mb-8 rounded-2xl flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${categoryColor}20, ${categoryColor}40)`,
        }}
      >
        <Newspaper className="w-16 h-16" style={{ color: categoryColor }} />
      </div>

      <h2 className="text-4xl font-black text-gray-900 mb-4 uppercase">
        Nenhuma notícia encontrada
      </h2>

      <p className="text-lg text-gray-600 font-semibold mb-8">
        Ainda não há notícias publicadas na categoria{" "}
        <strong>{categoryName}</strong>.
        <br />
        Volte em breve para conferir novidades!
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-[#C4161C] to-[#e01b22] hover:from-[#a01318] hover:to-[#C4161C] text-white font-black uppercase tracking-wide transition-all duration-300 hover:shadow-xl hover:scale-105 rounded-xl"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar para Home
      </Link>
    </div>
  );
}

function Footer({
  allCategories,
}: {
  allCategories: Array<{ id: number; name: string; color: string }>;
}) {
  return (
    <footer className="bg-linear-to-br from-[#283583] via-[#1e2660] to-[#283583] text-white mt-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#C4161C]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#5FAD56]/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Image
              src="/images/logo.png"
              alt="NE1 Notícias"
              width={160}
              height={50}
              className="h-12 w-auto mb-6 brightness-0 invert"
            />
            <p className="text-white/80 font-medium leading-relaxed">
              Seu portal de notícias do Nordeste, trazendo informação de
              qualidade e relevância.
            </p>
          </div>
          <div>
            <h3 className="font-black text-xl mb-6 uppercase tracking-tight">
              Categorias
            </h3>
            <ul className="space-y-3 text-white/80 font-semibold">
              {allCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categorias/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="hover:text-[#F9C74F] transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-black text-xl mb-6 uppercase tracking-tight">
              Contato
            </h3>
            <p className="text-white/80 font-semibold leading-relaxed">
              Email: contato@ne1noticias.com.br
              <br />
              Telefone: (81) 3333-4444
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/20 text-center text-sm text-white/60 font-bold">
          <p>
            &copy; {new Date().getFullYear()} NE1 Notícias. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
