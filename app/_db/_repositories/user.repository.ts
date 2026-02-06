import { eq } from "drizzle-orm"
import { db } from ".."
import { users } from "../schema"


export const userRepository = {

    findByName: async (name: string) => {
        return await db.query.users.findFirst({
            where: eq(users.name, name)
        })
    }
    
}