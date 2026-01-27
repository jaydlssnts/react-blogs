"use client";

import { createBlog } from "@/lib/blogs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
);

export default function CreateBlogPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const file = formData.get("fileToUpload") as File;

    try {
      let publicUrl = null;

      if (file && file.size > 0) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("blog-images")
          .getPublicUrl(filePath);

        publicUrl = data.publicUrl;
      }

      if (publicUrl) {
        formData.set("image", publicUrl);
      }
      toast.loading("Creating Blog");
      await createBlog(formData);
      toast.dismiss();

      router.push("/blogs");
      toast.success("Blog created successfully");
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white text-black rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6">Create Blog</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            name="title"
            type="text"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Content</label>
          <textarea
            name="content"
            rows={6}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Feature Image</label>
          <input
            type="file"
            name="fileToUpload"
            accept="image/*"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-4 bg-blue-600 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Create Blog"}
        </button>
        <Link
          href={"/blogs"}
          className="mt-4 bg-red-600 py-2 rounded hover:bg-red-700 disabled:opacity-50 text-center "
        >
          Cancel
        </Link>
      </form>
    </div>
  );
}
