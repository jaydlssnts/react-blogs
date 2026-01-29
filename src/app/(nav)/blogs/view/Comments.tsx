"use client";

import { createClient } from "@supabase/supabase-js";
import React, { useState, useEffect } from "react";
import { createComment, updateComment, deleteComment } from "@/lib/blogs";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

type CommentType = {
  id: number;
  content: string;
  imageUrl: string | null;
  createdAt: Date;
  userId: string;
  authorName: string | null;
  authorImage: string | null;
};

export default function Comments({
  blogId,
  initialComments,
  currentUserId,
}: {
  blogId: number;
  initialComments: CommentType[];
  currentUserId?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
  );

  const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("blog-images")
      .upload(fileName, file);

    if (error) throw error;
    const { data: urlData } = supabase.storage
      .from("blog-images")
      .getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const imageFile = formData.get("image") as File;
    let uploadedImageUrl = "";

    try {
      if (imageFile && imageFile.size > 0) {
        uploadedImageUrl = await uploadImage(imageFile);
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

  async function handleUpdate(c: CommentType) {
    setLoading(true);
    try {
      let finalUrl = editPreview;

      if (editFile) {
        finalUrl = await uploadImage(editFile);
      }

      const formData = new FormData();
      formData.append("content", editContent);
      formData.append("imageUrl", finalUrl || "");

      await updateComment(c.id, formData);
      toast.success("Updated Successfully");
      setEditingId(null);
      setEditFile(null);
      setEditPreview(null);
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(commentId: number) {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    setLoading(true);
    try {
      await deleteComment(commentId);
      toast.success("Comment deleted");
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 flex flex-col gap-6">
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-800">
          Comments ({initialComments.length})
        </h3>

        {initialComments.length === 0 ? (
          <p className="text-gray-500 italic">No comments yet. Be the first!</p>
        ) : (
          initialComments.map((c) => {
            const isEditing = editingId === c.id;
            const isOwner = currentUserId === c.userId;

            return (
              <div
                key={c.id}
                className="bg-white border text-black border-gray-200 p-4 rounded-xl shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    {c.authorImage && (
                      <img
                        src={c.authorImage}
                        className="w-8 h-8 rounded-full"
                        alt=""
                      />
                    )}
                    <span className="font-bold text-gray-900">
                      {c.authorName || "Anonymous"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {isOwner && !isEditing && (
                    <button
                      onClick={() => {
                        setEditingId(c.id);
                        setEditContent(c.content);
                        setEditPreview(c.imageUrl);
                      }}
                      className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-white border hover:text-blue-500 hover:border hover:border-blue-500 transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="flex flex-col gap-3">
                    <textarea
                      className="border-2 border-blue-100 p-3 rounded-xl w-full focus:ring-2 focus:ring-blue-500 outline-none"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />

                    <div className="flex flex-col gap-2">
                      <p className="text-xs font-semibold text-gray-500">
                        Image:
                      </p>

                      {editPreview && (
                        <div className="relative w-full max-h-60 rounded-lg overflow-hidden border bg-gray-50 flex items-center justify-center">
                          <img
                            src={editPreview}
                            className="max-h-60 object-contain"
                            alt="Preview"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setEditPreview(null);
                              setEditFile(null);
                            }}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700 transition-colors"
                          >
                            <Icon icon="tabler:trash" width="24" height="24" />
                          </button>
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setEditFile(file);
                            setEditPreview(URL.createObjectURL(file));
                          }
                        }}
                        className="text-xs"
                      />
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <button
                        onClick={() => handleDelete(c.id)}
                        disabled={loading}
                        className="flex items-center gap-1 px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-white hover:text-red-500 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditFile(null);
                            setEditPreview(null);
                          }}
                          className="text-red-900 border border-red-900 font-bold text-sm rounded-lg px-3 py-1 hover:bg-red-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdate(c)}
                          disabled={loading}
                          className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400"
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {c.content}
                    </p>
                    {c.imageUrl && (
                      <img
                        src={c.imageUrl}
                        className="mt-3 rounded-lg max-h-60 w-auto object-contain border"
                        alt=""
                      />
                    )}
                  </>
                )}
              </div>
            );
          })
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
          className="border-2 border-gray-600 rounded-xl p-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          className="text-sm py-2"
        />
        <button
          disabled={loading}
          className="text-center w-full md:w-1/5 p-2 bg-blue-500 text-white rounded-xl self-end hover:bg-blue-600 disabled:bg-gray-400 transition-colors cursor-pointer"
        >
          {loading ? "Posting..." : "Add Comment"}
        </button>
      </form>
    </div>
  );
}
