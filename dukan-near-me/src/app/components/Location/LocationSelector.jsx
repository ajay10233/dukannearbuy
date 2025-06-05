"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./MapComponent"), { ssr: false });

export default function LocationSelector({ onSave, role }) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
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
    },
  });

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const res = await fetch("/api/users/location");
        const data = await res.json();
        if (res.ok) {
          Object.keys(data).forEach((key) => setValue(key, data[key]));
        }
      } catch (error) {
        console.error("Error fetching user location:", error);
      }
    };

    fetchUserLocation();
  }, [setValue]);

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setValue("lat", latitude);
        setValue("lng", longitude);

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const address = data.address || {};
          setValue("houseNumber", address.house_number || "");
          setValue("street", address.road || "");
          setValue("buildingName", "");
          setValue("landmark", "");
          setValue("city", address.city || address.town || address.village || "");
          setValue("state", address.state || "");
          setValue("country", address.country || "");
          setValue("zipCode", address.postcode || "");
        } catch (error) {
          console.error("Error fetching address details:", error);
        }
      }, (error) => {
        console.error("Error getting geolocation:", error);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

    const showForm = !(role === "INSTITUTION" || role === "SHOP_OWNER");


  const onSubmit = async (data) => {
    console.log("Submitting location data:", data);
    await fetch("/api/users/location", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    onSave();
  };

  return (
<div className={`w-full ${role === "INSTITUTION" || role === "SHOP_OWNER" ? "h-screen" : ""} flex flex-col items-center justify-center p-6 space-y-6 bg-gray-50`}>
      <Map 
        setLocation={(newLocation) => {
          setValue("lat", newLocation.lat);
          setValue("lng", newLocation.lng);
          setValue("houseNumber", newLocation.houseNumber || "");
          setValue("street", newLocation.street || "");
          setValue("buildingName", newLocation.buildingName || "");
          setValue("landmark", newLocation.landmark || "");
          setValue("city", newLocation.city || "");
          setValue("state", newLocation.state || "");
          setValue("country", newLocation.country || "");
          setValue("zipCode", newLocation.zipCode || "");
        }} 
        location={{ lat: getValues("lat"), lng: getValues("lng") }}
        role={role} 
      />

      {role === "USER" && (
        <button
          onClick={() => {
            fetchCurrentLocation();
          }}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all ease-in-out duration-400 cursor-pointer">
          Use Current Location
        </button>
      )}

      {/* Address Form */}

      {showForm && (

        <form onSubmit={handleSubmit(onSubmit)} className="w-[90%] grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow">
          <input {...register("houseNumber")} placeholder="House Number" className="border p-2 rounded-md" />
          <input {...register("street")} placeholder="Street" className="border p-2 rounded-md" />
          <input {...register("buildingName")} placeholder="Building Name" className="border p-2 rounded-md" />
          <input {...register("landmark")} placeholder="Landmark" className="border p-2 rounded-md" />
          <input {...register("city")} placeholder="City" className="border p-2 rounded-md" />
          <input {...register("state")} placeholder="State" className="border p-2 rounded-md" />
          <input {...register("country")} placeholder="Country" className="border p-2 rounded-md" />
          <input {...register("zipCode")} placeholder="Zip Code" className="border p-2 rounded-md" />
          
          <div className="col-span-1 md:col-span-2 flex justify-center">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 cursor-pointer rounded-md transition-all duration-300 ease-in-out hover:bg-blue-600 ">
              Save Location
            </button>
          </div>
        </form>

         )}
    </div>
  );
}



