"use client";

import { useState } from "react";
import EditFormatModal from "./EditFormatModal";

export default function EditFormat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-between mt-6 p-4">
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded transition-all duration-500 ease-in-out hover:bg-blue-800"
      >
        Edit Format
      </button>
      <span className="text-gray-700 font-medium">Save your details</span>

      {isOpen && <EditFormatModal closeModal={() => setIsOpen(false)} />}
    </div>
  );
}
