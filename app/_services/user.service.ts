import { userRepository } from "../_db/_repositories/user.repository";
import bcrypt from "bcrypt";

type UserRole = "ADMIN" | "JOURNALIST";

export class UserService {
    // CREATE
    async create(name: string, password: string) {
        // Verifica se usuário já existe
        const existingUser = await userRepository.findByName(name);
        if (existingUser) {
            throw new Error("USER ALREADY EXISTS");
        }

        // Hash da senha
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Cria o usuário
        const user = await userRepository.create({
            name,
            passwordHash,
        });

        return {
            id: user.id,
            name: user.name,
            role: user.role
        };
    }

    // READ
    async findByName(name: string) {
        return userRepository.findByName(name);
    }

    async findById(id: number) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new Error("USER NOT FOUND");
        }
        return {
            id: user.id,
            name: user.name,
            active: user.actived,
            role: user.role
        };
    }

    async findAll() {
        const users = await userRepository.findAll();
        return users.map(user => ({
            id: user.id,
            name: user.name,
            role: user.role
        }));
    }

    // UPDATE
    async update(id: number, data: { name?: string; password?: string; role?: UserRole }) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new Error("USER NOT FOUND");
        }

        const updateData: Partial<{ name: string; passwordHash: string; role: UserRole }> = {};

        if (data.name) {
            // Verifica se o novo nome já está em uso por outro usuário
            const existingUser = await userRepository.findByName(data.name);
            if (existingUser && existingUser.id !== id) {
                throw new Error("NAME ALREADY IN USE");
            }
            updateData.name = data.name;
        }

        if (data.password) {
            const saltRounds = 10;
            updateData.passwordHash = await bcrypt.hash(data.password, saltRounds);
        }

        if (data.role) {
            updateData.role = data.role;
        }

        const updatedUser = await userRepository.update(id, updateData);

        return {
            id: updatedUser.id,
            name: updatedUser.name,
            role: updatedUser.role
        };
    }

    // DELETE
    async delete(id: number) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new Error("USER NOT FOUND");
        }

        await userRepository.delete(id);
        return { message: "USER DELETED SUCCESSFULLY" };
    }

    // LOGIN (método já existente, mantido)
    async login(name: string, password: string) {
        const user = await userRepository.findByName(name);
        if (!user) {
            throw new Error("INVALID CREDENTIALS");
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error("INVALID CREDENTIALS");
        }

        return {
            id: user.id,
            name: user.name,
            active: user.actived,
            role: user.role
        };
    }
}

export const userService = new UserService();