"use client";

import { useState } from "react";
import Image from "next/image";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { ErrorContext } from "better-auth/react";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm text-gray-900">
        <div className="grid gap-6">
          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="first-name">First name</label>
              <input
                id="first-name"
                className="w-full rounded-lg border border-gray-300 p-2 px-3
                           focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="last-name">Last name</label>
              <input
                id="last-name"
                className="w-full rounded-lg border border-gray-300 p-2 px-3
                           focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          {/* Email */}
          <div className="grid gap-2">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full rounded-lg border border-gray-300 p-2 px-3
                         focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* Password */}
          <div className="grid gap-2">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-300 p-2 px-3
                         focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* Confirm Password */}
          <div className="grid gap-2">
            <label htmlFor="password_confirmation">Confirm Password</label>
            <input
              id="password_confirmation"
              type="password"
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-300 p-2 px-3
                         focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Confirm Password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>
          <button
            className="w-full min-h-11 rounded-lg bg-black py-2 text-lg
                       text-white transition hover:bg-gray-900 disabled:opacity-50"
            disabled={loading}
            onClick={async () => {
              if (password !== passwordConfirmation) {
                toast.error("Passwords do not match");
                return;
              }

              await signUp.email({
                email,
                password,
                name: `${firstName} ${lastName}`,
                image: image ? await convertImageToBase64(image) : "",
                callbackURL: "/home",
                fetchOptions: {
                  onRequest: () => setLoading(true),
                  onResponse: () => setLoading(false),
                  onError: (ctx) => {
                    toast.error(ctx.error.message);
                  },
                  onSuccess: () => router.push("/home"),
                },
              });
            }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
          <span className="p-1 text-sm text-center">
            Already have an account?
            <Link href={"/login"} className="px-2 text-blue-400">
              Login here
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
