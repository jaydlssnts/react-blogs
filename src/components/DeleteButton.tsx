"use client";

import { Icon } from "@iconify/react";
import { deleteBlog } from "@/lib/blogs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteButton({ blogId }: { blogId: string }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const startDeleteProcess = () => {
    // Trigger the confirmation toast
    toast("Delete this post?", {
      description: "This action is permanent and cannot be undone.",
      action: {
        label: "Confirm",
        onClick: () => executeDelete(),
      },
      cancel: {
        label: "Cancel",
        onClick: () => console.log("Deletion cancelled"),
      },
    });
  };

  async function executeDelete() {
    setIsPending(true);

    // Using toast.promise gives you automatic loading, success, and error states
    toast.promise(deleteBlog(blogId), {
      loading: "Deleting post...",
      success: () => {
        router.push("/blogs");
        router.refresh();
        return "Post deleted successfully";
      },
      error: "Failed to delete post.",
      finally: () => setIsPending(false),
    });
  }

  return (
    <button
      onClick={startDeleteProcess}
      disabled={isPending}
      className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white border border-red-500 hover:bg-white hover:text-red-500 rounded-lg transition-colors disabled:opacity-50"
    >
      <Icon
        icon={isPending ? "line-md:loading-twotone-loop" : "tabler:trash"}
        width="18"
      />
      <span className="font-medium text-sm">
        {isPending ? "Deleting..." : "Delete"}
      </span>
    </button>
  );
}
