"use client";

import { useState } from "react";

export default function Toggles() {
  const [shortBill, setShortBill] = useState(false);
  const [tokenGeneration, setTokenGeneration] = useState(false);

  return (
    <div className="flex items-center gap-8 p-4 justify-center ">
      {/* Short Bill Toggle */}
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-700">Short Bill</span>
        <label className="relative cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={shortBill}
            onChange={() => setShortBill(!shortBill)}
          />
          <div className="relative h-8 md:h-10 w-20 md:w-22 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] transition-all duration-500 after:absolute after:left-1 after:top-1 after:h-6 after:w-6 md:after:h-8 md:after:w-8 after:rounded-full after:bg-gradient-to-br after:from-gray-100 after:to-gray-300 after:shadow-[2px_2px_8px_rgba(0,0,0,0.3)] after:transition-all after:duration-500 peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-teal-600 peer-checked:after:translate-x-12 peer-checked:after:from-white peer-checked:after:to-gray-100 hover:after:scale-95 active:after:scale-90">
            <span className="absolute inset-1 rounded-full bg-gradient-to-tr from-white/20 via-transparent to-transparent"></span>
            <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 peer-checked:animate-glow peer-checked:opacity-100 [box-shadow:0_0_15px_rgba(167,139,250,0.5)]"></span>
          </div>
        </label>
      </div>

      {/* Token Generation Toggle */}
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-700">Token Generation</span>
        <label className="relative cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={tokenGeneration}
            onChange={() => setTokenGeneration(!tokenGeneration)}
          />
          <div className="relative h-8 md:h-10 w-20 md:w-22 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] transition-all duration-500 after:absolute after:left-1 after:top-1 after:h-6 after:w-6 md:after:h-8 md:after:w-8 after:rounded-full after:bg-gradient-to-br after:from-gray-100 after:to-gray-300 after:shadow-[2px_2px_8px_rgba(0,0,0,0.3)] after:transition-all after:duration-500 peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-teal-600 peer-checked:after:translate-x-12 peer-checked:after:from-white peer-checked:after:to-gray-100 hover:after:scale-95 active:after:scale-90">
            <span className="absolute inset-1 rounded-full bg-gradient-to-tr from-white/20 via-transparent to-transparent"></span>
            <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 peer-checked:animate-glow peer-checked:opacity-100 [box-shadow:0_0_15px_rgba(167,139,250,0.5)]"></span>
          </div>
        </label>
      </div>
    </div>
  );
}
