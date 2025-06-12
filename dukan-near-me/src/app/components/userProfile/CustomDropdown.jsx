import { useState } from "react";
import { Flame, Store, BadgeCheck, ChevronDown, ChevronUp, Gift, Package, HandCoins } from "lucide-react";

export default function CustomDropdown({ promotionType, setPromotionType }) {
  // const [selectedOption, setSelectedOption] = useState("");
  const [isOpen, setIsOpen] = useState(false); // State to toggle dropdown visibility

  const handleSelectChange = (value) => {
    // setSelectedOption(value);
        setPromotionType(value);

    setIsOpen(false); // Close dropdown after selecting
  };

  return (
    <div className="relative">
      <button
        className="w-full border rounded px-3 py-2 text-left flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)} // Toggle dropdown open/close
      >
        <span>{promotionType || "Select Promotion Type"}</span>
        <span>
          {isOpen ? (
            <ChevronUp color="#1b1d1d" size="20" /> // Show ChevronUp when open
          ) : (
            <ChevronDown color="#1b1d1d" size="20" /> // Show ChevronDown when closed
          )}
        </span>
      </button>

      {/* Conditionally render the dropdown */}
      {isOpen && (
        <div
          className="z-50 absolute bg-white shadow-lg w-full border rounded mt-1 max-h-60 overflow-y-auto opacity-100 transition-all duration-300 ease-in-out"
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
            <span>Popular Reach</span>
          </div>
          <div
            className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
            onClick={() => handleSelectChange("New Product")}
          >
            <Package color="#6366f1" />
            <span>New Product</span>
          </div>
          <div
            className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
            onClick={() => handleSelectChange("New Services")}
          >
            <HandCoins size={20} strokeWidth={1.5} color="#f97316" />
            <span>New Services</span>
          </div>
          <div
            className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
            onClick={() => handleSelectChange("Festive Offers")}
          >
            <Gift color="#ec4899" />
            <span>Festive Offers</span>
          </div>
        </div>
      )}
    </div>
  );
}


