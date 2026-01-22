import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import LogoutButton from "./LogoutButton";
import { getUserById } from "@/lib/user";

export default async function ProfilePage() {
  const user = await getUserById(); // resolve once
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="mx-auto mt-12 p-2">
      <h2 className="text-2xl font-semibold mb-6">Profile</h2>

      <table className="w-full text-left rounded-xl shadow-lg bg-gray-900 border-collapse">
        <tbody>
          <tr className="border-b">
            <td className="p-4 font-medium ">Name:</td>
            <td className="p-4">{user.name}</td>
          </tr>
          <tr className="border-b">
            <td className="p-4 font-medium ">Email:</td>
            <td className="p-4 ">{user.email}</td>
          </tr>
          <tr className="border-b">
            <td className="p-4 font-medium ">Date Created:</td>
            <td className="p-4 ">
              {user.createdAt.toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  );
}
