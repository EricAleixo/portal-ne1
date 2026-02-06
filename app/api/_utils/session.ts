import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function getSessionOrThrow() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("UNAUTHORIZED");
  }

  return session;
}
