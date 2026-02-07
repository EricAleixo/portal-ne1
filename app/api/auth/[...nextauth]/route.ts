// app/api/auth/[...nextauth]/route.ts
import { userService } from "@/app/_services/user.service";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas em segundos
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "name", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.name || !credentials?.password) {
          return null;
        }

        try {
          const user = await userService.login(
            credentials.name,
            credentials.password
          );

          // Verifica se o usuário está ativo
          if (!user.active) {
            throw new Error("Usuário desativado");
          }

          return {
            id: user.id,
            name: user.name,
            role: user.role,
            active: user.active,
          };
        } catch(e) {
          console.error("Erro no login:", e);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id);
        token.role = (user as any).role;
        token.active = (user as any).active;
      }

      // Verifica se o usuário ainda existe e está ativo a cada requisição
      if (token.id) {
        try {
          const existingUser = await userService.findById(token.id as number);
          
          // Se o usuário não existir mais ou estiver desativado, invalida o token
          if (!existingUser || !existingUser.active) {
            return {} as any; // Token vazio força logout
          }

          // Atualiza informações do token caso tenham mudado
          token.role = existingUser.role;
          token.active = existingUser.active;
        } catch (error) {
          console.error("Erro ao verificar usuário:", error);
          return {} as any; // Token vazio força logout
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as number;
        session.user.role = token.role as string;
        session.user.active = token.active as boolean;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };