"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function PaymentHistory() {
  const [receiverId, setReceiverId] = useState(null);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // Fetch conversation to get otherUser.id
    const fetchReceiverId = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/conversations/all`);
        const json = await res.json();
        const id = json?.data?.[0]?.otherUser?.id;
        if (id) {
          setReceiverId(id);
        }
      } catch (error) {
        console.error("Error fetching conversations", error);
      }
    };

    fetchReceiverId();
  }, []);

  useEffect(() => {
    // Once receiverId is set, fetch payments
    const fetchPayments = async () => {
      if (!receiverId) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/history?receiverId=${receiverId}`);
        const json = await res.json();
        setPayments(json.payments || []);
      } catch (error) {
        console.error("Error fetching payments", error);
      }
    };

    fetchPayments();
  }, [receiverId]);

  return (
    <div className="flex flex-col gap-y-3 mt-5 cursor-default">
      {/* Header Row */}
      <div className="flex items-center *:w-1/3 text-sm capitalize text-slate-400">
        <div className="flex justify-center items-center gap-x-1">
          <h3>Billing Date</h3>
        </div>
        <div className="flex justify-center items-center gap-x-1">
          <h3>Amount</h3>
        </div>
        <div className="flex justify-center items-center gap-x-1">
          <h3>Status</h3>
        </div>
      </div>

      {/* Payment Cards */}
      <div className="flex flex-col gap-y-4">
        {payments.map((details, i) => (
          <div className="flex items-center bg-white p-2 py-3 rounded-lg" key={i}>
            <ul className="flex items-center text-sm text-slate-500 *:w-1/3 w-full text-center">
              <li>{new Date(details.createdAt).toLocaleDateString()}</li>
              <li>₹{details.amount}</li>
              <li className="flex justify-center">
                <span
                  className={`${
                    details.status === "PENDING"
                      ? `bg-yellow-100 text-yellow-400`
                      : details.status === "CONFLICT"
                      ? `bg-red-100 text-red-400`
                      : `bg-green-100 text-green-400`
                  } rounded-full block w-3/4 p-0.5`}
                >
                  {details.status}
                </span>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
