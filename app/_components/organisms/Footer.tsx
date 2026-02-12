import Image from "next/image";
import Link from "next/link";

export const Footer = ({
  allCategories,
}: {
  allCategories: Array<{
    id: number;
    name: string;
    color: string;
    slug: string | null;
  }>;
}) => {
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
                    href={`/categorias/${category.slug}`}
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
              Email:{" "}
              <a
                href="mailto:portalne1jornalismo@gmail.com"
                className="hover:underline"
              >
                portalne1jornalismo@gmail.com
              </a>
              <br />
              Telefone:{" "}
              <a
                href="https://wa.me/558396231297"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                (83) 9 9623-1297
              </a>
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