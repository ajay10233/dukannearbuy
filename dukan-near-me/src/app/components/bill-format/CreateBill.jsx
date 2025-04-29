"use client";

import { X } from "lucide-react";
import { useState } from "react";

export default function CreateBill() {
  const [billItems, setBillItems] = useState([
    { particular: "", quantity: 1, rate: 0, amount: 0 },
  ]);
  const [customerDetails, setCustomerDetails] = useState({
    customerName: "",
    mobileNo: "",
    date: new Date().toISOString().substr(0, 10),
  });

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...billItems];
    updatedItems[index][field] = field === "quantity" || field === "rate" ? parseFloat(value) : value;
    updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate;
    setBillItems(updatedItems);
  };

  const addNewItem = () => {
    setBillItems([...billItems, { particular: "", quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (index) => {
    const updatedItems = billItems.filter((_, i) => i !== index);
    setBillItems(updatedItems);
  };

  const calculateTotal = () => {
    return billItems.reduce((total, item) => total + item.amount, 0);
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to clear all data?")) {
      setCustomerDetails({
        customerName: "",
        mobileNo: "",
        date: new Date().toISOString().substr(0, 10),
      });
      setBillItems([{ particular: "", quantity: 1, rate: 0, amount: 0 }]);
    }
  };

  const handleSave = () => {
    alert("Bill Saved (Next: connect with backend!)");
  };

  const handleSaveAndNew = () => {
    handleSave();
    setCustomerDetails({
      customerName: "",
      mobileNo: "",
      date: new Date().toISOString().substr(0, 10),
    });
    setBillItems([{ particular: "", quantity: 1, rate: 0, amount: 0 }]);
  };

  return (
    <div className="p-2 md:p-6">
      <h1 className="text-2xl font-bold mb-3 md:mb-6">Bill Generation</h1>

      {/* Customer Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 md:mb-8">
        <input
          type="text"
          placeholder="Customer Name (M/S or M/R)"
          value={customerDetails.customerName}
          onChange={(e) => setCustomerDetails({ ...customerDetails, customerName: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Mobile No."
          value={customerDetails.mobileNo}
          onChange={(e) => setCustomerDetails({ ...customerDetails, mobileNo: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={customerDetails.date}
          onChange={(e) => setCustomerDetails({ ...customerDetails, date: e.target.value })}
          className="border p-2 rounded"
        />
      </div>

      {/* Bill Items Table */}
      <div className="overflow-x-auto sm:overflow-x-hidden">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-1 sm:p-2">S.No</th>
              <th className="border p-1 sm:p-2">Particulars</th>
              <th className="border p-1 sm:p-2">Quantity</th>
              <th className="border p-1 sm:p-2">Rate</th>
              <th className="border p-1 sm:p-2">Amount</th>
              <th className="border p-1 sm:p-2"></th>
            </tr>
          </thead>
          <tbody>
            {billItems.map((item, index) => (
              <tr key={index}>
                <td className="border p-1 sm:p-2 text-center">{index + 1}</td>
                <td className="border p-1 sm:p-2">
                  <input
                    type="text"
                    value={item.particular}
                    onChange={(e) => handleItemChange(index, "particular", e.target.value)}
                    className="w-full p-1 "
                  />
                </td>
                <td className="border p-1 sm:p-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    className="w-full p-1 "
                  />
                </td>
                <td className="border p-1 sm:p-2">
                  <input
                    type="number"
                    min="0"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                    className="w-full p-1 "
                  />
                </td>
                <td className="border p-1 sm:p-2 text-right">{item.amount.toFixed(2)}</td>
                <td className="border p-1 sm:p-2">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="px-2 py-1 text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    <X size={20} strokeWidth={1.5} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={addNewItem}
        className="mt-4 bg-blue-600 text-white cursor-pointer px-4 py-2 rounded transition-all duration-500 ease-in-out hover:bg-blue-800"
      >
        + Add Item
      </button>

      {/* Total Calculation */}
      <div className="text-right mt-8">
        <h2 className="text-xl font-semibold">Total: ₹ {calculateTotal().toFixed(2)}</h2>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-end gap-4 mt-6">
        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          className="px-3 md:px-6 py-2 bg-emerald-500 text-white rounded cursor-pointer hover:bg-emerald-700 transition-all duration-500 ease-in-out"
        >
          Save Bill
        </button>

        {/* Cancel Button */}
        <button
          type="button"
          onClick={handleCancel}
          className="px-3 md:px-6 py-2 border border-gray-400 text-gray-600 rounded hover:bg-gray-200 transition-all duration-500 ease-in-out cursor-pointer"
        >
          Cancel
        </button>

        {/* Save & New Button */}
        <button
          type="button"
          onClick={handleSaveAndNew}
          className="px-3 md:px-6 py-2 bg-blue-600 text-white rounded cursor-pointer transition-all duration-500 ease-in-out hover:bg-blue-800"
        >
          Save & New
        </button>
      </div>
    </div>
  );
}
