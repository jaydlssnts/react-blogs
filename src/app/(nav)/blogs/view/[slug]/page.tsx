import { getBlogBySlug, getCommentsByBlogId } from "@/lib/blogs";
import { notFound } from "next/navigation";
import DeleteButton from "@/components/DeleteButton";
import Link from "next/link";
import { Icon } from "@iconify/react";
import BackButton from "@/components/BackButton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Comments from "@/app/(nav)/blogs/view/Comments";

export default async function View({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAuthor = session?.user?.id === post.authorId;
  const comments = await getCommentsByBlogId(post.id);

  return (
    <article className="max-w-5xl mx-auto mt-12 px-4 pb-20">
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <BackButton />
        <div className="flex items-center gap-3">
          {isAuthor && (
            <>
              <Link
                href={`/blogs/edit/${post.slug}`}
                className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-white hover:text-blue-500 transition-colors"
              >
                <Icon icon="tabler:edit" width="18" />
                <span className="font-medium text-sm">Edit</span>
              </Link>
              <DeleteButton blogId={post.id} />
            </>
          )}
        </div>
      </div>

      <div className="bg-amber-50 p-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {post.title}
          </h1>

          <div className="flex flex-col gap-1 mb-4">
            <p className="text-lg font-medium text-gray-600">
              Written by: {post.authorName || "Anonymous"}
            </p>
            <p className="text-sm text-gray-500">
              Published on {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </header>

        <p className="text-2xl font-bold text-gray-900 mb-4">{post.content}</p>

        {post.imageUrl && (
          <div className="relative w-full mb-10 rounded-xl overflow-hidden shadow-lg">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <Comments
          blogId={post.id}
          initialComments={comments}
          currentUserId={session?.user?.id}
        />
      </div>
    </article>
  );
}
