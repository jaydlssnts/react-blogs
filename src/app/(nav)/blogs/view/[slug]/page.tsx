import { getBlogBySlug } from "@/lib/blogs";
import { notFound } from "next/navigation";
import DeleteButton from "../../delete/deleteButton";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default async function BlogViewPage({
  params,
}: {
  params: { slug: string };
}) {
  // Extract slug from URL
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  // If blog doesn't exist, show 404
  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto mt-12 px-4 pb-20">
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <Link
          href="/blogs"
          className="flex items-center gap-1 text-gray-500 hover:text-black transition-colors"
        >
          <Icon icon="tabler:arrow-left" width="20" />
          <span>Back to Feed</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={`/blogs/edit/${post.slug}`}
            className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-white hover:text-blue-500 transition-colors"
          >
            <Icon icon="tabler:edit" width="18" />
            <span className="font-medium text-sm">Edit</span>
          </Link>
          <DeleteButton blogId="{post.id}" />
        </div>
      </div>
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <p className="text-gray-500">
          Published on {new Date(post.createdAt).toLocaleDateString()}
        </p>
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
    </article>
  );
}
