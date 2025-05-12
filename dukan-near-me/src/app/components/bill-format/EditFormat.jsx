"use client";

import { useState } from "react";
import EditFormatModal from "./EditFormatModal";
import { FaEdit } from "react-icons/fa";

export default function EditFormat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-between mt-2 md:mt-6 p-2 md:p-4 border rounded-md border-gray-400 ">
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 text-sm md:text-[16px] bg-blue-600 cursor-pointer text-white rounded transition-all duration-500 ease-in-out hover:bg-blue-800 hover:font-medium"
      >
        <FaEdit size={20} strokeWidth={1.5} color="#fff" /> Edit Format
      </button>
      <span className="text-gray-700 font-semibold text-sm md:text-[16px]">Save your details</span>

      {isOpen && <EditFormatModal closeModal={() => setIsOpen(false)} />}
    </div>
  );
}
