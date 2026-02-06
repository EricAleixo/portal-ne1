import { userRepository } from "../_db/_repositories/user.repository";
import bcrypt from "bcrypt";

export class UserService{
    findByName(name: string){
        return userRepository.findByName(name);
    }

    async login(name: string, password: string){
        const user = await userRepository.findByName(name);

        if(!user){
            throw new Error("INVALID CREDENTIALS")
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if(!isPasswordValid){
            throw new Error("INVALID CREDENTIALS")
        }

        return {
            id: user.id,
            name: user.name,
            role: user.role
        }
    }
}

export const userService = new UserService();