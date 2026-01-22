"use client";
import React, { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
      toast.error("Please login first");
    }
  }, [isPending, session, router]);

  return (
    <>
      <div className="flex flex-row justify-end gap-7 p-5 px-12 bg-gray-700 text-xl">
        <a href="/home">Home</a>
        <a href="/blogs">My Blogs</a>
        <a href="/profile">Profile</a>
      </div>
      <main className="my-10">{children}</main>
    </>
  );
}
