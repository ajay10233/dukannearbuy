"use client";

import React, { useState } from "react";
import { X, MapPin } from "lucide-react";
import toast from "react-hot-toast";

export default function EditProfile({ setShowModal, errors, handleChange, handleSubmit, form, setForm, setProfileUpdated, message, setMessage }) {
  const handleLocationFetch = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setForm((prev) => ({
          ...prev,
          shopAddress: mapsUrl,
        }));
        toast.success("Location URL fetched");
      },
      () => toast.error("Location access denied")
    );
  };
  
  // const [message, setMessage] = useState('');
  
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  
  const handleDayToggle = (e) => {
    const selectedDay = e.target.value;
    const isChecked = e.target.checked;
  
    setForm((prev) => {
      const updatedDays = isChecked
        ? [...(prev.shopOpenDays || []), selectedDay]
        : prev.shopOpenDays.filter((day) => day !== selectedDay);
  
      return {
        ...prev,
        shopOpenDays: updatedDays.sort(
          (a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b)
        ),
      };
    });
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

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          
          {/* Firm Name */}
          <div>
            <label className="font-medium text-gray-700">Firm Name</label>
            <input
              type="text"
              name="firmName"
              value={form?.firmName}
              onChange={handleChange}
              placeholder="Enter Firm Name"
              className="border p-2 rounded w-full"
            />
            {errors?.firmName && <span className="text-sm text-red-500">{errors.firmName}</span>}
          </div>

          {/* Shop address */}
          <div>
          <label className="font-medium text-gray-700">Address</label>
              <input
                name="shopAddress"
                value={form?.shopAddress}
                onChange={handleChange}
                placeholder="Address"
                className="border p-2 rounded w-full pr-10"
              />
          </div>

          {/* Description */}
          <div>
            <label className="font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form?.description}
              onChange={handleChange}
              placeholder="Enter Description"
              maxLength={300}
              className="border p-2 rounded w-full"
            />
            {errors?.description && <span className="text-sm text-red-500">{errors.description}</span>}
          </div>

          {/* Hashtags */}
          <div>
            <label className="font-medium text-gray-700">Hashtags</label>
            <input
              name="hashtags"
              value={form?.hashtags}
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
                name="shopOpenTime"
              type="time"
              value={form?.shopOpenTime}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            {errors?.shopOpenTime && <span className="text-sm text-red-500">{errors.shopOpenTime}</span>}
          </div>

          {/* Close Time */}
          <div>
            <label className="font-medium text-gray-700">Close Time</label>
            <input
              name="shopCloseTime"
              type="time"
              value={form?.shopCloseTime}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            {errors?.shopCloseTime && <span className="text-sm text-red-500">{errors.shopCloseTime}</span>}
          </div>

          {/* Shop Open Days */}
          <div className="flex flex-col gap-y-2">
            <label className="font-medium text-gray-700">Shop Open Days</label>
            <div className="grid grid-cols-2 pl-4 gap-2 text-sm text-gray-700">
              {daysOfWeek.map((day) => (
                <label key={day} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={day}
                    checked={form?.shopOpenDays?.includes(day)}
                    onChange={handleDayToggle}
                    className="accent-blue-600"
                  />
                  <span>{day}</span>
                </label>
              ))}
            </div>
          </div>

          {/* UPI ID */}
          <div>
            <label className="font-medium text-gray-700">UPI ID</label>
            <input
              name="upi_id"
              value={form?.upi_id}
              onChange={handleChange}
              placeholder="Enter UPI ID"
              className="border p-2 rounded w-full"
            />
            {errors?.upi_id && <span className="text-sm text-red-500">{errors.upi_id}</span>}
          </div>

          {/* Scanner Image */}
          <div>
            <label className="font-medium text-gray-700">Upload Scanner Image</label>
            <input
              name="paymentDetails"
              placeholder="Upload Scanner QR Image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            {errors?.scannerImage && <span className="text-sm text-red-500">{errors.scannerImage}</span>}
          </div>

          {/* current location */}
          <div>
            <label className="font-medium text-gray-700">Current Location</label>
            <div className="relative">
              <input
                name="currentLocation"
                value={form?.shopAddress}
                onChange={handleChange}
                placeholder="Type or fetch location"
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
            {errors?.shopAddress && <span className="text-sm text-red-500">{errors.shopAddress}</span>}
          </div>

          <button type="submit"
          // onClick={handleSave}
          className="mt-4 w-full px-4 py-2 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700">
          Save
        </button>

        </form>
        {message && <p className="mt-4 text-sm">{message}</p>}

      </div>
    </div>
  );
}
