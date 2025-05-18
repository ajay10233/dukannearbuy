"use client";

import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EditProfilePage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false); 
  const [form, setForm] = useState({
    firmName: '',
    contactEmail: '',
    mobileNumber: '',
    username: '',
    address: {
      houseNumber: '',
      street: '',
      buildingName: '',
      landmark: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    shopAddress: '',
    description: '',
    hashtags: [],
    shopOpenTime: '',
    shopCloseTime: '',
    upi_id: '',
    scanner_image: null,
    currentLocation: '',
    shopOpenDays: []  // <-- ADD THIS
  });

  
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"];

 const handleChange = (e) => {
  const { name, value } = e.target;

  // Address field handling
  if (
    ["houseNumber", "street", "buildingName", "landmark", "city", "state", "country", "zipCode"].includes(name)
  ) {
    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  } else if (e.target.type === 'file') {
    const file = e.target.files?.[0];
    setForm((prev) => ({
      ...prev,
      [name]: file
    }));
  } else {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

  const handleLocationFetch = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          const address = data.display_name || `Lat: ${latitude}, Long: ${longitude}`;

          setForm((prev) => ({
            ...prev,
            latitude,
            longitude,
            currentLocation: address,
          }));

          toast.success("Location fetched successfully");
        } catch (err) {
          toast.error("Failed to fetch address");
        }
      },
      () => toast.error("Location access denied")
    );
  };

  const handleDayToggle = (e) => {
    const { value, checked } = e.target;
    setForm((prevForm) => {
      const updatedDays = checked
        ? [...prevForm.shopOpenDays, value] // Add the day if checked
        : prevForm.shopOpenDays.filter((day) => day !== value); // Remove the day if unchecked
      return {
        ...prevForm,
        shopOpenDays: updatedDays,
      };
    });
  };  
  

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/users/me");
        const data = await response.json();
        
        if (response.ok) {
          setForm(data);
          toast.success("Profile data loaded!");
        } else {
          toast.error(data?.message || "Failed to load profile data");
        }
      } catch (error) {
        toast.error("An error occurred while fetching profile data");
      }
    };

    fetchProfileData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
  
    let hashtagsArray = [];
  
    if (typeof form.hashtags === 'string') {
      hashtagsArray = form.hashtags.split(',').map(tag => tag.trim());
    } else if (Array.isArray(form.hashtags)) {
      hashtagsArray = form.hashtags.map(tag => tag.trim());
    }
  
    const formData = new FormData(e.target);
    formData.set('hashtags', JSON.stringify(hashtagsArray));
    formData.set('shopOpenDays', JSON.stringify(form.shopOpenDays));
    formData.set('address', JSON.stringify(form.address));

    try {
      const response = await fetch('/api/institutions/edit-details', {
        method: 'POST',
        body: formData,
      });
    
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Profile updated successfully");
        console.log("Profile updated successfully:", result);

        router.push('/search-result');
      } else {
        toast.error(result?.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating the profile");
    } finally {
      setIsSaving(false); 
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Edit Profile Details</h1>
          <button 
            onClick={() => router.push('/search-result')}
            className="text-gray-600 hover:text-red-600 cursor-pointer"
          >
            Back
          </button>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          {/* Firm Name */}
          <div>
            <label className="font-medium text-gray-700">Firm Name</label>
            <input
              type="text"
              name="firmName"
              value={form?.firmName || ''}
              onChange={handleChange}
              placeholder="Enter Firm Name"
              className="border p-2 rounded w-full"
              required
            />
            {errors?.firmName && <span className="text-sm text-red-500">{errors.firmName}</span>}
          </div>

          {/* contact email */}
          <div>
            <label className="font-medium text-gray-700"> Email</label>
            <input
              type="email"
              name="contactEmail"
              value={form?.contactEmail || ''}
              onChange={handleChange}
              placeholder="Type your Email"
              className="border p-2 rounded w-full"
              required
            />
            {errors?.contactEmail && <span className="text-sm text-red-500">{errors.contactEmail}</span>}
          </div>

          {/* contact number */}
          <div>
            <label className="font-medium text-gray-700">Contact Number</label>
            <input
              type="number"
              name="mobileNumber"
              value={form?.mobileNumber || ''}
              onChange={handleChange}
              placeholder="Enter Contact number"
              className="border p-2 rounded w-full"
              required
            />
            {errors?.mobileNumber && <span className="text-sm text-red-500">{errors.mobileNumber}</span>}
          </div>

          <div>
            <label className="font-medium text-gray-700"> User Id:</label>
            <input
              type="username"
              name="username"
              value={form?.username || ''}
              onChange={handleChange}
              placeholder="Type your User Id"
              className="border p-2 rounded w-full"
              required
            />
          </div>

          {/* Detailed Address Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-gray-700">House Number</label>
              <input
                name="houseNumber"
                value={form?.address?.houseNumber || ""}
                onChange={handleChange}
                placeholder="Enter House Number"
                className="border p-2 rounded w-full"
                required
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">Street</label>
              <input
                name="street"
                value={form?.address?.street || ""}
                onChange={handleChange}
                placeholder="Enter Street"
                className="border p-2 rounded w-full"
                required
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">Building Name</label>
              <input
                name="buildingName"
                value={form?.address?.buildingName || ""}
                onChange={handleChange}
                placeholder="Enter Building Name"
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">Landmark</label>
              <input
                name="landmark"
                value={form?.address?.landmark || ""}
                onChange={handleChange}
                placeholder="Enter Landmark"
                className="border p-2 rounded w-full"
                required
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">City</label>
              <input
                name="city"
                value={form?.address?.city || ""}
                onChange={handleChange}
                placeholder="Enter City"
                className="border p-2 rounded w-full"
                required
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">State</label>
              <input
                name="state"
                value={form?.address?.state || ""}
                onChange={handleChange}
                placeholder="Enter State"
                className="border p-2 rounded w-full"
                required
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">Country</label>
              <input
                name="country"
                value={form?.address?.country || ""}
                onChange={handleChange}
                placeholder="Enter Country"
                className="border p-2 rounded w-full"
                required
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">Zip Code</label>
              <input
                name="zipCode"
                value={form?.address?.zipCode || ""}
                onChange={handleChange}
                placeholder="Enter Zip Code"
                className="border p-2 rounded w-full"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-medium text-gray-700">Full Shop Address</label>
              <input
                name="shopAddress"
                value={form?.shopAddress || ""}
                onChange={handleChange}
                placeholder="Full Address (e.g. auto-generated or manually combined)"
                className="border p-2 rounded w-full"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form?.description || ""}
              onChange={handleChange}
              placeholder="Enter Description"
              maxLength={1000}
              className="border p-2 rounded w-full"
              required
            />
            <div className="text-sm mt-1 text-right">
              {form?.description?.length === 1000 && (
                <p className="text-red-500 text-xs font-medium mt-1">You have reached the maximum character limit.</p>
              )}
            </div>

            {errors?.description && <span className="text-sm text-red-500">{errors.description}</span>}
          </div>

          {/* Hashtags */}
          <div>
            <label className="font-medium text-gray-700">Hashtags</label>
            <input
              name="hashtags"
              value={form?.hashtags || ""}
              onChange={handleChange}
              placeholder="Comma separated (e.g. doctor, clinic)"
              className="border p-2 rounded w-full"
              required
            />
            {errors?.hashtags && <span className="text-sm text-red-500">{errors.hashtags}</span>}
          </div>

          {/* Open Time */}
          <div>
            <label className="font-medium text-gray-700">Open Time</label>
            <input
              name="shopOpenTime"
              type="time"
              value={form?.shopOpenTime || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            {errors?.shopOpenTime && <span className="text-sm text-red-500">{errors.shopOpenTime}</span>}
          </div>

          {/* Close Time */}
          <div>
            <label className="font-medium text-gray-700">Close Time</label>
            <input
              name="shopCloseTime"
              type="time"
              value={form?.shopCloseTime || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            {errors?.shopCloseTime && <span className="text-sm text-red-500">{errors.shopCloseTime}</span>}
          </div>

          {/* Shop Open Days */}
          <div className="flex flex-col gap-y-2">
      <label className="font-medium text-gray-700">Shop Open Days</label>
      <div className="grid grid-cols-2 pl-4 gap-2 text-sm text-gray-700">
        {daysOfWeek.map((day) => (
          <label key={day} className="flex items-center space-x-2 cursor-pointer">
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
              value={form?.upi_id || ""}
              onChange={handleChange}
              placeholder="Enter UPI ID"
              className="border p-2 rounded w-full" 
              required
            />
            {errors?.upi_id && <span className="text-sm text-red-500">{errors.upi_id}</span>}
          </div>

          {/* Scanner Image */}
          <div>
            <label className="font-medium text-gray-700">Upload Scanner Image</label>
            <input
              name="scanner_image"
              placeholder="Upload Scanner QR Image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="border p-2 rounded w-full" required
            />
            {errors?.scanner_image && <span className="text-sm text-red-500">{errors.scanner_image}</span>}
          </div>

          {/* current location */}
          <div>
            <label className="font-medium text-gray-700">Current Location</label>
            <div className="relative">
              <input
                name="currentLocation"
                value={form?.currentLocation || ""}
                onChange={handleChange}
                placeholder="Type or Click on Icon to get current location..."
                className="border p-2 rounded w-full pr-10"
                required
              />
              <button
                type="button"
                onClick={handleLocationFetch}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-600"
              >
                <MapPin size={18} />
              </button>
            </div>
          </div>

          <button 
            type="submit" disabled={isSaving}
            className="mt-4 w-full px-4 py-2 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700"
          >
              {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>
        {message && <p className="mt-4 text-sm">{message}</p>}
      </div>
    </div>
  );
}