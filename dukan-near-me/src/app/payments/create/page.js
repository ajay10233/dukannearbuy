"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CreatePayment() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const receiverId = searchParams.get("receiverId");

  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("PENDING");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: session.user.id,
          receiverId,
          amount: parseFloat(amount),
          status,
        }),
      });

      if (response.ok) {
        alert("✅ Payment created successfully!");
        router.push("/chat");
      } else {
        throw new Error("❌ Failed to create payment");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Payment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="PENDING">Pending</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
        >
          Create Payment
        </button>
      </form>
    </div>
  );
}
