import { useState } from "react";
import { Flame, Store, BadgeCheck, ChevronDown, ChevronUp } from "lucide-react";

export default function CustomDropdown() {
  const [selectedOption, setSelectedOption] = useState("");
  const [isOpen, setIsOpen] = useState(false); // State to toggle dropdown visibility

  const handleSelectChange = (value) => {
    setSelectedOption(value);
    setIsOpen(false); // Close dropdown after selecting
  };

  return (
    <div className="relative">
      <button
        className="w-full border rounded px-2 py-1 text-left flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)} // Toggle dropdown open/close
      >
        <span>{selectedOption || "Select Promotion Type"}</span>
        <span>
          {isOpen ? (
            <ChevronUp color="#1b1d1d" size="20" /> // Show ChevronUp when open
          ) : (
            <ChevronDown color="#1b1d1d" size="20" /> // Show ChevronDown when closed
          )}
        </span>
      </button>

      {/* Add transition classes for smooth open/close */}
      <div
        className={`absolute bg-white shadow-lg w-full border rounded mt-1 ${
          isOpen ? "max-h-60 overflow-y-auto opacity-100" : "max-h-0 opacity-0"
        } transition-all duration-300 ease-in-out`} // Transitions for smooth effect
      >
        <div
          className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
          onClick={() => handleSelectChange("On Sale")}
        >
          <Flame color="#ffbb00" fill="#ffbb00" />
          <span>On Sale</span>
        </div>
        <div
          className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
          onClick={() => handleSelectChange("New Shop")}
        >
          <Store color="#0ea5e9" />
          <span>New Shop</span>
        </div>
        <div
          className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
          onClick={() => handleSelectChange("Popular Reach")}
        >
          <BadgeCheck color="#14b909" />
          <span>Reach</span>
        </div>
      </div>
    </div>
  );
}
