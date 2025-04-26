"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Trash2, FolderDown, LogOut, CircleHelp, Handshake, Trash, FolderDownIcon } from 'lucide-react';

export default function Setting() {
  const [userData, setUserData] = useState(null);
  const [notification, setNotification] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch('/api/users/me');
        if (res.ok) {
          const data = await res.json();
          setUserData(data);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    fetchUserData();
  }, []);

  const handleToggle = () => {
    setNotification(!notification);
    toast.success(`Notification sound ${!notification ? "enabled" : "disabled"}`);
  };

  const handleLogout = async () => {
    if (!userData) {
      toast.error("You are not logged in.");
      return;
    }

    try {
      const response = await fetch("/api/logout-device", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userData.id }), 
      });

      if (!response.ok) {
        throw new Error("Failed to log out from the server.");
      }

      toast.success("Logged out successfully!");
      router.push("/login"); 
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const settingsOptions = [
    { id: 1, text: "Delete my Account", icon: <Trash size={20} strokeWidth={1.5} /> },
    { id: 2, text: "My Plans", icon: <FolderDownIcon size={20} strokeWidth={1.5} /> },
    { id: 3, text: "Logout", icon: <LogOut size={20} strokeWidth={1.5} /> },
    { id: 4, text: "Help", icon: <CircleHelp size={20} strokeWidth={1.5} /> },
    { id: 5, text: "Invite a Friend", icon: <Handshake size={20} strokeWidth={1.5} /> },
  ];

  const SettingsOption = ({ text, icon }) => (
    <button
      onClick={text === "Logout" ? handleLogout : undefined}
      className="w-full text-left cursor-pointer text-gray-700 text-md font-medium hover:text-blue-600 hover:translate-x-2 transition duration-300 ease-in-out"
    >
      <span className="flex items-center gap-2">
        {icon}
        {text}
      </span>
    </button>
  );

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-xl">Loading...</p>
      </div>
    );
  }

  const imageSource = userData.profilePhoto || (userData.photos && userData.photos.length > 0 ? userData.photos[0] : "/profile-placeholder.png");

  return (
    <div className="flex flex-col gap-y-6 md:gap-y-8 min-h-screen bg-gradient-to-tr from-blue-50 to-teal-50 items-center justify-center p-4 relative">
      {/* Setting Heading */}
      <h1 className="flex flex-col items-center justify-start md:justify-center pl-4 md:pl-0 text-2xl md:text-3xl font-bold text-gray-800">Settings</h1>

      <div className="flex flex-col gap-y-4 bg-white rounded-2xl shadow-2xl p-8 h-[400px] md:h-[500px] justify-center max-w-md w-full">
        
        {/* Profile Section */}
        <div className="flex flex-row items-center text-center gap-8 ">
          <div className='relative w-30 h-30'>
            <Image
              src={imageSource}
              alt="Profile"
              fill sizes='120'
              className="w-30 h-30 rounded-full object-cover mb-4 shadow-md border-teal-500 border-2 border-dotted" priority
            />
          </div>
          <div className='flex flex-col items-center'>
            <h2 className="text-2xl font-bold text-gray-800">{userData.firstName} {userData.lastName}</h2>
            <p className="text-gray-500 text-sm">@{userData.username}</p>
          </div>
        </div>

        {/* Settings Options */}
        <div className="flex flex-col gap-y-6">

          {/* Notification Toggle */}
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold text-lg">Notification Sound</span>
            <label className="group relative inline-flex cursor-pointer flex-col items-center">
              <input
                className="peer sr-only"
                type="checkbox"
                checked={notification}
                onChange={handleToggle}
              />
              <div className="relative h-8 md:h-10 w-20 md:w-22 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] transition-all duration-500 after:absolute after:left-1 after:top-1 after:h-6 after:w-6 md:after:h-8 md:after:w-8 after:rounded-full after:bg-gradient-to-br after:from-gray-100 after:to-gray-300 after:shadow-[2px_2px_8px_rgba(0,0,0,0.3)] after:transition-all after:duration-500 peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-teal-600 peer-checked:after:translate-x-12 peer-checked:after:from-white peer-checked:after:to-gray-100 hover:after:scale-95 active:after:scale-90">
                <span className="absolute inset-1 rounded-full bg-gradient-to-tr from-white/20 via-transparent to-transparent"></span>
                <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 peer-checked:animate-glow peer-checked:opacity-100 [box-shadow:0_0_15px_rgba(167,139,250,0.5)]"></span>
              </div>
            </label>
          </div>

          {/* Dynamic settings buttons */}
          <div className="flex flex-col gap-y-2 text-sm md:text-[16px]">
            {settingsOptions.map(option => (
              <SettingsOption key={option.id} text={option.text} icon={option.icon} />
            ))}
          </div>

        </div>
      </div>

      <div className="absolute bottom-1 right-4 w-17 h-17 md:w-32 md:h-32">
        <Image src="/nearbuydukan - watermark.png"
          alt="Watermark"
          fill sizes="128"
          className="object-contain w-17 h-17 md:w-32 md:h-32"
          priority
        />
      </div>
    </div>
  );
}
