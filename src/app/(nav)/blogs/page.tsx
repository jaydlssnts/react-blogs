"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBlogsByUser } from "@/lib/blogs";
import { toast } from "sonner";
import Link from "next/link";
import DataTable from "react-data-table-component";

export default function ProfilePage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMyBlogs() {
      try {
        const data = await getBlogsByUser();
        setBlogs(data || []);
      } catch (err) {
        toast.error("Failed to load blogs");
      } finally {
        setIsLoading(false);
      }
    }
    fetchMyBlogs();
  }, []);

  const columns = [
    {
      name: "Title",
      selector: (row: any) => row.title,
      sortable: true,
      grow: 2,
    },
    {
      name: "Created At",
      selector: (row: any) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <div className="flex w-full justify-end items-center gap-3">
          <Link
            href={`/blogs/view/${row.slug}`}
            className="text-blue-600 hover:underline font-medium"
          >
            View
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto mt-12 p-4 max-w-5xl">
      <div className="flex flex-row justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">My Blogs</h2>
        <button
          onClick={() => router.push("/blogs/create")}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 transition-colors shadow-md"
        >
          <Icon icon="tabler:plus" width="28" height="28" />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-100">
        <DataTable
          columns={columns}
          data={blogs}
          progressPending={isLoading}
          pagination
          highlightOnHover
          pointerOnHover={false}
          noDataComponent={
            <div className="p-8 text-gray-500">
              No blogs found. Start writing!
            </div>
          }
          // Customizing the header style to match your previous design
          customStyles={{
            headRow: {
              style: {
                backgroundColor: "#f9fafb",
                borderBottomColor: "#e5e7eb",
              },
            },
            headCells: {
              style: {
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#374151",
              },
            },
            rows: {
              style: {
                fontSize: "0.875rem",
                color: "#4b5563",
              },
            },
          }}
        />
      </div>
    </div>
  );
}
