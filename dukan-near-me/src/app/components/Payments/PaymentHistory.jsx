"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PaymentHistoryTable from "@/app/components/Payments/PaymentHistoryTable";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const searchParams = useSearchParams(); // ✅ Call at top level
  const receiverId = searchParams.get("receiverId"); // ✅ Get value at top level
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session || !receiverId) return;

    const fetchPayments = async () => {
      try {
        const res = await fetch(`/api/payments/history?receiverId=${receiverId}`);
        const data = await res.json();
        setPayments(data.payments || []);
      } catch (error) {
        console.error("❌ Failed to fetch payment history:", error);
      }
    };

    fetchPayments();
  }, [session, receiverId]);

  const handleUpdateStatus = (paymentId, updateData) => {
    setPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === paymentId ? { ...payment, ...updateData } : payment
      )
    );
  };

  if (status === "loading") return <p className="text-center text-gray-500">Loading...</p>;
  if (!session) return <p className="text-center text-red-500">You must be logged in to view payment history.</p>;

  return (
    <div className="max-w-4xl mx-auto text-black mt-10 p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment History</h2>

      <PaymentHistoryTable payments={payments} onUpdate={handleUpdateStatus} />

      {session.user.role === "INSTITUTION" && receiverId && (
        <button
          onClick={() => router.push(`/payments/create?receiverId=${receiverId}`)}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
        >
          Create Payment
        </button>
      )}
    </div>
  );
}
