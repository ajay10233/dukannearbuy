'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ChangePastAddress() {
  const { data: session } = useSession();
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

  const [pastAddresses, setPastAddresses] = useState([]);

  useEffect(() => {
    fetchPastAddresses();
  }, []);

  const fetchPastAddresses = async () => {
    try {
      const res = await fetch('/api/institutions/past-address');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPastAddresses(data);
      }
    } catch (err) {
      console.error('Failed to fetch past addresses', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Convert latitude and longitude to float
    const updatedForm = {
      ...form,
      latitude: parseFloat(form.latitude) || null, // Use null if the value can't be converted
      longitude: parseFloat(form.longitude) || null, // Use null if the value can't be converted
    };
  
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
      setForm({
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
      fetchPastAddresses();
    } else {
      toast.error(result.error || 'Failed to update address');
    }
  };
      

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Update Address</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(form).map(([key, value]) => (
          <input
            key={key}
            name={key}
            value={value}
            placeholder={key}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save Changes
      </button>

      <h3 className="text-xl font-semibold mt-10 mb-3">Past Addresses (last 5)</h3>
      {pastAddresses.length === 0 ? (
        <p className="text-gray-500">No past addresses found.</p>
      ) : (
        <div className="grid gap-4">
          {pastAddresses.map((addr, i) => (
            <div key={addr.id} className="bg-gray-100 p-4 rounded shadow">
              <p className="font-medium text-sm">#{i + 1} (Moved out: {new Date(addr.movedOutAt).toLocaleDateString()})</p>
              <p>{addr.buildingName}, {addr.street}, {addr.city}, {addr.state} - {addr.zipCode}</p>
              <p className="text-sm text-gray-600">{addr.country}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
