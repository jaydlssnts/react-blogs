"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1 text-gray-500 hover:text-black transition-colors"
    >
      <Icon icon="tabler:arrow-left" width="20" />
      <span>Back to Feed</span>
    </button>
  );
}
