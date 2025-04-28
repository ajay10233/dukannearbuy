"use client";

import { ScanLine, Upload } from "lucide-react";
import { useState } from "react";

export default function UploadPdfImg() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    if (userId.trim() === "" || !file) {
      alert("Please fill User ID and upload a file.");
      return;
    }
    setIsModalOpen(false);
    setUserId("");
    setFile(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Upload Box */}
      <div className="flex justify-between items-center border border-gray-400 p-2 md:p-4 rounded-md">
        <span className="text-gray-700 font-semibold text-md">Upload Image or PDF</span>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-2 md:px-4 py-2 cursor-pointer rounded-md bg-blue-600 text-white hover:bg-blue-800 transition-all duration-500 ease-in-out"
        >
          <Upload size={20} strokeWidth={1.5} /> Upload
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-md w-100 flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload Details</h2>

            {/* User ID Input and Scan Button */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="flex-1 border p-2 rounded-md"
              />
              <button
                type="button"
                onClick={() => setUserId("ScannedUserID123")}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 cursor-pointer text-white rounded-md hover:bg-blue-800 transition-all duration-500 ease-in-out"
              >
                <ScanLine size={20} strokeWidth={1.5} color="#fff" /> Scan
              </button>
            </div>

            {/* File Upload */}
            <div className="flex flex-col gap-2">
              <label htmlFor="fileUpload" className="text-gray-700 font-medium">
                Upload Image or PDF
              </label>
              <input
                id="fileUpload"
                type="file"
                accept="application/pdf,image/*"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                className="border p-2 rounded-md"
              />
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={handleUpload}
                className="px-4 py-2 rounded-md cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-500 ease-in-out"
              >
                Upload
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-400 cursor-pointer text-gray-700 hover:bg-gray-100 transition-all duration-500 ease-in-out"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
