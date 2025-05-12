'use client';

import { ScanLine, Upload } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import QrScan from '../../components/userqr-scan/QrScan';

export default function UploadPdfImg() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    if (userId.trim() === '' || !file) {
      toast.error('Please fill User ID and upload a file.');
      return;
    }

    // TODO: handle actual upload logic here
    toast.success('File uploaded successfully!');
    setIsModalOpen(false);
    setUserId('');
    setFile(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Upload Box */}
      <div className="flex justify-between items-center border border-gray-400 p-2 md:p-4 rounded-md">
        <span className="text-gray-700 font-semibold text-sm md:text-[16px]">Upload Image or PDF</span>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-2 md:px-4 py-2 text-sm md:text-[16px] cursor-pointer rounded-md bg-blue-600 text-white hover:bg-blue-800 transition-all duration-500 ease-in-out"
        >
          <Upload size={20} strokeWidth={1.5} /> Upload
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-4 md:p-6 rounded-md w-75 md:w-96 flex flex-col gap-2 md:gap-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload Details</h2>

            {/* User ID Input + QR Button */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter User ID"
                value={username || userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setUsername(''); 
                }}
                className="flex-1 border p-2 rounded-md w-42"
              />

              <button
                type="button"
                onClick={() => setShowQRScanner(true)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 cursor-pointer text-white rounded-md hover:bg-blue-800 transition-all duration-500 ease-in-out"
              >
                <ScanLine size={20} strokeWidth={1.5} /> Scan
              </button>
            </div>

            {/* Username Display */}
            {username && (
              <p className="text-green-700 font-medium -mt-2">Username: {username}</p>
            )}

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
                className="px-4 py-2 rounded-md bg-emerald-600 text-white cursor-pointer hover:bg-emerald-700 transition-all duration-500 ease-in-out"
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

          {/* QR Scanner Modal */}
          {showQRScanner && (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-4 shadow-lg w-75 md:w-full md:max-w-md relative">
                <h1 className="text-2xl md:text-3xl font-semibold text-center text-gray-700 mb-3 md:mb-6">QR Code Scanner</h1>
                <div className="text-center text-gray-500 mb-2 md:mb-4">
                  <p>Scan a QR code using your camera</p>
                </div>
                <button
                  onClick={() => setShowQRScanner(false)}
                  className="absolute top-2 right-2 text-red-500 font-bold cursor-pointer"
                >
                  ✕
                </button>
                <QrScan
                  setUserId={(id) => {
                    setUserId(id);
                    setShowQRScanner(false);
                    toast.success('User ID scanned');
                  }}
                  setUsername={(name) => setUsername(name)}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
