"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function HeaderLocation() {
  const { data: session, status } = useSession();
  const [location, setLocation] = useState("Fetching location...");
  const router = useRouter();

  useEffect(() => {
    if (session) {
      fetchLocation();
    }
  }, []);

  // const fetchLocation = async () => {
  //   try {
  //     const res = await fetch("/api/users/location");
  //     const data = await res.json();

  //     if (res.ok) {
  //       const formattedAddress = [
  //         data.houseNumber,
  //         data.street,
  //         data.city,
  //         data.state,
  //         data.zipCode,
  //       ]
  //         .filter(Boolean)
  //         .join(", ");
  //       setLocation(formattedAddress || "Unknown Location");
  //     } else {
  //       setLocation("Error fetching location");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching location:", error);
  //     setLocation("Error fetching location");
  //   }
  // };
  
  const fetchLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const address = data.address || {};
          console.log(address);
          setLocation(`${address.road}, ${address.city}, ${address.state}, ${address.postcode}`);
        } catch (error) {
          console.error("Error fetching address details:", error);
        }
      });
    }else{
      alert("Geolocation is not supported by this browser.");
    }
    
  };


  if (status === "loading") return null; // Don't show anything while loading
  if (!session) return null; // Don't render if no session exists

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
