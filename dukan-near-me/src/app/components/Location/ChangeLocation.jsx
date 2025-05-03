"use client";
import LocationSelector from "@/app/components/Location/LocationSelector";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChangeLocationPage() {
  const router = useRouter();
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch("/api/users/me");
        const data = await res.json();
        setRole(data.role); // e.g., USER, SHOP_OWNER, INSTITUTION
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  const handleLocationSave = () => {
    if (role === "USER") {
      router.push("/UserHomePage");
    } else if (role === "SHOP_OWNER" || role === "INSTITUTION") {
      router.push("/partnerHome");
    } else {
      console.warn("Unknown role, redirecting to home");
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <h1 className="text-xl font-semibold mt-4">Select Your Location</h1>
      <LocationSelector onSave={handleLocationSave} />          
    </div>
  );
}
