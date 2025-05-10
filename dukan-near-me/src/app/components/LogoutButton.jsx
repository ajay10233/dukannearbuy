"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (!session?.user) {
      toast.error("You are not logged in.");
      return;
    }

    setIsLoggingOut(true);

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
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`text-sm md:text-[16px] text-red-500 cursor-pointer flex items-center gap-2 ${
        isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {isLoggingOut ? (
        <>
          <svg
            className="animate-spin h-4 w-4 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          Logging out...
        </>
      ) : (
        "Logout"
      )}
    </button>
  );
}
