'use client';

import { MapPin } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from 'react-hot-toast';

export default function EditAddress() {
    const [form, setForm] = useState({
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
        currentLocation: '',
    });
    
    const [message, setMessage] = useState("");
    
    const handleChange = (e) => {
        const { name, value } = e.target;
      
        if (["houseNumber", "street", "buildingName", "landmark", "city", "state", "country", "zipCode"].includes(name)) {
          setForm((prev) => ({
            ...prev,
            address: {
              ...prev.address,
              [name]: value
            }
          }));
        } else {

          setForm((prev) => ({
            ...prev,
            [name]: value
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

     useEffect(() => {
        const fetchProfileData = async () => {
          try {
            const response = await fetch("/api/users/me");
            const data = await response.json();
            
            if (response.ok) {
              setForm(data);
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
          
        try {
            const formData = new FormData();
            Object.keys(form).forEach((key) => {
              formData.append(key, form[key]);
            });
        
            const response = await fetch('/api/institutions/edit-details', {
              method: 'POST',
              body: formData,
            });
            const result = await response.json();
            if (response.ok) {
              toast.success("Address updated successfully");
              console.log("Address updated successfully:", result);
            } else {
              toast.error(result?.error || "Failed to update address");
            }
          } catch (error) {
            console.error("Error details:", error);
            toast.error("An error occurred while updating the address");
          }
    };
    
    return (
        <form className="flex flex-col gap-3" onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
        }}>
            
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
                <label className="font-medium text-gray-700">Building Name </label>
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

            <div>
                <label className="font-medium text-gray-700">Shop Address</label>
                <input
                name="shopAddress"
                value={form?.shopAddress || ""}
                onChange={handleChange}
                placeholder="Full Address (e.g. auto-generated or manually combined)"
                className="border p-2 rounded w-full"
                required
                />
            </div>

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
            type="submit"
            className="mt-4 w-full px-4 py-2 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
        </button>
        {message && <p className="mt-4 text-sm">{message}</p>}    
        </form>
    );
}