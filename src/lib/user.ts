import { user } from "@/db/schema";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getUserById() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const users = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));

  return users[0];
}
