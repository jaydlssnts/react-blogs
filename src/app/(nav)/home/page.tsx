import { getAllBlogs } from "@/lib/blogs";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default async function Home() {
  const blogs = await getAllBlogs();

  return (
    <main className="max-w-6xl mx-auto mt-12 px-4 pb-20">
      <div className="mb-12 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-4 italic">The Feed</h1>
        <p>Explore the latest stories from our community</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((post: any) => (
          <Link
            key={post.id}
            href={`/blogs/view/${post.slug}`}
            className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden"
          >
            {/* Image Section */}
            <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
              {post.imageUrl ? (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-300">
                  <Icon icon="tabler:photo" width="48" />
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col grow">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                <Icon icon="tabler:calendar" width="14" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                {post.title}
              </h3>

              <p className="text-gray-600 text-sm line-clamp-3 mb-6 grow">
                {post.content}
              </p>

              <div className="flex items-center text-blue-600 font-semibold text-sm">
                Read Blog
                <Icon
                  icon="tabler:chevron-right"
                  width="16"
                  className="ml-1 group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="text-center py-20 text-white">
          <Icon icon="tabler:news-off" width="64" className="mx-auto mb-4" />
          <p className="text-gray-500">
            No stories found yet. Be the first to write one!
          </p>
        </div>
      )}
    </main>
  );
}
