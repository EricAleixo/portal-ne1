import bcrypt from "bcrypt";
import slugify from "slugify";
import { db } from ".";
import { users, categories, posts } from "./schema";
import { eq } from "drizzle-orm";

const seed = async () => {
  /* =========================
   * 1️⃣ ADMIN
   * ========================= */
  let [admin] = await db
    .select()
    .from(users)
    .where(eq(users.name, "Admin Aleixo"))
    .limit(1);

  const passwordHash = await bcrypt.hash("admin123", 10);

  if (!admin) {
    const [createdAdmin] = await db
      .insert(users)
      .values({
        name: "Admin Aleixo",
        passwordHash,
        role: "ADMIN",
      })
      .returning();

    admin = createdAdmin;
    console.log("Admin criado 👑");
  } else {
    await db
      .update(users)
      .set({
        name: "Admin Aleixo",
        passwordHash,
        role: "ADMIN",
      })
      .where(eq(users.id, admin.id));

    console.log("Admin já existia — atualizado 🔐");
  }

  /* =========================
   * 2️⃣ CATEGORIA (COM SLUG)
   * ========================= */
  const categoryName = "Tecnologia";
  const categorySlug = slugify(categoryName, {
    lower: true,
    strict: true,
  });

  let [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, categorySlug))
    .limit(1);

  if (!category) {
    const [createdCategory] = await db
      .insert(categories)
      .values({
        name: categoryName,
        slug: categorySlug,
        color: "#6366F1",
      })
      .returning();

    category = createdCategory;
    console.log("Categoria criada 🏷️");
  } else {
    // garante que categorias antigas recebam slug
    await db
      .update(categories)
      .set({
        slug: categorySlug,
      })
      .where(eq(categories.id, category.id));

    console.log("Categoria já existia — slug garantido 🏷️");
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
          <p>...</p>
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
