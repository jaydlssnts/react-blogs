"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateBlog } from "@/lib/blogs";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

export default function EditForm({ post }: { post: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(post.imageUrl || "");
  const [formData, setFormData] = useState({
    title: post.title,
    content: post.content,
  });

  //edit picture photo
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = post.imageUrl;

      if (selectedFile) {
        const fileName = `${Date.now()}-${selectedFile.name}`;
        const { data, error } = await supabase.storage
          .from("blog-images")
          .upload(fileName, selectedFile);

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from("blog-images")
          .getPublicUrl(data.path);

        finalImageUrl = urlData.publicUrl;
      }

      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("imageUrl", finalImageUrl);

      await updateBlog(post.id, data);

      toast.success("Blog updated successfully!");
      router.push(`/blogs/view/${post.slug}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update blog");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white text-gray-700 p-8 rounded-2xl border shadow-sm"
    >
      <div>
        <label className="block text-xl font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-xl font-medium text-gray-700 mb-2">
          Blog Image
        </label>
        <div className="space-y-4">
          {previewUrl && (
            <div className="relative w-full h-48 rounded-xl overflow-hidden border">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>

      <div>
        <label className="block text-xl font-medium text-black mb-2">
          Content
        </label>
        <textarea
          required
          rows={10}
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
