import { eq } from "drizzle-orm"
import { db } from ".."
import { users } from "../schema"

type UserRole = "ADMIN" | "JOURNALIST";

export const userRepository = {
    // CREATE
    create: async (data: { name: string; passwordHash: string }) => {
        const [user] = await db.insert(users).values(data).returning();
        return user;
    },

    // READ
    findByName: async (name: string) => {
        return await db.query.users.findFirst({
            where: eq(users.name, name)
        })
    },

    findById: async (id: number) => {
        return await db.query.users.findFirst({
            where: eq(users.id, id)
        })
    },

    findAll: async () => {
        return await db.query.users.findMany({
            where: eq(users.role, "JOURNALIST")
        });
    },

    // UPDATE
    update: async (id: number, data: Partial<{ name: string; passwordHash: string; role: UserRole, photoProfile: string }>) => {
        const [user] = await db.update(users)
            .set(data)
            .where(eq(users.id, id))
            .returning();
        return user;
    },

    // DELETE
    delete: async (id: number) => {
        const [user] = await db.delete(users)
            .where(eq(users.id, id))
            .returning();
        return user;
    }
}