"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HeaderLocation() {
  const [location, setLocation] = useState("Fetching location...");
  const router = useRouter();

  const fetchLocation = async () => {
    try {
      const res = await fetch("/api/users/location");
      const data = await res.json();

      if (res.ok) {
        const formattedAddress = [
          data.houseNumber,
          data.street,
          data.city,
          data.state,
          data.zipCode,
        ]
          .filter(Boolean)
          .join(", ");
        setLocation(formattedAddress || "Unknown Location");
      } else {
        setLocation("Error fetching location");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setLocation("Error fetching location");
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 shadow-md">
      <h1 className="text-lg font-semibold">My App</h1>
      <button
        className="text-blue-500 underline"
        onClick={() => router.push("/change-location")}
      >
        {location}
      </button>
    </header>
  );
}
