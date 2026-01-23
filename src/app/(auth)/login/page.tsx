"use client";
import { authClient, signIn } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

export default function Login() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const formData = new FormData(evt.target as HTMLFormElement);

    const email = String(formData.get("email"));
    if (!email) {
      return toast.error("Email is required!");
    }
    const password = String(formData.get("password"));
    if (!password) {
      return toast.error("Password is required!");
    }
    await authClient.signIn.email(
      { email, password },
      {
        onRequest: () => {},
        onResponse: () => {},
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("Login Success");
          router.push("/home");
        },
      },
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-md shadow-sm"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Log In
        </h2>

        <div className="flex flex-col mb-4">
          <label htmlFor="email" className="text-gray-700 text-sm mb-1">
            Email
          </label>
          <input
            className="border text-black border-gray-300 rounded-lg p-2 px-3 focus:outline-none focus:ring-2 focus:ring-black"
            type="email"
            name="email"
            id="email"
          />
        </div>

        <div className="flex flex-col mb-6">
          <label htmlFor="password" className="text-gray-700 text-sm mb-1">
            Password
          </label>
          <input
            className="border text-black border-gray-300 rounded-lg p-2 px-3 focus:outline-none focus:ring-2 focus:ring-black"
            type="password"
            name="password"
            id="password"
          />
          <span className="p-1 text-sm text-center text-black">
            Don’t have an account?
            <Link href={"/register"} className="px-2 text-blue-400">
              Create here
            </Link>
          </span>
        </div>
        <div className="flex flex-col gap-6">
          <button
            className="cursor-pointer w-full text-lg bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition"
            type="submit"
          >
            Log In
          </button>
          <button
            className="w-full p-1 rounded-lg gap-2 border flex justify-center text-black"
            disabled={loading}
            onClick={async () => {
              await signIn.social({
                provider: "google",
                callbackURL: "/home",
                fetchOptions: {
                  onRequest: () => {
                    setLoading(true);
                  },
                  onResponse: () => {
                    setLoading(false);
                  },
                },
              });
            }}
          >
            <Icon icon="devicon:google" width="24" height="24" />
            Sign in with Google
          </button>

          <button
            className="w-full p-1 rounded-lg gap-2 border flex justify-center text-black"
            disabled={loading}
            onClick={async () => {
              await signIn.social({
                provider: "github",
                callbackURL: "/home",
                fetchOptions: {
                  onRequest: () => {
                    setLoading(true);
                  },
                  onResponse: () => {
                    setLoading(false);
                  },
                  onSuccess: () => {
                    toast.loading("Logging in...");
                  },
                },
              });
            }}
          >
            <Icon icon="devicon:github" width="24" height="24" />
            Sign in with Github
          </button>
        </div>
      </form>
    </div>
  );
}
