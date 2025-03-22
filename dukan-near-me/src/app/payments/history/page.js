"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const receiverId = searchParams.get("receiverId");

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

  if (status === "loading") return <p className="text-center text-gray-500">Loading...</p>;
  if (!session) return <p className="text-center text-red-500">You must be logged in to view payment history.</p>;

  return (
    <div className="max-w-4xl mx-auto text-black mt-10 p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment History</h2>

      {payments.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-t">
                <td className="border border-gray-300 px-4 py-2">${payment.amount.toFixed(2)}</td>
                <td className={`border border-gray-300 px-4 py-2 font-semibold ${payment.status === "SUCCESS" ? "text-green-600" : "text-red-600"}`}>
                  {payment.status}
                </td>
                <td className="border border-gray-300 px-4 py-2">{new Date(payment.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No payment history available.</p>
      )}

      {/* "Create Payment" button (visible only for Institutions) */}
      {session.user.role === "INSTITUTION" && (
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
