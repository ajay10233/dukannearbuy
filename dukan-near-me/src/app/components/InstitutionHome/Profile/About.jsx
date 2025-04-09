"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { MessageCircle } from "lucide-react";

export default function About() {
  const { data: session } = useSession();
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-start p-4 w-full bg-white gap-4">
      
      <div className="flex w-full px-8 justify-between items-start">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-blue-600">
            {session?.user.firmName || "Firm Name"}
          </h1>
          <p className="text-sm text-gray-500">User ID: {session?.user.id}</p>
        </div>

        <button
          onClick={toggleDetails}
          className="bg-blue-600 text-white p-2  cursor-pointer rounded-full hover:bg-blue-700 transition"
          title="Chat with firm"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>

      {/* Expanded details below the firm info */}
      {showDetails && (
        <div className="flex flex-col w-full gap-4 border-t pt-4">
          <div className="text-sm text-gray-700">
            <strong>Contact Email:</strong>{" "}
            {session?.user.contactEmail || session?.user.email || "N/A"}
          </div>
          <div className="text-sm text-gray-700">
            <strong>Phone:</strong> {session?.user.phone || "N/A"}
          </div>
          <div className="text-sm text-gray-700">
            <strong>Address:</strong>{" "}
            {[
              session?.user.address?.houseNumber,
              session?.user.address?.street,
              session?.user.address?.buildingName,
              session?.user.address?.landmark,
              session?.user.address?.city,
            ]
              .filter(Boolean)
              .join(", ") || "N/A"}
          </div>

          <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm">
            Map Location
          </div>

          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-semibold transition">
             Pay Now
          </button>
        </div>
      )}
    </div>
  );
}
