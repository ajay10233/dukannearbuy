"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MessageCircle, Mail, Phone, Store, Info, Hash, Clock, Clock9, IndianRupee, MapPin } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function About() {
    const { data: session } = useSession();
    console.log("session:", session);
    const [showQRModal, setShowQRModal] = useState(false);
  
    const router = useRouter();

    const handleChat = () => {
      const institutionId = session?.user?.id;
      if (institutionId) {
        router.push(`/chat?role=institution&to=${institutionId}`);
      } else {
        toast.error("Institution ID not found");
      }
    };
    
    return (
      <div className="flex flex-col items-start p-4 w-full bg-white">
        <div className="flex w-full px-8 py-4 justify-between items-start">
          <div className="flex flex-col pl-8 gap-1">
            <h1 className="text-3xl pb-6 font-bold text-blue-600">
              {session?.user?.firmName || "Medical Institute"}
            </h1>
            <p className="text-md text-gray-500">User ID: {session?.user?.id}</p>
            <p className="text-md text-gray-700 flex items-center gap-2">
              <Mail size={20} strokeWidth={1.5} color="#1751c4" />
              {/* <span className="font-medium">Email:</span>{" "} */}
              <span className="hover:text-gray-600 transition ease-in-out">{session?.user?.email || "N/A"}</span>
            </p>
            <p className="text-md text-gray-700 flex items-center gap-2">
              <Phone size={20} strokeWidth={1.5} color="#1751c4"/>
              {/* <span className="font-medium">Phone:</span>{" "} */}
              <span className="hover:text-gray-600 transition ease-in-out">{session?.user?.phone || "N/A"}</span>
            </p>
          </div>
  
          <div className="fixed bottom-30 right-[22%] z-50 flex flex-col items-center gap-2">
            <button
              onClick={handleChat}
              className="bg-blue-600 text-white p-3 cursor-pointer rounded-full hover:bg-blue-700 transition"
              title="Chat with firm">
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
  
        <div className="w-full px-8">
          <div className="flex flex-col gap-y-3 text-gray-700 border-t pl-8 pt-4">
            <div className="flex items-start gap-x-2">
              <span className="font-semibold flex items-center gap-x-1">
                <Store size={20} strokeWidth={1.5} color="#1751c4"/>
                Address:
              </span>
              {session?.user?.address && typeof session.user.address === "object" && (
                <div className="text-base text-gray-800 pb-1 hover:text-gray-600 transition ease-in-out">
                  {Object.values(session.user.address)
                    .filter((val) => val && val.trim() !== "")
                    .join(", ") || "Not provided"}
                </div>
              )}
            </div>
  
            {/* <div className="flex items-start gap-x-2">
              <span className="font-semibold flex items-center gap-x-1">
                <Info size={20} strokeWidth={1.5} color="#1751c4"/>
                Description:
              </span>
              <span className="hover:text-gray-600 transition ease-in-out">{session?.user?.description || "Not Provided"}</span>
            </div> */}
  
            <div className="flex items-start gap-x-2">
              <span className="font-semibold flex items-center gap-x-1">
                <Hash size={20} strokeWidth={1.5} color="#1751c4"/>
                Hashtags:
              </span>
              {session?.user?.hashtags?.length > 0 ? (
                session.user.hashtags.map((tag, i) => (
                  <span key={i} className="inline-block p-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-md">
                    #{tag.trim()} 
                  </span>
                ))
              ) : (
                <span className="inline-block px-3 py-1 text-sm bg-gradient-to-tl from-blue-300 via-blue-500 to-blue-600 text-white rounded-2xl">None</span>
              )}
            </div>
  
            <div className="flex items-start gap-x-2">
              <span className="font-semibold flex items-center gap-x-1">
                <Clock size={20} strokeWidth={1.5} color="#1751c4"/>
                Open Time:
              </span>
              <span className="hover:text-gray-600 transition ease-in-out">{session?.user?.openTime || "Not Set"}</span>
            </div>
  
            <div className="flex items-start gap-x-2">
              <span className="font-semibold flex items-center gap-x-1">
                <Clock9 size={20} strokeWidth={1.5} color="#1751c4"/>
                Close Time:
              </span>
             <span className="hover:text-gray-600 transition ease-in-out">{session?.user?.closeTime || "Not Set"}</span>
            </div>
  
            <div className="flex items-start gap-x-2">
              <span className="font-semibold flex items-center gap-x-1">
                <MapPin size={20} strokeWidth={1.5} color="#1751c4" />
                Direction:
              </span>
              {session?.user?.latitude && session?.user?.longitude ? (
                <Link
                  href={`https://www.google.com/maps?q=${session.user.latitude},${session.user.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 flex items-center gap-x-1 cursor-pointer hover:text-blue-500 transition ease-in-out"
                >
                  View on Map
                </Link>
              ) : (
                "Location not set"
              )}
            </div>
        </div>
  
          {session?.user?.paymentDetails?.upiId &&
            session?.user?.paymentDetails?.scannerImage && (
              <button
                title="Scan Qr code"
                onClick={() => setShowQRModal(true)}
                className="pt-4 px-4 py-2 bg-green-600 flex cursor-pointer items-center gap-x-2 text-white rounded hover:bg-green-700 transition"
              >
                <IndianRupee size={20} strokeWidth={1.5} />
                Pay Now
              </button>
            )}
            </div>

            {/* Description Section at the bottom with animation */}
          {session?.user?.description && (
            <div className="mt-8 px-4">
              <h2 className="text-2xl font-bold text-blue-700 mb-2">About</h2>
              <div className="relative group transition-all duration-500">
                <div className="bg-gradient-to-r from-blue-100 via-white to-blue-50 rounded-xl p-4 shadow-md transition-all duration-300 transform group-hover:scale-[1.02] group-hover:shadow-lg">
                  <p className="text-gray-700 text-base leading-relaxed tracking-wide">
                    {session?.user?.description}
                  </p>
                </div>
              </div>
            </div>
          )}
      </div>
    );
  }
  