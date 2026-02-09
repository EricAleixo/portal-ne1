import { eq } from "drizzle-orm";
import { db } from ".";
import { users, categories, posts } from "./schema";


const seedPosts = async () => {
  console.log("🌱 Iniciando seed de 100 posts...");

  // Buscar um usuário ADMIN corretamente
  const [adminUser] = await db
    .select()
    .from(users)
    .where(eq(users.role, "ADMIN"));

  // Buscar a primeira categoria
  const [firstCategory] = await db.select().from(categories);

  if (!adminUser || !firstCategory) {
    console.error("❌ Usuário ADMIN ou categoria não encontrados.");
    process.exit(1);
  }

  const postsData = Array.from({ length: 100 }).map((_, i) => ({
    title: `Post ${i + 1}`,
    slug: `post-${i + 1}`,
    description: `Descrição do post ${i + 1}`,
    content: `Conteúdo do post ${i + 1}. Aqui você pode colocar qualquer texto.`,
    photoUrl: `https://picsum.photos/seed/${i + 1}/640/480`,
    tags: ["tag1", "tag2"],
    views: 0,
    authorId: adminUser.id,
    categoryId: firstCategory.id,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
  }));

  const insertedPosts = await db.insert(posts).values(postsData).returning();

  console.log(`📝 ${insertedPosts.length} posts criados com sucesso!`);
  console.log("✅ Seed de posts finalizado");

  process.exit(0);
};

seedPosts().catch((err) => {
  console.error("❌ Erro no seed de posts:", err);
  process.exit(1);
});
