"use server";

import { db } from "@/db/db";
import { blog } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc, and, gt, gte, lt, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function generateSlug(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createBlog(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title")?.toString();
  const content = formData.get("content")?.toString();
  const imageUrl = formData.get("image")?.toString() ?? null;

  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  const slug = generateSlug(title);

  await db.insert(blog).values({
    authorId: session.user.id,
    title,
    content,
    slug,
    imageUrl: imageUrl,
  });
}

export async function getBlogsByUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userBlogs = await db
    .select()
    .from(blog)
    .where(eq(blog.authorId, session.session.userId))
    .orderBy(desc(blog.createdAt));

  return userBlogs;
}

export async function getBlogBySlug(slug: string) {
  const [item] = await db.select().from(blog).where(eq(blog.slug, slug));

  if (!item) return null;
  return item;
}

export async function updateBlog(id: string, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const title = formData.get("title")?.toString();
  const content = formData.get("content")?.toString();
  const imageUrl = formData.get("image")?.toString(); // From Supabase

  if (!title || !content) throw new Error("Fields required");

  await db
    .update(blog)
    .set({
      title,
      content,
      imageUrl,
    })
    .where(and(eq(blog.id, id), eq(blog.authorId, session.session.userId)));
  revalidatePath("/blogs");
}

export async function deleteBlog(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await db.delete(blog).where(eq(blog.authorId, session.session.userId));

  revalidatePath("/blogs");
}

export async function getAllBlogs() {
  try {
    const allBlogs = await db.select().from(blog).orderBy(desc(blog.createdAt));

    return allBlogs || [];
  } catch (error) {
    console.error("Error fetching feed:", error);
    return [];
  }
}
