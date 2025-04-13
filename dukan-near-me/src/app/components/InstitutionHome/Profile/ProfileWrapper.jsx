"use client";

import React, { useState, useEffect } from "react";
import EditProfile from "./EditProfile";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { Share2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ProfileWrapper({ children, images, setImages  }) {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();
  const [errors, setErrors] = useState({});
  const [shareUrl, setShareUrl] = useState("");
  const [profileUpdated, setProfileUpdated] = useState(false);
    const [message, setMessage] = useState('');
  

  // const [formData, setFormData] = useState({
  //   firmName: "",
  //   address: "",
  //   description: "",
  //   hashtags: "",
  //   openTime: "",
  //   closeTime: "",
  //   upiId: "",
  //   scannerImage: null,
  //   latitude: "",
  //   longitude: "",
  // });

      const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        firmName: '',
        shopAddress: '',
        contactEmail: '',
        description: '',
        upi_id: '',
        paymentDetails: '',
        shopOpenTime: '',
        shopCloseTime: '',
        shopOpenDays: '',
        shopOpenDays: '',
        hashtags: ''
      });
  
  useEffect(() => {
    const fullUrl = `${window.location.origin}${pathname}`;
    console.log(fullUrl);
    setShareUrl(fullUrl);
  }, [pathname]);

  const handleEditClick = () => {
    // const user = session?.user || {};
    // const payment = user.paymentDetails || {};
    // const address = user.shopAddress || "";

    setShowModal(true);
  };

  // const handleChange = (e) => {
  //   const { name, value, type, files } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: type === "file" ? files[0] : value,
  //   }));
  // };

  // const handleSave = () => {
  //   const updatedData = {
  //     ...formData,
  //     hashtags: formData.hashtags
  //       ? formData.hashtags
  //           .split(",")
  //           .map((tag) => tag.trim())
  //           .filter((tag) => tag !== "")
  //       : [],
  //   };

  //   console.log("Updated data:", updatedData);
  //   toast.success("Profile updated!");
  //   setShowModal(false);
  // };

    const handleChange = (e) => {
      // setForm({ ...form, [e.target.name]: e.target.value });
      
        const { name, value, type, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
    
        const res = await fetch('/api/institutions/edit-details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...form,
            hashtags: form.hashtags?.split(',').map(tag => tag.trim()).filter(Boolean),
            shopOpenDays: form.shopOpenDays?.split(',').map(day => day.trim()).filter(Boolean)

          }),
        });
    
        const data = await res.json();
        if (res.ok) {
            setMessage('✅ Profile updated successfully');
            toast.success("Profile updated successfully");
            
            setShowModal(false);
            setProfileUpdated(true); 
            toast.success("Profile updated successfully!");
        } else {
            setMessage(`❌ Error: ${data.error}`);
            toast.error("Failed to update profile.");
        }
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
        <div className="w-full px-4 pb-2 md:px-8 pt-14 pb-3 flex justify-between items-center">
        <button
          onClick={handleEditClick}
          className="flex items-center cursor-pointer text-blue-600 hover:text-blue-700 transition">
          <FaEdit size={20} strokeWidth={1.5}/>
          {/* Edit Profile */}
        </button>

        <button
          onClick={handleShare}
          className="cursor-pointer text-gray-800 rounded hover:text-gray-500 transition">
          <Share2 size={20} strokeWidth={1.5} />
        </button>
      </div>

      {children}

      {showModal && (
          <EditProfile
                images={images}
                setImages={setImages} 
                form={form}
                setForm={setForm}
                errors={errors}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                setShowModal={setShowModal}
                setProfileUpdated={setProfileUpdated}     
        />
      )}
    </>
  );
}
