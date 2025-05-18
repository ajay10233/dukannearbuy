"use client"

import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";

export default function KilometerDropdown({ selectedKm, onKmChange }) {
    const [isOpen, setIsOpen] = useState(false);
  
  const options = [
      { label: "5 km", value: 5 },
      { label: "20 km", value: 20 },
      { label: "50 km", value: 50 },
      { label: "100 km", value: 100 },
    ];
  
    const handleSelect = (option) => {
      onKmChange(option.value); // Set as number here
      setIsOpen(false);
    };
  
    return (
      <div className="w-full">
        <div className="relative" id="km-dropdown">
          <button
            className="w-full border rounded px-3 py-2 text-left flex justify-between items-center cursor-pointer shadow-sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="flex items-center gap-2">
              <MapPin size={18} strokeWidth={2} />
              {selectedKm ? `${selectedKm} km` : "Select Kilometer Range"}
            </span>
            {isOpen ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>
  
          <div
            className={`absolute bg-white shadow-lg w-full border rounded mt-1 z-10 transition-all duration-300 ease-in-out overflow-hidden ${
              isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option)}
                className="px-3 py-2 cursor-pointer hover:bg-gray-200"
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  