"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { MessageCircleMore, Mail, Plus, Phone, Store, Hash, Clock, Clock9, IndianRupee, MapPin, X, Copy, Check } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function About({ profileUpdated }) {
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

    const [copiedUPI, setCopiedUPI] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState(false);

    const handleCopyUpi = () => {
        const upi = session?.user?.upi_id;
        if (upi) {
            navigator.clipboard.writeText(upi);
            setCopiedUPI(true);
            toast.success("Copy UPI Id");
            setTimeout(() => setCopiedUPI(false), 2000);
        }
    }

    const handleCopyEmail = () => {
        const email = session?.user?.email;
        // const email = session?.user?.contactEmail;
        if (email) {
            navigator.clipboard.writeText(email);
            setCopiedEmail(true);
            toast.success("Email copied!");
            setTimeout(() => setCopiedEmail(false), 2000);
        }
    };
    
    const shortDay = {
        Monday: "Mon",
        Tuesday: "Tue",
        Wednesday: "Wed",
        Thursday: "Thu",
        Friday: "Fri",
        Saturday: "Sat",
        Sunday: "Sun",
      };
      
      const formatDayRange = (selected = []) => {
        const fullDays = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];
        const indexes = selected
          .map((day) => fullDays.indexOf(day))
          .sort((a, b) => a - b);
      
        const isSequential = indexes.every(
          (val, i, arr) => i === 0 || val === arr[i - 1] + 1
        );
      
        if (selected.length === 7) return "Mon - Sun";
        if (isSequential) {
          const first = shortDay[selected[0]];
          const last = shortDay[selected[selected.length - 1]];
          return `${first} - ${last}`;
        }
      
        return selected.map((d) => shortDay[d]).join(", ");
      };
      
        return (
            <div className="flex flex-col items-start p-4 w-full bg-white">
                <div className="flex w-full p-0 pb-6 md:px-8 md:py-2 justify-between items-start"> {/* py-4 */}
                    <div className="flex flex-col gap-1">
                        {/* 
                            <h1 className="text-3xl pb-6 font-bold text-blue-600 flex items-center gap-2">
                                {session?.user?.role === "INSTITUTION" ? (                            
                                    <>
                                        <Plus size={30} strokeWidth={2.5} color="#1751c4" />
                                        {session?.user?.firmName || "Medical Institute"}
                                    </>
                                ) : session?.user?.role === "SHOP_OWNER" ? (
                                    <>
                                        <Store size={30} strokeWidth={2.5} color="#1751c4" />
                                        {session?.user?.firmName || "Shop Owner"}
                                    </>
                                ) : null}
                            </h1> 
                        */}
                        <div className="pl-2 md:pl-8 flex flex-col gap-y-1">
                            <p className="text-md text-gray-500">User ID: {session?.user?.id}</p>
                            <p className="text-md text-gray-700 flex items-center gap-2">
                                <Mail size={20} strokeWidth={1.5} color="#1751c4" />
                                {/* <span className="font-medium">Email:</span>{" "} */}
                                <span className="hover:text-gray-600 flex gap-x-1.5 transition ease-in-out">{session?.user?.email || "N/A"} 
                                <button onClick={handleCopyEmail} title="Copy Email">
                                    {copiedEmail ? (
                                        <Check className="text-green-600 cursor-pointer" size={14} />
                                    ) : (
                                        <Copy size={14} className="text-gray-500 cursor-pointer hover:text-blue-600" />
                                    )}
                                </button>
                                </span>
                            </p>
                            <p className="text-md text-gray-700 flex items-center gap-2">
                                <Phone size={20} strokeWidth={1.5} color="#1751c4" />
                                {session?.user?.phone ? (
                                    <a
                                        href={`tel:${session.user.phone}`}
                                        className="hover:text-gray-600 transition ease-in-out hover:not-first:underline">
                                        {session.user.phone}
                                    </a>
                                ) : (
                                    <span>N/A</span>
                                )}
                            </p>
                            {profileUpdated && (
                                <>
                                    <div className="flex items-start gap-x-2">
                                        <span className="font-semibold flex items-center gap-x-1">
                                            <Phone size={20} strokeWidth={1.5} color="#1751c4" />
                                            {/* Phone: */}
                                        </span>
                                        {session?.user?.mobileNumber ? (
                                            <a
                                                href={`tel:${session.user.mobileNumber}`}
                                                className="hover:text-gray-600 transition ease-in-out hover:not-first:underline">
                                                {session.user.mobileNumber}
                                            </a>
                                        ) : (
                                            <span>N/A</span>
                                        )}
                                    </div>
                                    <div className="text-md text-gray-700 flex items-center gap-2">
                                        <Mail size={20} strokeWidth={1.5} color="#1751c4" />
                                        {/* <span className="font-medium">Email:</span>{" "} */}
                                        <span className="hover:text-gray-600 flex gap-x-1.5 transition ease-in-out">{session?.user?.contactEmail || "N/A"} 
                                            <button onClick={handleCopyEmail} title="Copy Email">
                                                {copiedEmail ? (
                                                    <Check className="text-green-600 cursor-pointer" size={14} />
                                                    ) : (
                                                    <Copy size={14} className="text-gray-500 cursor-pointer hover:text-blue-600" />
                                                )}
                                            </button>
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* <div className="flex items-center gap-2">
                            <Phone size={20} strokeWidth={1.5} color="#1751c4" />
                            <span className="hover:text-gray-600 transition ease-in-out">
                                {session?.user?.phone || "N/A"}
                            </span>
                        </div>

                        <div className="flex items-center gap-1 text-yellow-500">
                            <Star size={16} fill="#fbbf24" color="#fbbf24" />
                            <span className="text-gray-800 font-medium">{avgRating}</span>
                            <span className="text-sm text-gray-500">({avgRating > 0 ? "based on reviews" : "No ratings yet"})</span>
                        </div> */}
                    </div>
  
                    <div className="fixed bottom-30 right-4 z-50 flex flex-col items-center gap-2">
                        <button
                            onClick={handleChat}
                            className="bg-blue-600 text-white p-2 cursor-pointer rounded-full hover:bg-blue-700 transition transform hover:scale-110 animate-bounce"
                            title="Chat with firm">
                            <MessageCircleMore size={28} strokeWidth={1.5}/>
                        </button>
                    </div>
                </div>
  
                {profileUpdated && (
                    <div className="w-full px-0 md:px-8 flex flex-col gap-y-8">
                        <div className="flex flex-col gap-y-2 md:gap-y-3 text-sm md:text-md text-gray-700 border-t pl-2 md:pl-8 pt-4">
                            <div className="flex items-start gap-x-2">
                                <span className="font-semibold flex items-center gap-x-1">
                                    <Store size={20} strokeWidth={1.5} color="#1751c4" />
                                    Address:
                                </span>
                                {session?.user?.shopAddress && typeof session.user.shopAddress === "object" && (
                                    <div className="text-base text-gray-800 pb-1 hover:text-gray-600 transition ease-in-out">
                                        {Object.values(session.user.shopAddress)
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
                                    <Hash size={20} strokeWidth={1.5} color="#1751c4" />
                                    Hashtags:
                                </span>
                                {session?.user?.hashtags?.length > 0 ? (
                                    session.user.hashtags.map((tag, i) => (
                                        <span key={i} className="inline-block px-1.5 md:px-3 py-1 text-sm bg-gradient-to-tl from-blue-300 via-blue-500 to-blue-600 text-white rounded-2xl">
                                            #{tag.trim()}
                                        </span>
                                    ))
                                ) : (
                                    <span className="inline-block px-3 py-1 text-sm bg-gradient-to-tl from-blue-300 via-blue-500 to-blue-600 text-white rounded-2xl">None</span>
                                )}
                            </div>
    
                            <div className="flex items-start gap-x-2">
                                <span className="font-semibold flex items-center gap-x-1">
                                    <Clock size={20} strokeWidth={1.5} color="#1751c4" />
                                    Open Time:
                                </span>
                                <span className="hover:text-gray-600 transition ease-in-out">{session?.user?.shopOpenTime || "Not Set"}</span>
                            </div>
    
                            <div className="flex items-start gap-x-2">
                                <span className="font-semibold flex items-center gap-x-1">
                                    <Clock9 size={20} strokeWidth={1.5} color="#1751c4" />
                                    Close Time:
                                </span>
                                <span className="hover:text-gray-600 transition ease-in-out">{session?.user?.shopCloseTime || "Not Set"}</span>
                            </div>

                            {/* Open Days */}
                            <div className="flex items-start gap-x-2">
                                <span className="font-semibold flex items-center gap-x-1">
                                    <Clock size={20} strokeWidth={1.5} color="#1751c4" />
                                    Open Days:
                                </span>
                                <span className="hover:text-gray-600 transition ease-in-out">
                                    {session?.user?.shopOpenDays?.length
                                    ? formatDayRange(session.user.shopOpenDays)
                                    : "Not Set"}
                                </span>
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
    
                        {session?.user?.upi_id &&
                            // session?.user?.paymentDetails && (
                                <button
                                    title="Scan Qr code"
                                    onClick={() => setShowQRModal(true)}
                                    className="pt-4 px-4 py-2 bg-green-600 flex cursor-pointer items-center gap-x-2 text-white rounded hover:bg-green-700 transition">
                                    <IndianRupee size={20} strokeWidth={1.5} />
                                    Pay Now
                                </button>
                            // )
                            }
                    
                        {session?.user?.description && (
                            <div className="p-4 md:p-8">
                                <h2 className="text-2xl font-bold text-blue-700 mb-2">About</h2>
                                <div className="relative group transition-all duration-500">
                                    <div className="bg-gradient-to-r from-blue-100 via-white to-blue-50 border-gray-300 w-full h-40 rounded-xl p-4 shadow-md transition-all duration-300 transform">
                                        <p className="text-gray-700 text-base leading-relaxed tracking-wide">
                                            {session?.user?.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {showQRModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                                <div className="bg-white p-6 rounded-lg shadow-lg w-auto max-w-sm relative">
                                    <button
                                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                        onClick={() => setShowQRModal(false)}
                                    >
                                        <X size={20} strokeWidth={1.5} />
                                    </button>
                                    <h2 className="text-xl font-semibold text-center text-blue-700 mb-4">
                                        Scan QR Code
                                    </h2>
                                    <div className="p-4">
                                        <img
                                            src={session?.user?.scanner_image}
                                            alt="QR Code"
                                            className="w-48 h-48 mx-auto object-contain"
                                        />
                                    </div>
                                    <p className="pt-4 flex items-center justify-center gap-2 *:text-center text-gray-600">
                                        <span className="text-gray-800 text-sm font-medium">
                                            UPI ID: {" "}
                                            <span className="font-normal">{session?.user?.upi_id}</span>
                                        </span>
                                        <button onClick={handleCopyUpi} title="Copy UPI ID">
                                            {copiedUPI ? <Check className="text-green-600" size={18} /> : <Copy size={18} />}
                                        </button>
                                    </p>
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </div>
        );
    }
