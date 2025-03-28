"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./MapComponent"), { ssr: false });

export default function LocationSelector({ onSave }) {
  const [location, setLocation] = useState({
    lat: 0,
    lng: 0,
    houseNumber: "",
    street: "",
    buildingName: "",
    landmark: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const res = await fetch("/api/users/location");
        const data = await res.json();
        if (res.ok) {
          setLocation((prev) => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error("Error fetching user location:", error);
      }
    };

    fetchUserLocation();
  }, []);

  const handleChange = (e) => {
    setLocation((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveLocation = async () => {
    await fetch("/api/users/location", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(location),
    });
    onSave();
  };

  return (
    <div className="flex flex-col p-4 space-y-4">
      <Map setLocation={setLocation} />

      {/* Address Form */}
      <input
        name="houseNumber"
        placeholder="House Number"
        value={location.houseNumber}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        name="street"
        placeholder="Street"
        value={location.street}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        name="buildingName"
        placeholder="Building Name"
        value={location.buildingName}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        name="landmark"
        placeholder="Landmark"
        value={location.landmark}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        name="city"
        placeholder="City"
        value={location.city}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        name="state"
        placeholder="State"
        value={location.state}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        name="country"
        placeholder="Country"
        value={location.country}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        name="zipCode"
        placeholder="Zip Code"
        value={location.zipCode}
        onChange={handleChange}
        className="border p-2"
      />

      <button onClick={saveLocation} className="bg-blue-500 text-white p-2">
        Save Location
      </button>
    </div>
  );
}
