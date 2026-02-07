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

          return {
            id: user.id,
            name: user.name,
            role: user.role,
          };
        } catch(e) {
          console.log("entou aqui", e)
          return null;
        }
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id);
        token.role = (user as any).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as number;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
