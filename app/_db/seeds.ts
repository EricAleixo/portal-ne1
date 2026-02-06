import bcrypt from "bcrypt";
import { db } from ".";
import { users, categories, posts } from "./schema";
import { eq } from "drizzle-orm";

const seed = async () => {
  /* =========================
   * 1️⃣ USUÁRIO
   * ========================= */
  let [author] = await db
    .select()
    .from(users)
    .where(eq(users.name, "Jornalista 1"))
    .limit(1);

  if (!author) {
    const passwordHash = await bcrypt.hash("jornalista123", 10);

    const [createdUser] = await db
      .insert(users)
      .values({
        name: "Jornalista 1",
        passwordHash,
        role: "JOURNALIST",
      })
      .returning();

    author = createdUser;
    console.log("Usuário criado 👤");
  } else {
    console.log("Usuário já existe 👤");
  }

  /* =========================
   * 2️⃣ CATEGORIA
   * ========================= */
  let [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.name, "Tecnologia"))
    .limit(1);

  if (!category) {
    const [createdCategory] = await db
      .insert(categories)
      .values({
        name: "Tecnologia",
        color: "#6366F1",
      })
      .returning();

    category = createdCategory;
    console.log("Categoria criada 🏷️");
  } else {
    console.log("Categoria já existe 🏷️");
  }

    /* =========================
   * 3️⃣ POST (UPDATE)
   * ========================= */
  const [existingPost] = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, "primeira-noticia-do-portal"))
    .limit(1);

  if (existingPost) {
    await db
      .update(posts)
      .set({
        title: "Primeira notícia do portal",
        description:
          "Portal estreia com sua primeira matéria focada em tecnologia e inovação.",
        content: `
          <h2>O início de um novo portal de notícias</h2>

          <p>
            O lançamento de um portal de notícias representa um passo importante
            para a disseminação de informação confiável e bem estruturada. Esta
            matéria inaugura oficialmente a plataforma e demonstra o potencial
            do sistema desenvolvido.
          </p>

          <p>
            O objetivo principal deste projeto é unir tecnologia moderna,
            organização editorial e uma experiência de leitura agradável para
            o usuário final.
          </p>

          <h2>Tecnologia e arquitetura</h2>

          <p>
            A aplicação foi construída utilizando ferramentas atuais do
            ecossistema JavaScript. O Drizzle ORM é responsável pela camada de
            persistência de dados, oferecendo tipagem forte e segurança nas
            operações com o banco.
          </p>

          <p>
            No frontend, o Next.js com App Router permite a criação de rotas
            dinâmicas, geração automática de metadata para SEO e renderização
            otimizada do conteúdo.
          </p>

          <h2>Importância do seed no desenvolvimento</h2>

          <p>
            Seeds são amplamente utilizadas em ambientes profissionais para
            popular o banco de dados com informações iniciais. Isso garante que
            o sistema esteja funcional desde o primeiro momento.
          </p>

          <p>
            Neste caso, a seed foi utilizada para atualizar a primeira matéria
            do portal, mantendo o histórico e evitando duplicidade de registros.
          </p>

          <h2>Próximos passos</h2>

          <p>
            Com a base do portal pronta, novas funcionalidades poderão ser
            adicionadas, como comentários, métricas de visualização, sistema de
            destaque e integração com redes sociais.
          </p>

          <p>
            Esta primeira publicação simboliza apenas o início de um projeto
            focado em crescimento, qualidade e inovação.
          </p>
        `,
        photoUrl: "https://picsum.photos/1200/600",
        tags: ["portal", "tecnologia", "notícias"],
        categoryId: category.id,
        published: true,
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(posts.id, existingPost.id));

    console.log("Post atualizado com sucesso 🔄");
  } else {
    console.log("Post não encontrado para atualização ⚠️");
  }


  process.exit(0);
};

seed().catch((err) => {
  console.error("Erro no seed:", err);
  process.exit(1);
});
