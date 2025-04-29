"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LogoutButton() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    if (!session?.user) {
      toast.error("You are not logged in.");
      return;
    }

    try {
      const response = await fetch("/api/logout-device", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionToken: session.sessionToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to log out from the server.");
      }

      toast.success("Logged out successfully!");
      await signOut({ redirect: false });
      router.push("/login"); // Redirect after logout
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <button onClick={handleLogout} className="text-sm md:text-[16px] text-red-500 cursor-pointer">
      Logout
    </button>
  );
}
