// "use client";
// import { useState } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function CreatePayment() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const receiverId = searchParams.get("receiverId");

//   const [amount, setAmount] = useState("");
//   const [status, setStatus] = useState("PENDING");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await fetch("/api/payments", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           senderId: session.user.id,
//           receiverId,
//           amount: parseFloat(amount),
//           status,
//         }),
//       });

//       if (response.ok) {
//         toast.success("✅ Payment created successfully!");
//         setTimeout(() => router.push("/chat"), 2000);
//       } else {
//         throw new Error("❌ Failed to create payment");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto text-black mt-10 bg-white p-6 rounded-md shadow-md">
//       <ToastContainer position="top-right" autoClose={2000} />
//       <h2 className="text-xl font-bold mb-4">Create Payment</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block text-gray-700">Amount (₹)</label>
//           <input
//             type="number"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700">Status</label>
//           <select
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="PENDING">Pending</option>
//             <option value="SUCCESS">Success</option>
//             <option value="CONFLICT">Conflict</option>
//           </select>
//         </div>

//         <button
//           type="submit"
//           className={`w-full text-white py-2 rounded-md transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
//           disabled={loading}
//         >
//           {loading ? "Processing..." : "Create Payment"}
//         </button>
//       </form>
//     </div>
//   );
// }


import { Suspense } from "react";
import CreatePayment from "@/app/components/CreatePayment";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center text-gray-500">Loading...</p>}>
      <CreatePayment />
    </Suspense>
  );
}
