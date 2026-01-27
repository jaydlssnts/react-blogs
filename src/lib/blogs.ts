"use server";

import { db } from "@/db/db";
import { blog, comment, user } from "@/db/schema";
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
  const [result] = await db
    .select({
      post: blog,
      authorName: user.name,
    })
    .from(blog)
    .innerJoin(user, eq(blog.authorId, user.id))
    .where(eq(blog.slug, slug));

  if (!result) return null;

  return {
    ...result.post,
    authorName: result.authorName,
  };
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
    .where(eq(blog.authorId, session.session.userId));
  revalidatePath("/blogs");
}

export async function deleteBlog(id: number) {
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

export async function createComment(formData: FormData, blogId: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const content = formData.get("content")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();

  if (!content && !imageUrl) {
    return { error: "Comment cannot be empty" };
  }

  await db.insert(comment).values({
    blogId: blogId,
    userId: session.user.id,
    content: content || "",
    imageUrl: imageUrl || null,
  });

  revalidatePath(`/blogs/${blogId}`);
  return { success: true };
}

export async function getCommentsByBlogId(blogId: number) {
  return await db
    .select({
      id: comment.id,
      content: comment.content,
      imageUrl: comment.imageUrl,
      createdAt: comment.createdAt,
      authorName: user.name,
      authorImage: user.image,
    })
    .from(comment)
    .leftJoin(user, eq(comment.userId, user.id))
    .where(eq(comment.blogId, blogId))
    .orderBy(desc(comment.createdAt));
}
