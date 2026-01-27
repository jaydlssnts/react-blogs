"use client";
import { createClient } from "@supabase/supabase-js";
import React, { useState } from "react";
import { createComment } from "@/lib/blogs";
import { toast } from "sonner";

type CommentType = {
  id: number;
  content: string;
  imageUrl: string | null;
  createdAt: Date;
  authorName: string | null;
  authorImage: string | null;
};

export default function Comments({
  blogId,
  initialComments,
}: {
  blogId: number;
  initialComments: CommentType[];
}) {
  const [loading, setLoading] = useState(false);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const imageFile = formData.get("image") as File;
    let uploadedImageUrl = "";

    try {
      if (imageFile && imageFile.size > 0) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const { data, error } = await supabase.storage
          .from("blog-images")
          .upload(fileName, imageFile);

        if (error) throw error;
        const { data: urlData } = supabase.storage
          .from("blog-images")
          .getPublicUrl(data.path);
        uploadedImageUrl = urlData.publicUrl;
      }

      formData.append("imageUrl", uploadedImageUrl);
      const result = await createComment(formData, blogId);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Comment Added");
        (event.target as HTMLFormElement).reset();
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 flex flex-col gap-2">
      <div className="mt-8 space-y-6">
        <h3 className="text-2xl font-bold text-gray-800">
          Comments ({initialComments.length})
        </h3>

        {initialComments.length === 0 ? (
          <p className="text-gray-500 italic">No comments yet. Be the first!</p>
        ) : (
          initialComments.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                {c.authorImage && (
                  <img
                    src={c.authorImage}
                    className="w-8 h-8 rounded-full"
                    alt="avatar"
                  />
                )}
                <span className="font-bold text-gray-900">
                  {c.authorName || "Anonymous"}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-gray-700 whitespace-pre-wrap">{c.content}</p>

              {c.imageUrl && (
                <img
                  src={c.imageUrl}
                  alt="Comment attachment"
                  className="mt-3 rounded-lg max-h-60 object-cover border"
                />
              )}
            </div>
          ))
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 text-black bg-amber-100 rounded-2xl p-5"
      >
        <p className="text-xl font-bold">Add a Comment</p>
        <textarea
          name="content"
          required
          placeholder="What's on your mind?"
          className="border-2 border-gray-600 rounded-xl p-3 bg-white"
        />
        <input type="file" name="image" accept="image/*" className="text-sm" />
        <button
          disabled={loading}
          className="text-center w-full md:w-1/5 p-2 bg-blue-500 text-white rounded-xl self-end disabled:bg-gray-400"
        >
          {loading ? "Posting..." : "Add Comment"}
        </button>
      </form>
    </div>
  );
}
