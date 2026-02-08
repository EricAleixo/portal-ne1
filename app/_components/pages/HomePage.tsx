import { postService } from '@/app/_services/post.service';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, ArrowRight, Clock, Newspaper } from 'lucide-react';
import { PostWithRelations } from '@/app/_types/Post';
import { categoryService } from '@/app/_services/categorie.service';
import { Header } from '../organisms/Header';

export const HomePage = async () => {
  const allPosts = await postService.findAllPublished(50, 0);
  const allCategories = await categoryService.getAll();
  
  // Separar posts por categorias
  const featuredPost = allPosts[0];
  const recentPosts = allPosts.slice(1, 7);
  const trendingPosts = allPosts
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);

  // Agrupar por categoria
  const postsByCategory = allPosts.reduce((acc, post) => {
    const categoryName = post.category?.name || 'Sem Categoria';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(post);
    return acc;
  }, {} as Record<string, PostWithRelations[]>);

  const categories = Object.entries(postsByCategory)
    .map(([name, posts]) => ({
      name,
      posts: posts.slice(0, 4),
      color: posts[0]?.category?.color || '#283583'
    }))
    .slice(0, 3);

  if (allPosts.length === 0) {
    return <EmptyState allCategories={allCategories} />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header/Navbar */}
      <Header />

      {/* Hero Section - Destaque Principal */}
      {featuredPost && <HeroSection post={featuredPost} />}

      {/* Container Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        {/* Grid: Últimas + Em Alta */}
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
                <p className="text-gray-500 font-semibold">Nenhuma notícia recente disponível</p>
              </div>
            )}
          </section>

          {/* Em Alta - 1/3 - Sidebar Estilo Editorial */}
          <aside className="space-y-6">
            <div className="bg-linear-to-br from-[#C4161C] via-[#e01b22] to-[#C4161C] p-6 rounded-2xl shadow-2xl relative overflow-hidden">
              {/* Efeito de brilho */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              
              <div className="relative">
                <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#F9C74F] animate-pulse shadow-lg shadow-yellow-500/50" />
                  Mais Lidas
                </h2>
                
                <div className="space-y-4">
                  {trendingPosts.length > 0 ? (
                    trendingPosts.map((post, index) => (
                      <TrendingCard key={post.id} post={post} rank={index + 1} />
                    ))
                  ) : (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                      <p className="text-white/80 font-semibold text-sm">Nenhum post em destaque</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Banner Newsletter - Modernizado */}
            <div className="bg-linear-to-br from-[#283583] via-[#3d4ba8] to-[#283583] p-8 rounded-2xl shadow-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-[#5FAD56]/20 rounded-full blur-2xl" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#F9C74F]/20 rounded-full blur-2xl" />
              
              <div className="relative">
                <h3 className="text-2xl font-black mb-3 uppercase tracking-tight">Newsletter</h3>
                <p className="text-sm text-white/90 mb-5 font-medium">
                  Receba as principais notícias do Nordeste direto no seu email
                </p>
                <button className="w-full bg-white text-[#283583] font-black py-3 px-6 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 uppercase text-sm tracking-wide shadow-lg">
                  Inscrever-se
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Seções por Categoria - Layout Magazine */}
        {categories.length > 0 ? (
          categories.map((category, idx) => (
            <section key={category.name} className="space-y-8">
              <div className="flex items-center gap-4">
                <div 
                  className="h-12 w-2 rounded-full"
                  style={{ 
                    background: `linear-gradient(to bottom, ${category.color}, ${category.color}dd)` 
                  }}
                />
                <div className="flex items-center justify-between flex-1">
                  <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight">
                    {category.name}
                  </h2>
                  <Link 
                    href={`/categorias/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm font-black uppercase tracking-wide hover:underline transition-all"
                    style={{ color: category.color }}
                  >
                    Ver todas →
                  </Link>
                </div>
              </div>
              
              {/* Layout alternado */}
              {idx % 2 === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            style={{ background: `linear-gradient(135deg, ${category.color}40, ${category.color}80)` }}
                          />
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-transparent" />
                        
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                          <span 
                            className="inline-block px-4 py-2 text-xs font-black uppercase mb-4 rounded-lg shadow-lg"
                            style={{ backgroundColor: category.color, color: 'white' }}
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
                      <CompactCard key={post.id} post={post} color={category.color} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {category.posts.map((post) => (
                    <VerticalCard key={post.id} post={post} color={category.color} />
                  ))}
                </div>
              )}
            </section>
          ))
        ) : null}

      </main>

      {/* Footer */}
      <Footer allCategories={allCategories} />
    </div>
  );
}

function HeroSection({ post }: { post: PostWithRelations }) {
  return (
    <section className="relative h-[75vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {post.photoUrl ? (
          <Image
            src={post.photoUrl}
            alt={post.title}
            width={1200}
            height={1200}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-[#C4161C] via-[#283583] to-[#5FAD56]" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />
        
        {/* Efeito de overlay moderno */}
        <div className="absolute inset-0 bg-linear-to-br from-[#C4161C]/20 via-transparent to-[#283583]/20" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-20">
        <div className="max-w-4xl space-y-6">
          {post.category && (
            <span 
              className="inline-block px-5 py-2.5 text-sm font-black uppercase tracking-wider shadow-2xl rounded-lg backdrop-blur-sm"
              style={{
                backgroundColor: post.category.color,
                color: 'white'
              }}
            >
              {post.category.name}
            </span>
          )}
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white drop-shadow-2xl leading-none uppercase tracking-tighter">
            {post.title}
          </h1>
          
          {post.description && (
            <p className="text-2xl text-white/95 drop-shadow-lg font-bold max-w-3xl">
              {post.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm font-bold">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Eye className="w-4 h-4" />
              <span>{post.views || 0}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Clock className="w-4 h-4" />
              <span>
                {Math.ceil(post.content.split(' ').length / 200)} min
              </span>
            </div>
          </div>

          <Link
            href={`/posts/${post.slug}`}
            className="inline-flex items-center gap-3 px-10 py-5 bg-linear-to-r from-[#C4161C] to-[#e01b22] hover:from-[#a01318] hover:to-[#C4161C] text-white font-black uppercase tracking-wide text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/50 hover:scale-105 group rounded-xl"
          >
            <span>Leia Agora</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function PostCard({ post }: { post: PostWithRelations }) {
  const categoryColor = post.category?.color || '#283583';
  
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        {post.photoUrl ? (
          <Image
            width={1200}
            height={1200}
            src={post.photoUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <Newspaper className="w-20 h-20 text-gray-400" />
          </div>
        )}
        {post.category && (
          <span
            className="absolute top-4 left-4 px-4 py-2 text-xs font-black uppercase shadow-xl backdrop-blur-sm rounded-lg"
            style={{
              backgroundColor: `${categoryColor}ee`,
              color: 'white'
            }}
          >
            {post.category.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-3">
        <h3 className="text-xl font-black text-gray-900 group-hover:text-[#C4161C] transition-colors line-clamp-2 leading-tight">
          {post.title}
        </h3>
        
        {post.description && (
          <p className="text-gray-600 text-sm line-clamp-2 font-medium">
            {post.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t-2 border-gray-100 font-bold">
          <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('pt-BR')}</span>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{post.views || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function TrendingCard({ post, rank }: { post: PostWithRelations; rank: number }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group flex gap-3 p-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 rounded-xl border border-white/20"
    >
      {/* Rank */}
      <div className="shrink-0">
        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#F9C74F] to-[#f4a93f] flex items-center justify-center shadow-lg border-2 border-white/50">
          <span className="text-2xl font-black text-[#283583]">{rank}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-black text-white group-hover:text-[#F9C74F] transition-colors line-clamp-2 text-sm leading-tight mb-2">
          {post.title}
        </h4>
        <div className="flex items-center gap-3 text-xs text-white/80 font-bold">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{post.views || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CompactCard({ post, color }: { post: PostWithRelations; color: string }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group flex gap-4 bg-white rounded-xl p-4 hover:shadow-xl transition-all duration-300 border-l-4 hover:scale-[1.02]"
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
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <h4 className="font-black text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-3 text-sm leading-tight">
          {post.title}
        </h4>
        <div className="flex items-center gap-3 text-xs text-gray-500 font-bold">
          <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
        </div>
      </div>
    </Link>
  );
}

function VerticalCard({ post, color }: { post: PostWithRelations; color: string }) {
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
          {new Date(post.publishedAt || post.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
        </div>
      </div>
    </Link>
  );
}

function Footer({ allCategories }: { allCategories: Array<{ id: number; name: string; color: string }> }) {
  return (
    <footer className="bg-linear-to-br from-[#283583] via-[#1e2660] to-[#283583] text-white mt-20 relative overflow-hidden">
      {/* Efeitos decorativos */}
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
              Seu portal de notícias do Nordeste, trazendo informação de qualidade e relevância.
            </p>
          </div>
          <div>
            <h3 className="font-black text-xl mb-6 uppercase tracking-tight">Categorias</h3>
            <ul className="space-y-3 text-white/80 font-semibold">
              {allCategories.map((category) => (
                <li key={category.id}>
                  <Link 
                    href={`/categorias/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="hover:text-[#F9C74F] transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-black text-xl mb-6 uppercase tracking-tight">Contato</h3>
            <p className="text-white/80 font-semibold leading-relaxed">
              Email: contato@ne1noticias.com.br<br />
              Telefone: (81) 3333-4444
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/20 text-center text-sm text-white/60 font-bold">
          <p>&copy; {new Date().getFullYear()} NE1 Notícias. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

function EmptyState({ allCategories }: { allCategories: Array<{ id: number; name: string; color: string }> }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Header/>
      
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

          <Link
            href="/journalist/posts"
            className="inline-block px-10 py-5 bg-linear-to-r from-[#283583] to-[#3d4ba8] hover:from-[#1e2660] hover:to-[#283583] text-white font-black uppercase tracking-wide transition-all duration-300 hover:shadow-xl hover:scale-105 rounded-xl"
          >
            Área do Jornalista
          </Link>
        </div>
      </div>

      <Footer allCategories={allCategories} />
    </div>
  );
}