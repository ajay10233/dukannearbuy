"use client";

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
    // Do your upload logic here

    // Close modal after upload
    setIsModalOpen(false);
    setUserId("");
    setFile(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Upload Box */}
      <div className="flex justify-between items-center border p-4 rounded-md">
        <span className="text-gray-700 font-semibold">Upload Image or PDF</span>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Upload
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-md w-96 flex flex-col gap-4">
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
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Scan
              </button>
            </div>

            {/* File Upload */}
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="border p-2 rounded-md"
            />

            {/* Modal Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpload}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
