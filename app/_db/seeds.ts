import { eq } from "drizzle-orm";
import { db } from ".";
import { users } from "./schema";
import "dotenv/config";
import bcrypt from "bcrypt";

const seedAdmin = async () => {
  console.log("🌱 Verificando usuário administrador...");

  const adminName = process.env.ADMIN_NAME;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (!adminName || !adminPass) {
    console.error("❌ Erro: ADMIN_NAME ou ADMIN_PASSWORD não definidos no .env");
    process.exit(1);
  }

  // 1. Verificar se o admin já existe pelo nome
  const [existingAdmin] = await db
    .select()
    .from(users)
    .where(eq(users.name, adminName));

  if (existingAdmin) {
    console.log(`ℹ️ Usuário "${adminName}" já existe. Pulando criação.`);
  } else {
    // 2. Gerar o hash da senha
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPass, salt);

    // 3. Inserir no banco
    await db.insert(users).values({
      name: adminName,
      passwordHash: passwordHash,
      role: "ADMIN", // Garante que o primeiro usuário terá acesso total
      actived: true,
    });

    console.log(`✅ Admin "${adminName}" criado com sucesso!`);
  }

  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error("❌ Erro no seed de admin:", err);
  process.exit(1);
});