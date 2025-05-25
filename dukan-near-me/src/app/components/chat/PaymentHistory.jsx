"use client";

import { ChevronDown, ChevronUp, Pencil, Check, X, Plus, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PaymentHistory({receiverId}) {
  // const [receiverId, setReceiverId] = useState(null);
  const [payments, setPayments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedPayment, setEditedPayment] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const fetchPayments = async () => {
    if (!receiverId) return;
    try {
      const res = await fetch(`/api/payments/history?receiverId=${receiverId}`);
      const json = await res.json();
      setPayments(json.payments || []);
    } catch (error) {
      console.error("Error fetching payments", error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [session, receiverId]);

  const handleEditClick = (payment) => {
    setEditingId(payment.id);
    setEditedPayment({ ...payment });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedPayment({});
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`/api/payments/update-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: editedPayment.id,
          amount: editedPayment.amount,
          status: editedPayment.status,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        await fetchPayments();
        setEditingId(null);
        setEditedPayment({});
      } else {
        toast.error(json.error || "Failed to update payment");
      }
    } catch (error) {
      console.error("Save failed", error);
      toast.error("An error occurred while saving the payment.");
    }
  };

  const updateEditedField = (field, value) => {
    setEditedPayment((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: session?.user?.id,
          receiverId,
          amount: parseFloat(amount),
          status,
        }),
      });

      if (response.ok) {
        toast.success("✅ Payment created successfully!");
        setAmount("");
        setStatus("PENDING");
        setShowCreateForm(false);
        await fetchPayments();
      } else {
        throw new Error("❌ Failed to create payment");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-2 md:gap-y-4 cursor-default">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Toggle Create Form Button */}
      {receiverId && (
        <div className="self-end">
          <button
            onClick={() => setShowCreateForm((prev) => !prev)}
            className="flex items-center gap-x-2 bg-teal-600 text-sm md:text-[16px] text-white p-2 md:px-4 md:py-2 cursor-pointer rounded-md hover:bg-teal-700 transition-all ease-in-out duration-400"
          >
            {showCreateForm ? <ArrowLeft size={16} /> : <Plus size={16} />}
            {showCreateForm ? "Back to Payments" : "Create Payment"}
          </button>
        </div>
      )}

      {/* Create Payment Form */}
      {showCreateForm && (
        <div className="max-w-xl w-full bg-white p-6 rounded-md shadow">
          <h2 className="text-lg font-semibold mb-4 text-black">Create Payment</h2>
          <form onSubmit={handleCreatePayment}>
            <div className="mb-4">
              <label className="block text-gray-700">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-700 transition-all ease-in-out duration-400 cursor-pointer"
              >
                <option value="PENDING">Pending</option>
                <option value="SUCCESS">Success</option>
                <option value="CONFLICT">Conflict</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-2 rounded-md transition-all ease-in-out duration-400 cursor-pointer ${loading ? "bg-gray-400" : "bg-emerald-600 hover:bg-emerald-700"}`}
            >
              {loading ? "Processing..." : "Create Payment"}
            </button>
          </form>
        </div>
      )}

      {/* Payment Table Header */}
      {!showCreateForm && (
        <>
          <div className="flex items-center *:w-1/3 text-sm capitalize text-slate-400">
            <h3 className="text-center w-1/3">Billing Date</h3>
            <h3 className="text-center w-1/3">Amount</h3>
            <h3 className="text-center w-1/3">Status</h3>
          </div>

          {/* Payment List */}
          <div className="flex flex-col gap-y-4">
            {payments.map((payment) => {
              const isEditing = editingId === payment.id;
              return (
                <div key={payment.id} className="flex items-center bg-white p-2 py-3 rounded-lg">
                  <ul className="flex items-center text-sm text-slate-500 *:w-1/3 w-full text-center">
                    <li>{new Date(payment.createdAt).toLocaleDateString()}</li>
                    <li>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editedPayment.amount}
                          onChange={(e) => updateEditedField("amount", parseFloat(e.target.value))}
                          className="border rounded text-[10px] md:text-sm px-1 py-0.5 w-2/3"
                        />
                      ) : (
                        <>₹{payment.amount}</>
                      )}
                    </li>
                    <li className="flex justify-center items-center">
                      {isEditing ? (
                        <select
                          value={editedPayment.status}
                          onChange={(e) => updateEditedField("status", e.target.value)}
                          className="border rounded text-[10px] md:text-sm px-1 py-0.5"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CONFLICT">CONFLICT</option>
                        </select>
                      ) : (
                        <span
                          className={`${
                            payment.status === "PENDING"
                              ? `bg-yellow-100 text-yellow-400 text-[10px] md:text-sm`
                              : payment.status === "CONFLICT"
                              ? `bg-red-100 text-red-400 text-[10px] md:text-sm`
                              : `bg-green-100 text-green-400 text-[10px] md:text-sm`
                          } rounded-full block w-3/4 px-1.5 md:p-0.5`}
                        >
                          {payment.status}
                        </span>
                      )}
                    </li>
                  </ul>
                  <div className="flex flex-col items-center gap-y-1 md:flex-row md:items-center md:gap-x-2 ml-2">
                    {isEditing ? (
                      <>
                        <button onClick={handleSaveEdit} className="transition-all ease-in-out duration-400 cursor-pointer">
                          <Check className="text-green-500 w-4 h-4" />
                        </button>
                        <button onClick={handleCancelEdit} className="transition-all ease-in-out duration-400 cursor-pointer">
                          <X className="text-red-500 w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      payment.status !== "COMPLETED" && payment.status !== "SUCCESS" && (
                      <button onClick={() => handleEditClick(payment)} className="transition-all ease-in-out duration-400 cursor-pointer">
                        <Pencil className="text-slate-500 w-4 h-4 hover:text-teal-700" />
                      </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
