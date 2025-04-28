"use client";

import { useState } from "react";

export default function EditFormatModal({ closeModal }) {
  const [formData, setFormData] = useState({
    firmName: "",
    address: "",
    contactNo: "",
    gstNo: "",
    email: "",
    cgst: "",
    sgst: "",
    proprietorSign: null,
    terms: "",
    updates: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-3xl relative">
        <h2 className="text-xl font-bold mb-4">Edit Format Details</h2>

        <form className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pl-4">
          <input
            type="text"
            placeholder="Enter your Firm Name"
            name="firmName"
            value={formData.firmName}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Enter your Firm Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Type your Contact No."
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Type your GST No."
            name="gstNo"
            value={formData.gstNo}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="email"
            placeholder="Type your Email ID"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="CGST (%)"
            name="cgst"
            value={formData.cgst}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="SGST (%)"
            name="sgst"
            value={formData.sgst}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                proprietorSign: e.target.files ? e.target.files[0] : null,
              }))
            }
            className="border p-2 rounded"
          />

          {/* Terms & Conditions Textarea */}
          <textarea
            placeholder="Terms & Conditions (max 250 characters)"
            name="terms"
            value={formData.terms}
            maxLength={250}
            onChange={handleChange}
            className="border p-2 rounded resize-none min-h-[120px]"
          />

          {/* Updates Textarea */}
          <textarea
            placeholder="Updates / Offer Information (max 150 characters)"
            name="updates"
            value={formData.updates}
            maxLength={150}
            onChange={handleChange}
            className="border p-2 rounded resize-none min-h-[80px]"
          />

          <div className="flex justify-center gap-4 mt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-2 rounded bg-gray-300 cursor-pointer transition-all duration-500 ease-in-out hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
            type="submit"
            onClick={(e) => {
                e.preventDefault();
                const form = e.target.form;
                if (form.checkValidity()) {
                closeModal();
                } else {
                form.reportValidity();
                }
            }}
            className="px-6 py-2 rounded cursor-pointer bg-blue-600 text-white transition-all duration-500 ease-in-out hover:bg-blue-800"
            >
            Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
