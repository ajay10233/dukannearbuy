"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

export default function PaymentHistoryTable({ payments, onUpdate }) {
  const { data: session } = useSession();
  const isInstitution = session?.user?.role === "INSTITUTION" || session?.user?.role === "SHOP_OWNER";
  const [updating, setUpdating] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [newAmount, setNewAmount] = useState("");

  const handleUpdatePayment = async (paymentId, updateData) => {
    setUpdating(paymentId);
    try {
      if (updateData.amount !== undefined && updateData.status === undefined) {
        updateData.status = "PENDING";
      }

      const res = await fetch(`/api/payments/update-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, ...updateData }),
      });

      if (!res.ok) throw new Error("Failed to update payment");

      onUpdate(paymentId, updateData);
      setEditingPayment(null);
      setNewAmount("");
    } catch (error) {
      console.error("❌ Error updating payment:", error);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <>
      {payments.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border border-gray-300 px-4 py-3 text-left">Amount</th>
              <th className="border border-gray-300 px-4 py-3 text-left">Status</th>
              <th className="border border-gray-300 px-4 py-3 text-left">Date</th>
              <th className="border border-gray-300 px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-t bg-white hover:bg-gray-50 transition">
                <td className="border border-gray-300 px-4 py-2">
                  {editingPayment === payment.id ? (
                    <input
                      type="number"
                      className="border p-1 w-20 rounded"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                    />
                  ) : (
                    `₹${payment.amount.toFixed(2)}`
                  )}
                </td>
                <td
                  className={`border border-gray-300 px-4 py-2 font-semibold flex items-center gap-2 ${
                    payment.status === "COMPLETED"
                      ? "text-green-600"
                      : payment.status === "CONFLICT"
                      ? "text-red-600"
                      : "text-yellow-500"
                  }`}
                >
                  {payment.status === "COMPLETED" && (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  )}
                  {payment.status === "CONFLICT" && (
                    <XCircleIcon className="w-5 h-5 text-red-500" />
                  )}
                  {payment.status === "PENDING" && (
                    <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />
                  )}
                  {payment.status}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(payment.createdAt).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {payment.status === "PENDING" ? (
                    <div className="flex gap-2">
                      {!isInstitution && (
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition flex items-center gap-1"
                          disabled={updating === payment.id}
                          onClick={() => handleUpdatePayment(payment.id, { status: "CONFLICT" })}
                        >
                          <XCircleIcon className="w-4 h-4" />
                          {updating === payment.id ? "Updating..." : "Mark as Conflict"}
                        </button>
                      )}

                      {isInstitution && (
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition flex items-center gap-1"
                          disabled={updating === payment.id}
                          onClick={() => handleUpdatePayment(payment.id, { status: "COMPLETED" })}
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                          {updating === payment.id ? "Updating..." : "Mark as Completed"}
                        </button>
                      )}
                    </div>
                  ) : payment.status !== "COMPLETED" && isInstitution ? (
                    <div className="mt-2 flex gap-2">
                      {editingPayment === payment.id ? (
                        <>
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition flex items-center gap-1"
                            disabled={updating === payment.id}
                            onClick={() => handleUpdatePayment(payment.id, { amount: parseFloat(newAmount) })}
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            className="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500 transition flex items-center gap-1"
                            onClick={() => setEditingPayment(null)}
                          >
                            <XMarkIcon className="w-4 h-4" />
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition flex items-center gap-1"
                          onClick={() => {
                            setEditingPayment(payment.id);
                            setNewAmount(payment.amount);
                          }}
                        >
                          <PencilIcon className="w-4 h-4" />
                          Edit Amount
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">No actions available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No payment history available.</p>
      )}
    </>
  );
}
