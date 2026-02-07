import bcrypt from "bcrypt";
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
    // se já existir, atualiza a senha e o role
    await db
      .update(users)
      .set({
        name: "admin",
        passwordHash,
        role: "ADMIN"
      })
      .where(eq(users.id, admin.id));

    console.log("Admin já existia — senha atualizada 🔐");
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
