import bcrypt from "bcrypt";
import { db } from ".";
import { users } from "./schema";


const ADMIN_NAME = "Portal ne1";
const ADMIN_PASSWORD = "12345678";

const seed = async () => {
  console.log("🌱 Iniciando seed (ADMIN only)...");

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const [admin] = await db
    .insert(users)
    .values({
      name: ADMIN_NAME,
      passwordHash,
      role: "ADMIN",
      actived: true,
    })
    .returning();

  console.log(`👑 ADMIN criado com sucesso: ${admin.name}`);
  console.log("✅ Seed finalizado");

  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Erro no seed:", err);
  process.exit(1);
});
