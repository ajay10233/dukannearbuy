"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Toggles() {
  const [shortBill, setShortBill] = useState(false);
  const [tokenGeneration, setTokenGeneration] = useState(false);

  const handleShortBillToggle = () => {
    const newValue = !shortBill;
    setShortBill(newValue);
    toast.success(`Short Bill ${newValue ? "Enabled" : "Disabled"}`);
  };

  const handleTokenGenerationToggle = () => {
    const newValue = !tokenGeneration;
    setTokenGeneration(newValue);
    toast.success(`Token Generation ${newValue ? "Enabled" : "Disabled"}`);
  };

  return (
    <div className="flex flex-wrap gap-2 md:gap-4 p-2 md:p-4 justify-evenly">
      {/* Short Bill Toggle */}
      <div className="flex items-center justify-evenly gap-2 w-full sm:w-auto">
        <span className="text-md md:text-lg font-semibold text-gray-700 whitespace-nowrap">Short Bill Generation</span>
        <label className="relative cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={shortBill}
            onChange={handleShortBillToggle}
          />
          <div className="relative h-6.5 md:h-9 w-14 md:w-22 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] transition-all duration-500 after:absolute after:left-1 after:top-0.5 after:h-5 after:w-5 md:after:h-8 md:after:w-8 after:rounded-full after:bg-gradient-to-br after:from-gray-100 after:to-gray-300 after:shadow-[2px_2px_8px_rgba(0,0,0,0.3)] after:transition-all after:duration-500 peer-checked:bg-gradient-to-r peer-checked:from-teal-600 peer-checked:to-blue-600 peer-checked:after:translate-x-7 md:peer-checked:after:translate-x-12 peer-checked:after:from-white peer-checked:after:to-gray-100 hover:after:scale-95 active:after:scale-90">
            <span className="absolute inset-1 rounded-full bg-gradient-to-tr from-white/20 via-transparent to-transparent"></span>
            <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 peer-checked:animate-glow peer-checked:opacity-100 [box-shadow:0_0_15px_rgba(167,139,250,0.5)]"></span>
          </div>
        </label>
      </div>

      {/* Token Generation Toggle */}
      <div className="flex items-center justify-evenly gap-2 w-full sm:w-auto">
        <span className="text-md md:text-lg font-semibold text-gray-700 whitespace-nowrap">Token Generation</span>
        <label className="relative cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={tokenGeneration}
            onChange={handleTokenGenerationToggle}
          />
          <div className="relative h-6.5 md:h-9 w-14 md:w-22 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] transition-all duration-500 after:absolute after:left-1 after:top-0.5 after:h-5 after:w-5 md:after:h-8 md:after:w-8 after:rounded-full after:bg-gradient-to-br after:from-gray-100 after:to-gray-300 after:shadow-[2px_2px_8px_rgba(0,0,0,0.3)] after:transition-all after:duration-500 peer-checked:bg-gradient-to-r peer-checked:from-teal-600 peer-checked:to-blue-600 peer-checked:after:translate-x-7 md:peer-checked:after:translate-x-12 peer-checked:after:from-white peer-checked:after:to-gray-100 hover:after:scale-95 active:after:scale-90">
            <span className="absolute inset-1 rounded-full bg-gradient-to-tr from-white/20 via-transparent to-transparent"></span>
            <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 peer-checked:animate-glow peer-checked:opacity-100 [box-shadow:0_0_15px_rgba(167,139,250,0.5)]"></span>
          </div>
        </label>
      </div>
    </div>
  );
}
