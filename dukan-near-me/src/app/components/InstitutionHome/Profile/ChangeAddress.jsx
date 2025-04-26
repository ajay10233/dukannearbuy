'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ChangeAddress({ currentAddress, onSave }) {
  const [form, setForm] = useState({
    houseNumber: '',
    street: '',
    buildingName: '',
    landmark: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    shopAddress: '',
    latitude: '',
    longitude: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true); 

    const updatedForm = {
      ...form,
      latitude: parseFloat(form.latitude) || null,
      longitude: parseFloat(form.longitude) || null,
    };

    try {
      const res = await fetch('/api/institutions/past-address', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedForm),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success('Address updated successfully!');
        onSave(updatedForm, currentAddress);
      } else {
        toast.error(result.error || 'Failed to update address');
      }
    } catch (error) {
      toast.error('Something went wrong!');
    }

    setLoading(false); 
  };

  return (
    <form onSubmit={(e) => {
        e.preventDefault(); 
        handleSubmit();    
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(form).map(([key, value]) => (
          <input
            key={key}
            name={key}
            value={value}
            placeholder={key}
            onChange={handleChange}   required
            className="p-2 border rounded"
          />
        ))}
      </div>
      <button
        // onClick={handleSubmit}
        disabled={loading}
        className={`flex flex-col w-full justify-center cursor-pointer items-center mt-4 px-4 py-2 text-white rounded transition-all ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
