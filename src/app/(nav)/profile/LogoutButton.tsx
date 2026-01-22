"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function LogoutButton() {
  const router = useRouter();
  async function logOut() {
    router.push("/login");
    await authClient.signOut();
    toast.success("Logout Success");
  }
  return (
    <div className="justify-self-center">
      <button
        className="cursor-pointer bg-red-400 w-full p-3 rounded-xl text-sm text-center"
        onClick={logOut}
      >
        Logout
      </button>
    </div>
  );
}
