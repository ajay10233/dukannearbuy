"use client";

import React from "react";
import { X, MapPin } from "lucide-react";
import toast from "react-hot-toast";

export default function EditProfile({ formData, setFormData, errors, handleChange, handleSave, setShowModal }) {
  const handleLocationFetch = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setFormData((prev) => ({
          ...prev,
          currentLocation: mapsUrl,
        }));
        toast.success("Location URL fetched");
      },
      () => toast.error("Location access denied")
    );
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white p-6 rounded-lg w-[95%] max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Edit Profile Details</h2>
          <button onClick={() => setShowModal(false)}>
            <X className="text-gray-600 hover:text-red-600 cursor-pointer" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {/* Firm Name */}
          <div>
            <label className="font-medium text-gray-700">Firm Name</label>
            <input
              name="firmName"
              value={formData?.firmName || ""}
              onChange={handleChange}
              placeholder="Enter Firm Name"
              className="border p-2 rounded w-full"
            />
            {errors?.firmName && <span className="text-sm text-red-500">{errors.firmName}</span>}
          </div>

          {/* Description */}
          <div>
            <label className="font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData?.description || ""}
              onChange={handleChange}
              placeholder="Enter Description"
              className="border p-2 rounded w-full"
            />
            {errors?.description && <span className="text-sm text-red-500">{errors.description}</span>}
          </div>

          {/* Hashtags */}
          <div>
            <label className="font-medium text-gray-700">Hashtags</label>
            <input
              name="hashtags"
              value={formData?.hashtags || ""}
              onChange={handleChange}
              placeholder="Comma separated (e.g. doctor, clinic)"
              className="border p-2 rounded w-full"
            />
            {errors?.hashtags && <span className="text-sm text-red-500">{errors.hashtags}</span>}
          </div>

          {/* Open Time */}
          <div>
            <label className="font-medium text-gray-700">Open Time</label>
            <input
              name="openTime"
              type="time"
              value={formData?.openTime || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            {errors?.openTime && <span className="text-sm text-red-500">{errors.openTime}</span>}
          </div>

          {/* Close Time */}
          <div>
            <label className="font-medium text-gray-700">Close Time</label>
            <input
              name="closeTime"
              type="time"
              value={formData?.closeTime || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            {errors?.closeTime && <span className="text-sm text-red-500">{errors.closeTime}</span>}
          </div>

          {/* UPI ID */}
          <div>
            <label className="font-medium text-gray-700">UPI ID</label>
            <input
              name="upiId"
              value={formData?.upiId || ""}
              onChange={handleChange}
              placeholder="Enter UPI ID"
              className="border p-2 rounded w-full"
            />
            {errors?.upiId && <span className="text-sm text-red-500">{errors.upiId}</span>}
          </div>

          {/* Scanner Image */}
          <div>
            <label className="font-medium text-gray-700">Scanner QR Image</label>
            <input
              name="scannerImage"
              type="file"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            {errors?.scannerImage && <span className="text-sm text-red-500">{errors.scannerImage}</span>}
          </div>

          {/* Latitude */}
          <div>
            <label className="font-medium text-gray-700">Current Location</label>
            <div className="relative">
              <input
                name="currentLocation"
                value={formData?.currentLocation || ""}
                onChange={handleChange}
                placeholder="Enter or fetch location"
                className="border p-2 rounded w-full pr-10"
              />
              <button
                type="button"
                onClick={handleLocationFetch}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-600"
              >
                <MapPin size={18} />
              </button>
            </div>
            {errors?.currentLocation && <span className="text-sm text-red-500">{errors.currentLocation}</span>}
          </div>

        </div>

        <button
          onClick={handleSave}
          className="mt-4 w-full px-4 py-2 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  );
}
