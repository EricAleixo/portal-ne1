import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { cookies } from "next/headers";

export async function getSessionOrThrow() {
  const cookieStore = await cookies();
  
  const hasSessionCookie = 
    cookieStore.get("next-auth.session-token") || 
    cookieStore.get("__Secure-next-auth.session-token");
  
  if (!hasSessionCookie) {
    return null;
  }
  
  try {
    const session = await getServerSession(authOptions);
    return session;
  } catch (error) {
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