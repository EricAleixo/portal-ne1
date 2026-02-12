import { postService } from "@/app/_services/post.service";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  ArrowRight,
  Clock,
  Newspaper,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { PostWithRelations } from "@/app/_types/Post";
import { categoryService } from "@/app/_services/categorie.service";
import { Header } from "../organisms/Header";
import { PostCard } from "../molecules/PostCard";
import { Footer } from "../organisms/Footer";

export const HomePage = async () => {
  const allPosts = await postService.findAllPublished(50, 0);
  const allCategories = await categoryService.getAll();

  // Separar posts por categorias
  const featuredPost = allPosts[0];
  const recentPosts = allPosts.slice(1, 7);
  const trendingPosts = allPosts.slice(0, 4);

  // Agrupar por categoria
  const postsByCategory = allPosts.reduce(
    (acc, post) => {
      const categoryName = post.category?.name || "Sem Categoria";
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(post);
      return acc;
    },
    {} as Record<string, PostWithRelations[]>,
  );

  const categories = Object.entries(postsByCategory)
    .map(([name, posts]) => ({
      name,
      slug: posts[0]?.category?.slug,
      posts: posts.slice(0, 4).reverse(),
      color: posts[0]?.category?.color || "#283583",
    }))
    .slice(0, 3);

  if (allPosts.length === 0) {
    return <EmptyState allCategories={allCategories} />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header/Navbar */}
      <Header />

      {/* Grid: Últimas + Em Alta */}
      <div className="bg-white pt-2">
        <MostReadSection />
        {/* Hero Section - Destaque Principal */}
        {featuredPost && <HeroSection post={featuredPost} />}
      </div>

      {/* Container Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Últimas Notícias - 2/3 */}
          <section className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-2 bg-linear-to-b from-[#C4161C] to-[#e01b22] rounded-full" />
              <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight">
                Últimas Notícias
              </h2>
            </div>

            {recentPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-200">
                <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-semibold">
                  Nenhuma notícia recente disponível
                </p>
              </div>
            )}
          </section>

          {/* Em Alta - 1/3 - Sidebar Estilo Editorial */}
          <aside className="space-y-6">
            {/* Mais Lidas */}
            <div className="bg-linear-to-br from-[#C4161C] via-[#e01b22] to-[#C4161C] p-6 rounded-2xl shadow-2xl relative overflow-hidden">
              {/* Efeito de brilho */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

              <div className="relative">
                <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#F9C74F] animate-pulse shadow-lg shadow-yellow-500/50" />
                  Mais Lidas
                </h2>

                <div className="space-y-3">
                  {trendingPosts.length > 0 ? (
                    trendingPosts.map((post, index) => (
                      <TrendingCard
                        key={post.id}
                        post={post}
                        rank={index + 1}
                      />
                    ))
                  ) : (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                      <p className="text-white/80 font-semibold text-sm">
                        Nenhum post em destaque
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Widgets de Métricas */}
            <MetricsWidgets />
          </aside>
        </div>

        {/* Seções por Categoria - Layout Magazine */}
        {categories.length > 0
          ? categories.map((category, idx) => (
              <section
                key={category.name}
                className={`space-y-8 ${idx % 2 === 1 ? "relative" : ""}`}
              >
                {/* Fundo azul fullwidth (absolute) */}
                {idx % 2 === 1 && (
                  <div className="absolute inset-0 left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] w-screen bg-linear-to-br from-[#283583] via-[#1e2660] to-[#283583] overflow-hidden">
                    {/* Efeitos decorativos */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-[#C4161C]/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#5FAD56]/10 rounded-full blur-3xl" />
                  </div>
                )}

                {/* Conteúdo (relative para ficar acima do fundo) */}
                <div className={`relative ${idx % 2 === 1 ? "py-16" : ""}`}>
                  <div className="flex items-center gap-4">
                    <div
                      className="h-12 w-2 rounded-full"
                      style={{
                        background: `linear-gradient(to bottom, ${category.color}, ${category.color}dd)`,
                      }}
                    />
                    <div className="flex items-center justify-between flex-1 relative">
                      {idx % 2 === 1 && (
                        <span
                          style={{
                            background: `linear-gradient(to bottom, ${category.color}, ${category.color}dd)`,
                          }}
                          className="w-[107%] md:w-[103%] h-0.5 absolute -bottom-2.5 -left-6 rounded-full"
                        ></span>
                      )}
                      <h2
                        className={`text-4xl font-black uppercase tracking-tight ${
                          idx % 2 === 1 ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {category.name}
                      </h2>
                      <Link
                        href={`/categorias/${category.slug}`}
                        className={`text-sm font-black uppercase tracking-wide hover:underline transition-all ${
                          idx % 2 === 1 ? "text-white" : ""
                        }`}
                        style={idx % 2 === 1 ? {} : { color: category.color }}
                      >
                        Ver todas →
                      </Link>
                    </div>
                  </div>

                  {/* Layout alternado */}
                  {idx % 2 === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      {/* Featured Large */}
                      {category.posts[0] && (
                        <Link
                          href={`/posts/${category.posts[0].slug}`}
                          className="group md:row-span-2 relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
                        >
                          <div className="relative h-full min-h-100">
                            {category.posts[0].photoUrl ? (
                              <Image
                                src={category.posts[0].photoUrl}
                                alt={category.posts[0].title}
                                width={1200}
                                height={1200}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                            ) : (
                              <div
                                className="w-full h-full"
                                style={{
                                  background: `linear-gradient(135deg, ${category.color}40, ${category.color}80)`,
                                }}
                              />
                            )}
                            <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-transparent" />

                            <div className="absolute bottom-0 left-0 right-0 p-8">
                              <span
                                className="inline-block px-4 py-2 text-xs font-black uppercase mb-4 rounded-lg shadow-lg"
                                style={{
                                  backgroundColor: category.color,
                                  color: "white",
                                }}
                              >
                                {category.name}
                              </span>
                              <h3 className="text-3xl font-black text-white leading-tight mb-3 group-hover:text-[#F9C74F] transition-colors">
                                {category.posts[0].title}
                              </h3>
                              {category.posts[0].description && (
                                <p className="text-white/90 text-sm line-clamp-2 font-medium">
                                  {category.posts[0].description}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      )}

                      {/* 3 cards menores */}
                      <div className="space-y-6">
                        {category.posts.slice(1, 4).map((post) => (
                          <CompactCard
                            key={post.id}
                            post={post}
                            color={category.color}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                      {category.posts.map((post) => (
                        <VerticalCard
                          key={post.id}
                          post={post}
                          color={category.color}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            ))
          : null}
      </main>

      {/* Footer */}
      <Footer allCategories={allCategories} />
    </div>
  );
};

function HeroSection({ post }: { post: PostWithRelations }) {
  return (
    <section className="relative bg-white">
      <Link href={`/posts/${post.slug}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 ">
            {/* Image */}
            <div
              style={{ borderColor: post.category.color }}
              className="relative aspect-4/3 overflow-hidden rounded-md border-b-15"
            >
              {post.photoUrl ? (
                <Image
                  src={post.photoUrl}
                  alt={post.title}
                  width={1200}
                  height={900}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-[#C4161C] via-[#283583] to-[#5FAD56]" />
              )}
            </div>
            {/* Content */}
            <div className="md:space-y-5">
              {post.category && (
                <span
                  className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded"
                  style={{
                    backgroundColor: post.category.color,
                    color: "white",
                  }}
                >
                  {post.category.name}
                </span>
              )}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {post.title}
              </h1>
              {post.description && (
                <p className="text-lg text-gray-600 leading-relaxed">
                  {post.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
function TrendingCard({
  post,
  rank,
}: {
  post: PostWithRelations;
  rank: number;
}) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 rounded-xl border border-white/20 overflow-hidden"
    >
      <div className="flex gap-3 p-3">
        {/* Rank Badge + Image Container */}
        <div className="shrink-0 space-y-2">
          {/* Rank Badge */}
          <div className="w-20 h-8 rounded-lg bg-linear-to-br from-[#F9C74F] to-[#f4a93f] flex items-center justify-center shadow-lg border border-white/50">
            <span className="text-lg font-black text-[#283583]">#{rank}</span>
          </div>

          {/* Image */}
          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white/5">
            {post.photoUrl ? (
              <Image
                width={200}
                height={200}
                src={post.photoUrl}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-white/10 flex items-center justify-center">
                <Newspaper className="w-8 h-8 text-white/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {post.category && (
            <span
              className="inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wide rounded"
              style={{
                backgroundColor: post.category.color,
                color: "white",
              }}
            >
              {post.category.name}
            </span>
          )}

          <h4 className="font-black text-white group-hover:text-[#F9C74F] transition-colors line-clamp-2 text-sm leading-tight">
            {post.title}
          </h4>
        </div>
      </div>
    </Link>
  );
}

function CompactCard({
  post,
  color,
}: {
  post: PostWithRelations;
  color: string;
}) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group flex items-center gap-4 bg-white rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
      style={{ borderColor: color }}
    >
      <div className="relative w-28 h-28 shrink-0 rounded-lg overflow-hidden bg-gray-100">
        {post.photoUrl ? (
          <Image
            width={1200}
            height={1200}
            src={post.photoUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Newspaper className="w-10 h-10 text-gray-400" />
          </div>
        )}
        <div
          style={{ background: `${color}` }}
          className="absolute top-0 left-0 w-6 h-3"
        ></div>
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <h4 className="font-black text-black transition-colors line-clamp-3 text-base leading-tight">
          {post.title}
        </h4>
      </div>
    </Link>
  );
}

function VerticalCard({
  post,
  color,
}: {
  post: PostWithRelations;
  color: string;
}) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-t-4"
      style={{ borderColor: color }}
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {post.photoUrl ? (
          <Image
            width={1200}
            height={1200}
            src={post.photoUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Newspaper className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h4 className="font-black text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-3 text-sm leading-tight">
          {post.title}
        </h4>
        <div className="text-xs text-gray-500 font-bold">
          {new Date(post.publishedAt || post.createdAt).toLocaleDateString(
            "pt-BR",
            { day: "2-digit", month: "short" },
          )}
        </div>
      </div>
    </Link>
  );
}

async function MetricsWidgets() {
  // Buscar cotação do dólar
  let usdData = null;
  try {
    const usdResponse = await fetch(
      "https://economia.awesomeapi.com.br/json/last/USD-BRL",
      {
        next: { revalidate: 300 }, // Cache de 5 minutos
      },
    );
    if (usdResponse.ok) {
      const data = await usdResponse.json();
      usdData = data.USDBRL;
    }
  } catch (error) {
    console.error("Erro ao buscar cotação:", error);
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-lg border-t-4 border-[#5FAD56]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-[#5FAD56]/10 flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-[#5FAD56]" />
        </div>
        <div>
          <span className="text-xs font-black text-gray-600 uppercase block">
            Cotação
          </span>
          <span className="text-[10px] font-bold text-gray-500">USD / BRL</span>
        </div>
      </div>
      {usdData ? (
        <div className="space-y-2">
          <div className="text-3xl font-black text-gray-900">
            R$ {parseFloat(usdData.bid).toFixed(2)}
          </div>
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-1 text-sm font-bold ${
                parseFloat(usdData.varBid) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {parseFloat(usdData.varBid) >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {parseFloat(usdData.varBid) >= 0 ? "+" : ""}
                {usdData.varBid}%
              </span>
            </div>
            <span className="text-xs text-gray-500 font-semibold">
              Atualizado:{" "}
              {new Date(usdData.create_date).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500 font-semibold">
          Carregando cotação...
        </div>
      )}
    </div>
  );
}

function EmptyState({
  allCategories,
}: {
  allCategories: Array<{
    id: number;
    name: string;
    color: string;
    slug: string | null;
  }>;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 lg:p-16 border-t-8 border-[#C4161C]">
          <div className="w-32 h-32 mx-auto mb-8 rounded-2xl bg-linear-to-br from-[#C4161C]/20 via-[#283583]/20 to-[#5FAD56]/20 flex items-center justify-center">
            <Newspaper className="w-16 h-16 text-[#283583]" />
          </div>

          <h1 className="text-5xl font-black text-gray-900 mb-6 uppercase tracking-tight">
            Nenhuma notícia publicada ainda
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-semibold">
            Em breve você encontrará aqui as melhores notícias do Nordeste.
            Estamos preparando conteúdo de qualidade para você!
          </p>
        </div>
      </div>

      <Footer allCategories={allCategories} />
    </div>
  );
}

/**
 * Extrai palavras-chave significativas do título
 * Remove artigos, preposições e palavras comuns
 * Retorna as 2-3 primeiras palavras relevantes
 */
function extractKeywords(title: string): string {
  const stopWords = [
    "o", "a", "os", "as", "um", "uma", "uns", "umas",
    "de", "da", "do", "das", "dos", "em", "no", "na",
    "nos", "nas", "para", "com", "por", "sobre", "ao",
    "aos", "à", "às", "e", "ou", "que", "se", "mais",
    "muito", "nova", "novo",
  ];

  const words = title
    .toLowerCase()
    .replace(/[^a-záàâãéêíóôõúçüñ\s]/gi, "") // ← Preserva acentos PT-BR
    .split(" ")
    .filter((word) => word.length > 0);

  const keywords = words.filter(
    (word) => !stopWords.includes(word) && word.length > 2,
  );

  const selectedKeywords = keywords.slice(0, 2);

  return selectedKeywords
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function MostReadSection() {
  const posts = await postService.findMostViewed();

  return (
    <section className="relative w-full mx-auto">
      {/* Container */}
      <div className="bg-white border-b-2 border-gray-200 px-4">
        {/* Carrossel Horizontal - Design minimalista */}
        <div className="relative">
          {/* Scroll Container */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-8 w-fit mx-auto">
              <p className="font-extralight text-gray-900 whitespace-nowrap">
                Mais Lidos
              </p>
              {posts.map((article) => {
                const keywords = extractKeywords(article.title);

                return (
                  <Link
                    key={article.id}
                    href={`/posts/${article.slug}`}
                    className="group shrink-0 relative"
                  >
                    {/* Texto com palavras-chave */}
                    <span className="text-[#283583] hover:text-[#C4161C] font-bold uppercase text-sm tracking-wide transition-all duration-300 whitespace-nowrap relative">
                      {keywords}

                      {/* Underline indicator (aparece no hover ou se ativo) */}
                      <span className="absolute -bottom-2 left-0 w-0 h-1 bg-[#C4161C] group-hover:w-full transition-all duration-300 rounded-full" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
