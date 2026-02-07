import Image from 'next/image';
import Link from 'next/link';
import { Home, Search, Newspaper } from 'lucide-react';
import { Header } from './_components/organisms/Header';

export default async function NotFound() {
  
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header Completo */}
      <Header></Header>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl w-full text-center">
          {/* Card Principal */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 lg:p-16 relative overflow-hidden border-t-8 border-[#C4161C]">
            {/* Efeitos decorativos */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C4161C]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#283583]/5 rounded-full blur-3xl" />
            
            <div className="relative flex items-center flex-col">
              {/* Ícone 404 */}
              <div className="mb-10">
                <div className="w-40 h-40 mx-auto rounded-2xl bg-[#C4161C]/10 flex items-center justify-center border-4 border-white shadow-xl">
                  <Newspaper className="w-20 h-20 text-[#C4161C]" />
                </div>
              </div>

              {/* Título 404 */}
              <div className="mb-8">
                <h1 className="text-[180px] leading-none font-black text-[#C4161C] mb-4">
                  404
                </h1>
                <div className="h-2 w-32 mx-auto bg-[#C4161C] rounded-full" />
              </div>

              {/* Mensagem */}
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 uppercase tracking-tight">
                Página Não Encontrada
              </h2>
              
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-semibold leading-relaxed">
                Ops! A notícia que você procura não está disponível ou foi movida para outro lugar. 
                Mas não se preocupe, temos muito conteúdo interessante esperando por você!
              </p>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link
                  href="/"
                  className="group inline-flex items-center gap-3 px-10 py-5 bg-linear-to-r from-[#C4161C] to-[#e01b22] hover:from-[#a01318] hover:to-[#C4161C] text-white font-black uppercase tracking-wide text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/50 hover:scale-105 rounded-xl w-full sm:w-auto justify-center"
                >
                  <Home className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>Ir para Home</span>
                </Link>

                <Link
                  href="/"
                  className="group inline-flex items-center gap-3 px-10 py-5 bg-linear-to-r from-[#283583] to-[#3d4ba8] hover:from-[#1e2660] hover:to-[#283583] text-white font-black uppercase tracking-wide text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 rounded-xl w-full sm:w-auto justify-center"
                >
                  <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>Buscar Notícias</span>
                </Link>
              </div>

              {/* Links Rápidos */}
              <div className="pt-8 border-t-2 border-gray-100">
                <p className="text-sm text-gray-500 font-bold mb-4 uppercase tracking-wide">
                  Links Rápidos
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6">
                  <Link
                    href="/"
                    className="text-[#C4161C] hover:text-[#a01318] font-black uppercase text-sm tracking-wide transition-colors relative group"
                  >
                    <span>Últimas Notícias</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C4161C] group-hover:w-full transition-all duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Minimalista */}
      <footer className="bg-linear-to-br from-[#283583] via-[#1e2660] to-[#283583] text-white py-8 relative overflow-hidden mt-auto">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#C4161C]/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#5FAD56]/10 rounded-full blur-2xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Image
            src="/images/logo.png"
            alt="NE1 Notícias"
            width={120}
            height={40}
            className="h-10 w-auto mx-auto mb-4 brightness-0 invert"
          />
          <p className="text-sm text-white/60 font-bold">
            &copy; {new Date().getFullYear()} NE1 Notícias. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}