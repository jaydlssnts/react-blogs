"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBlogsByUser } from "@/lib/blogs";
import { toast } from "sonner";
import Link from "next/link";
import DeleteButton from "@/app/(nav)/blogs/delete/deleteButton";

export default function ProfilePage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMyBlogs() {
      try {
        const data = await getBlogsByUser();
        // data here is the raw array that your function currently returns
        setBlogs(data || []);
      } catch (err) {
        toast.error("Failed to load blogs");
      } finally {
        setIsLoading(false);
      }
    }
    fetchMyBlogs();
  }, []);

  return (
    <div className="mx-auto mt-12 p-4 max-w-5xl">
      <div className="flex flex-row justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">My Blogs</h2>
        <button
          onClick={() => router.push("/blogs/create")}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 transition-colors"
        >
          <Icon icon="tabler:plus" width="28" height="28" />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-700">Title</th>
              <th className="p-4 font-semibold text-gray-700">Created At</th>
              <th className="p-4 font-semibold text-gray-700 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  Loading your blogs...
                </td>
              </tr>
            ) : blogs.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  No blogs found. Start writing!
                </td>
              </tr>
            ) : (
              blogs.map((blog: any) => (
                <tr
                  key={blog.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 font-medium text-gray-600">
                    {blog.title}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end items-center gap-3">
                      <Link
                        href={`/blogs/view/${blog.slug}`}
                        className="underline text-blue-600"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
