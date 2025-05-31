"use client";
import LocationSelector from "@/app/components/Location/LocationSelector";
import { MoveLeft } from "lucide-react";
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
        setRole(data.role); 
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

   const handleLocationSave = () => {
    redirectBasedOnRole();
  };

  const redirectBasedOnRole = () => {
    if (role === "USER") {
      router.push("/UserHomePage");
    } else if (role === "SHOP_OWNER" || role === "INSTITUTION") {
      router.push("/partnerHome");
    } else {
      console.warn("Unknown role, redirecting to home");
      router.push("/");
    }
  };

    const heading =
    role === "SHOP_OWNER" || role === "INSTITUTION"
      ? "Your Live Location"
      : "Select Your Location";


  return (
    <div className="h-screen relative flex flex-col items-center gap-4">
      <div className="flex items-center mt-4 gap-2">
        <button
          onClick={redirectBasedOnRole}
          className="absolute top-4 left-4 text-xl text-blue-600 cursor-pointer transition-all ease-in-out duration-400 hover:text-blue-600"
        >
         <MoveLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">{heading}</h1>
      </div>

      <LocationSelector onSave={handleLocationSave} role={role}  />
    </div>
  );
}