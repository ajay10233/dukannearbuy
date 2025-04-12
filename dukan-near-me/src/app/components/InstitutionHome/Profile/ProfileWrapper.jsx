"use client";

import React, { useState, useEffect } from "react";
import EditProfile from "./EditProfile";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { Share2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ProfileWrapper({ children }) {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();
  const [errors, setErrors] = useState({});
  const [shareUrl, setShareUrl] = useState("");

  const [formData, setFormData] = useState({
    firmName: "",
    address: "",
    description: "",
    hashtags: "",
    openTime: "",
    closeTime: "",
    upiId: "",
    scannerImage: null,
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    const fullUrl = `${window.location.origin}${pathname}`;
    setShareUrl(fullUrl);
  }, [pathname]);

  const handleEditClick = () => {
    const user = session?.user || {};
    const payment = user.paymentDetails || {};
    const address = user.address || "";

    setFormData({
      firmName: user.firmName || "",
      address: typeof address === "object"
        ? Object.values(address).filter(Boolean).join(", ")
        : address || "",
      description: user.description || "",
      hashtags: Array.isArray(user.hashtags)
        ? user.hashtags.join(", ")
        : "",
      openTime: user.shopOpenTime || "",
      closeTime: user.shopCloseTime || "",
      upiId: payment.upiId || "",
      scannerImage: payment.scannerImage || null,
      latitude: user.latitude || "",
      longitude: user.longitude || "",
    });

    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSave = () => {
    const updatedData = {
      ...formData,
      hashtags: formData.hashtags
        ? formData.hashtags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== "")
        : [],
    };

    console.log("Updated data:", updatedData);
    toast.success("Profile updated!");
    setShowModal(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this profile!",
          url: shareUrl,
        })
        .then(() => console.log("Profile shared"))
        .catch((err) => console.error("Error sharing:", err));
    } else {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => toast.success("Profile link copied!"))
        .catch((err) => toast.error("Failed to copy link"));
    }
  };

  return (
    <>
      <div className="w-full px-8 pt-14 pb-2 flex justify-between items-center">
        <button
          onClick={handleEditClick}
          className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <FaEdit />
          Edit Profile
        </button>

        <button
          onClick={handleShare}
          className="px-4 py-2 cursor-pointer text-gray-800 rounded hover:text-gray-500 transition"
        >
          <Share2 size={20} strokeWidth={1.5} />
        </button>
      </div>

      {children}

      {showModal && (
        <EditProfile
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          handleChange={handleChange}
          handleSave={handleSave}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
}
