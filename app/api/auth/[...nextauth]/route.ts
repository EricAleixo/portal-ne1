// app/api/auth/[...nextauth]/route.ts
import { userService } from "@/app/_services/user.service";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
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
          
          if (!user.active) {
            throw new Error("Usuário desativado");
          }
          
          return {
            id: user.id,
            name: user.name,
            role: user.role,
            photoProfile: user.photoProfile,
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
        token.photoProfile = (user as any).photoProfile;
        return token;
      }
      
      if (token.id) {
        try {
          const existingUser = await userService.findById(token.id as number);
          if (!existingUser || !existingUser.active) {
            return {} as any;
          }
          token.role = existingUser.role;
          token.active = existingUser.active;
          token.photoProfile = existingUser.photoProfile;
        } catch (error: any) {
          console.error("Erro ao verificar usuário:", error.message);
          return {} as any;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as number;
        session.user.role = token.role as string;
        session.user.active = token.active as boolean;
        session.user.photoProfile = token.photoProfile as string | null;
      }
      return session;
    },
  },
  // ✅ ADICIONE ISSO AQUI - Suprime erros de JWT
  events: {
    async signOut({ token }) {
      // Limpa o token quando faz logout
    },
  },
  // ✅ ADICIONE ISSO AQUI - Logger customizado para suprimir erros de descriptografia
  logger: {
    error(code, metadata) {
      // Suprime apenas erros de JWT_SESSION_ERROR
      if (code === "JWT_SESSION_ERROR") {
        console.log("Cookie de sessão inválido detectado (será ignorado)");
        return;
      }
      // Outros erros são mostrados normalmente
      console.error(code, metadata);
    },
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      // Suprime debug em produção
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };