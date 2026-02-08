import slugify from "slugify";
import { db } from ".";
import { categories, posts, users } from "./schema";
import { eq } from "drizzle-orm";

/* =========================
 * CONFIG
 * ========================= */
const TOTAL_CATEGORIES = 30;
const TOTAL_POSTS = 30;

const seed = async () => {
  console.log("🌱 Iniciando seed...");

  /* =========================
   * 1️⃣ USUÁRIO AUTOR
   * ========================= */
  const [author] = await db
    .select()
    .from(users)
    .where(eq(users.role, "ADMIN"))
    .limit(1);

  if (!author) {
    throw new Error("Nenhum ADMIN encontrado para ser autor dos posts");
  }

  /* =========================
   * 2️⃣ CATEGORIAS
   * ========================= */
  const createdCategories = [];

  for (let i = 1; i <= TOTAL_CATEGORIES; i++) {
    const name = `Categoria ${i}`;
    const slug = slugify(name, { lower: true, strict: true });

    const [existing] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    if (existing) {
      createdCategories.push(existing);
      continue;
    }

    const [category] = await db
      .insert(categories)
      .values({
        name,
        slug,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      })
      .returning();

    createdCategories.push(category);
  }

  console.log(`🏷️ ${createdCategories.length} categorias prontas`);

  /* =========================
   * 3️⃣ POSTS (MESMA CATEGORIA)
   * ========================= */
  const mainCategory = createdCategories[0];

  for (let i = 1; i <= TOTAL_POSTS; i++) {
    const title = `Post ${i} — Tecnologia e Inovação`;
    const slug = slugify(title, { lower: true, strict: true });

    const [existingPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);

    if (existingPost) continue;

    await db.insert(posts).values({
      title,
      slug,
      description: `Descrição do post ${i}, focado em tecnologia.`,
      content: `
        <h2>Post ${i}</h2>
        <p>Este é o conteúdo do post número ${i}. Ele faz parte do seed do portal.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      `,
      photoUrl: `https://picsum.photos/seed/post-${i}/1200/600`,
      tags: ["tecnologia", "portal", "notícias"],
      views: 0,
      authorId: author.id,
      categoryId: mainCategory.id,
      published: true,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  console.log(`📰 ${TOTAL_POSTS} posts criados na categoria "${mainCategory.name}"`);

  console.log("✅ Seed finalizado com sucesso");
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Erro no seed:", err);
  process.exit(1);
});
