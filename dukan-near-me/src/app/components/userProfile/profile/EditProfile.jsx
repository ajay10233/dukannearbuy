'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function EditProfile({ user, onCancel, onSuccess }) {
  const [formData, setFormData] = useState({ ...user });
  const [otpRequired, setOtpRequired] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

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

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true); 

    const previousEmail = user.email;
    const previousPhone = user.phone;

    try {
      const payload = {
        ...formData,
        ...formData.address,
        mobileNumber: formData.phone,
      };

      delete payload.address;
      delete payload.phone;

      const res = await fetch('/api/users/edit-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log(result);
      if (!res.ok) throw new Error(result.error || 'Something went wrong');

      toast.success('Profile updated successfully!');
      setIsSaving(false); 
      onSuccess(result.user);

      // if (formData.email !== previousEmail || formData.phone !== previousPhone) {
      //   router.push(`/otp-verify?email=${formData.email}&phone=${formData.phone}`);
      // } else {
      //   onSuccess();
      // }
    } catch (err) {
      toast.error(err.message);
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="grid gap-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="email"
          value={formData?.email || ''}
          onChange={handleChange}
          placeholder="Email"
          className="p-2 border rounded"
          required
        />
        <input
          name="phone"
          value={formData?.phone || ''}
          onChange={handleChange}
          placeholder="Phone"
          className="p-2 border rounded"
          required
        />
      </div>

      {/* Other Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="age"
          type="number"
          value={formData?.age || ''}
          onChange={handleChange}
          placeholder="Age"
          className="p-2 border rounded"
          required
        />
        <input
          name="username"
          value={formData?.username || ''}
          onChange={handleChange}
          placeholder="Username"
          className="p-2 border rounded"
        />
      </div>

      {/* Address Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="address.houseNumber"
          value={formData.address?.houseNumber || ''}
          onChange={handleChange}
          placeholder="House Number"
          className="p-2 border rounded"
          required
        />
        <input
          name="address.street"
          value={formData.address?.street || ''}
          onChange={handleChange}
          placeholder="Street"
          className="p-2 border rounded"
          required
        />
        <input
          name="address.buildingName"
          value={formData.address?.buildingName || ''}
          onChange={handleChange}
          placeholder="Building Name"
          className="p-2 border rounded"
          required
        />
        <input
          name="address.landmark"
          value={formData.address?.landmark || ''}
          onChange={handleChange}
          placeholder="Landmark"
          className="p-2 border rounded"
          required
        />
        <input
          name="address.city"
          value={formData.address?.city || ''}
          onChange={handleChange}
          placeholder="City"
          className="p-2 border rounded"
          required
        />
        <input
          name="address.state"
          value={formData.address?.state || ''}
          onChange={handleChange}
          placeholder="State"
          className="p-2 border rounded"
          required
        />
        <input
          name="address.country"
          value={formData.address?.country || ''}
          onChange={handleChange}
          placeholder="Country"
          className="p-2 border rounded"
          required
        />
        <input
          name="address.zipCode"
          value={formData.address?.zipCode || ''}
          onChange={handleChange}
          placeholder="Zip Code"
          className="p-2 border rounded"
          required
        />
      </div>

      {/* Gender */}
      <div className="flex flex-col md:flex-row gap-4 justify-start items-start md:items-center">
        <label className="text-sm font-medium text-gray-700">Gender:</label>
        <div className="flex flex-wrap gap-4">
          {['Male', 'Female', 'Other'].map((gender) => (
            <label key={gender} className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value={gender}
                checked={formData?.gender === gender}
                onChange={handleChange}
                required
              />
              {gender}
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <button
          type="submit"
          disabled={isSaving} 
          className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-md hover:bg-blue-500 transition"
        >
          {isSaving ? 'Saving...' : 'Save Changes'} 
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-gray-600 px-4 py-2 cursor-pointer rounded-md hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
