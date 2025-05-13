"use client";

import { useState } from "react";
import toast from "react-hot-toast";

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
      <div className="bg-white p-4 md:p-8 rounded-md shadow-lg w-80 md:w-full md:max-w-3xl relative">
        <h2 className="text-xl font-bold mb-4">Edit Format Details</h2>

        <form className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-4">
          <label className="flex flex-col">
            Firm Name:
            <input
              type="text"
              name="firmName"
              value={formData.firmName}
              onChange={handleChange}
              required
              className="border p-2 rounded mt-1"
              placeholder="Enter your Firm Name"
            />
          </label>

          <label className="flex flex-col">
            Firm Address:
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="border p-2 rounded mt-1"
              placeholder="Enter your Firm Address"
            />
          </label>

          <label className="flex flex-col">
            Contact No.:
            <input
              type="text"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              required
              className="border p-2 rounded mt-1"
              placeholder="Type your Contact No."
            />
          </label>

          <label className="flex flex-col">
            GST No.:
            <input
              type="text"
              name="gstNo"
              value={formData.gstNo}
              onChange={handleChange}
              className="border p-2 rounded mt-1"
              placeholder="Type your GST No."
            />
          </label>

          <label className="flex flex-col">
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 rounded mt-1"
              placeholder="Type your Email ID"
            />
          </label>

          <label className="flex flex-col">
            CGST (%):
            <input
              type="number"
              name="cgst"
              value={formData.cgst}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              className="border p-2 rounded mt-1"
              placeholder="CGST in %"
            />
          </label>

          <label className="flex flex-col">
            SGST (%):
            <input
              type="number"
              name="sgst"
              value={formData.sgst}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              className="border p-2 rounded mt-1"
              placeholder="SGST in %"
            />
          </label>

          <label className="flex flex-col">
            Upload Proprietor Signature:
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  proprietorSign: e.target.files?.[0] || null,
                }))
              }
              className="border p-2 rounded mt-1"
            />
          </label>

          <label className="flex flex-col">
            Terms & Conditions (max 250 characters):
            <textarea
              name="terms"
              value={formData.terms}
              maxLength={250}
              onChange={handleChange}
              className="border p-2 rounded resize-none mt-1 min-h-[120px]"
              placeholder="Enter Terms & Conditions"
            />
          </label>

          <label className="flex flex-col">
            Updates / Offer Information (max 150 characters):
            <textarea
              name="updates"
              value={formData.updates}
              maxLength={150}
              onChange={handleChange}
              className="border p-2 rounded resize-none mt-1 min-h-[80px]"
              placeholder="Enter Updates or Offers"
            />
          </label>

          <div className="flex justify-center gap-4 mt-4">
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                const form = e.target.form;
                if (form.checkValidity()) {
                  closeModal();
                  toast.success("Format details saved successfully!");
                } else {
                  form.reportValidity();
                }
              }}
              className="px-8 py-2 rounded cursor-pointer bg-blue-600 text-white transition-all duration-500 ease-in-out hover:bg-blue-800"
            >
              Save
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded border border-gray-500 cursor-pointer transition-all duration-500 ease-in-out hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
