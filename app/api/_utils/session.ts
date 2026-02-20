import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { cookies } from "next/headers";

export async function getSessionOrThrow() {
  const cookieStore = await cookies();
  
  // Verifica se tem cookies de sessão antes
  const hasSessionCookie = 
    cookieStore.get("next-auth.session-token") || 
    cookieStore.get("__Secure-next-auth.session-token");
  
  if (!hasSessionCookie) {
    return null; // Sem cookie = sem sessão
  }
  
  try {
    const session = await getServerSession(authOptions);
    return session;
  } catch (error) {
    // Se der erro, limpa todos os cookies relacionados
    console.log("Limpando cookies inválidos...");
    
    const cookiesToDelete = [
      "next-auth.session-token",
      "__Secure-next-auth.session-token",
      "next-auth.csrf-token",
      "__Secure-next-auth.csrf-token",
      "next-auth.callback-url",
      "__Secure-next-auth.callback-url",
    ];
    
    cookiesToDelete.forEach(cookieName => {
      try {
        cookieStore.delete(cookieName);
      } catch {}
    });
    
    return null;
  }
}