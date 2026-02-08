// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      role: string;
      active: boolean;
      photoProfile?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: number;
    name: string;
    role: string;
    active: boolean;
    photoProfile?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    role: string;
    active: boolean;
    photoProfile?: string | null;
  }
}