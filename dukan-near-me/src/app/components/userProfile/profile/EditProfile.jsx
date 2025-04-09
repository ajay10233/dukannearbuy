'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function EditProfile({ user, onCancel, onSuccess }) {
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'radio' ? value : value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      // Construct backend-compatible payload
      const payload = {
        ...formData,
        ...formData.address,
        mobileNumber: formData.phone, // backend expects mobileNumber
      };

      // Clean up
      delete payload.address;
      delete payload.phone;

      const res = await fetch('/api/users/edit-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Something went wrong');

      toast.success('Profile updated!');
      onSuccess();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="grid gap-4 mb-4">

      {/* Address Fields */}
      <div className="grid grid-cols-2 gap-4">
        <input
          name="address.houseNumber"
          value={formData.address?.houseNumber || ''}
          onChange={handleChange}
          placeholder="House Number"
          className="p-2 border rounded"
        />
        <input
          name="address.street"
          value={formData.address?.street || ''}
          onChange={handleChange}
          placeholder="Street"
          className="p-2 border rounded"
        />
        <input
          name="address.buildingName"
          value={formData.address?.buildingName || ''}
          onChange={handleChange}
          placeholder="Building Name"
          className="p-2 border rounded"
        />
        <input
          name="address.landmark"
          value={formData.address?.landmark || ''}
          onChange={handleChange}
          placeholder="Landmark"
          className="p-2 border rounded"
        />
        <input
          name="address.city"
          value={formData.address?.city || ''}
          onChange={handleChange}
          placeholder="City"
          className="p-2 border rounded"
        />
        <input
          name="address.state"
          value={formData.address?.state || ''}
          onChange={handleChange}
          placeholder="State"
          className="p-2 border rounded"
        />
        <input
          name="address.country"
          value={formData.address?.country || ''}
          onChange={handleChange}
          placeholder="Country"
          className="p-2 border rounded"
        />
        <input
          name="address.zipCode"
          value={formData.address?.zipCode || ''}
          onChange={handleChange}
          placeholder="Zip Code"
          className="p-2 border rounded"
        />
      </div>

      {/* Other Profile Fields */}
      <div className="grid grid-cols-2 gap-4">
        <input
          name="age"
          type='number'
          value={formData?.age || ''}
          onChange={handleChange}
          placeholder="Age"
          className="p-2 border rounded"
        />
        <div className="flex justify-around items-center gap-4">
          {['Male', 'Female', 'Other'].map((gender) => (
            <label key={gender} className="flex items-center gap-1">
              <input
                type="radio"
                name="gender"
                value={gender}
                checked={formData?.gender === gender}
                onChange={handleChange}
              />
              {gender}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          name="email"
          value={formData?.email || ''}
          onChange={handleChange}
          placeholder="Email"
          className="p-2 border rounded"
        />
        <input
          name="phone"
          value={formData?.phone || ''}
          onChange={handleChange}
          placeholder="Phone"
          className="p-2 border rounded"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-1 cursor-pointer rounded-md hover:bg-blue-500 transition">
          Save Changes
        </button>
        <button
          onClick={onCancel}
          className="border border-gray-600 px-4 py-1 cursor-pointer rounded-md hover:bg-gray-100 transition">
          Cancel
        </button>
      </div>
    </div>
  );
}
