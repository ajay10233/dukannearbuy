"use client";
import LocationSelector from "@/app/components/Location/LocationSelector";
import { useRouter } from "next/navigation";

export default function ChangeLocationPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center">
      <h1 className="text-xl font-semibold mt-4">Select Your Location</h1>
      <LocationSelector onSave={() => router.push("/partnerHome")} />
    </div>
  );
}
