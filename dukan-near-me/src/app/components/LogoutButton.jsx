"use client";
// import { signOut, useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import { useState } from "react";
// import LogoLoader from "./LogoLoader";

// export default function LogoutButton() {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const [isLoggingOut, setIsLoggingOut] = useState(false);

//   const handleLogout = async () => {
//     if (!session?.user) {
//       toast.error("You are not logged in.");
//       return;
//     }

//     setIsLoggingOut(true);

//     try {
//       const response = await fetch("/api/logout-device", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ sessionToken: session.sessionToken }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to log out from the server.");
//       }

//       toast.success("Logged out successfully!");
//       await signOut({ redirect: false });
//       router.push("/login");
//     } catch (error) {
//       console.error("Logout failed:", error);
//       toast.error("Logout failed. Please try again.");
//       setIsLoggingOut(false);
//     }
//   };

//   return (
//     <button
//       onClick={handleLogout}
//       disabled={isLoggingOut}
//       className={`text-sm md:text-[16px] text-red-500 cursor-pointer flex items-center gap-2 ${
//         isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
//       }`}
//     >
//       {isLoggingOut ? (
//         <>
//           <svg
//             className="animate-spin h-4 w-4 text-red-500"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle
//               className="opacity-25"
//               cx="12"
//               cy="12"
//               r="10"
//               stroke="currentColor"
//               strokeWidth="4"
//             ></circle>
//             <path
//               className="opacity-75"
//               fill="currentColor"
//               d="M4 12a8 8 0 018-8v8H4z"
//             ></path>
//           </svg>
//           Logging out...
//         </>
//         // <LogoLoader content={"Logging out..."} />
//       ) : (
//         "Logout"
//       )}
//     </button>
//   );
// }


import React, { useState } from 'react';
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LogoLoader from "./LogoLoader";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { LogOut } from 'lucide-react';

export default function LogoutButton({ onClose}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (!session?.user) {
      toast.error("You are not logged in.");
      return;
    }

    onClose(); 
    setShowModal(false); 
    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/logout-device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  // if (isLoggingOut) {
  //   return <LogoLoader content={"Logging out..."} />;
  // }
  
  const modalContent = (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-[300px] md:w-full md:max-w-sm shadow-lg"
          >
            <h3 className="text-md md:text-lg font-semibold mb-2 md:mb-4">Confirm Logout</h3>
            <p className="mb-4 md:mb-6 text-gray-700 text-sm md:text-[16px]">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)  
                }
                className="px-4 py-2 rounded bg-gray-50 text-sm md:text-[16px] border-gray-300 border transition-all ease-in-out duration-400 cursor-pointer hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-500 text-sm md:text-[16px] text-white transition-all ease-in-out duration-400 cursor-pointer hover:bg-red-600"
              >
                Yes, Logout
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-sm md:text-[16px] text-red-500 cursor-pointer flex items-center gap-2"
      >
        <LogOut size={20} strokeWidth={1.5} /> Logout
      </button>

          {typeof window !== "undefined" &&
          createPortal(modalContent, document.body)}

          {isLoggingOut &&
            typeof window !== "undefined" &&
              createPortal(<LogoLoader content={"Logging out..."} />, document.body)}
      
    </>
  );
}
