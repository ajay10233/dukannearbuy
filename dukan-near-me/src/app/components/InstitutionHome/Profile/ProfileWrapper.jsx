"use client";

import React, { useState, useEffect } from "react";
import EditProfile from "./EditProfile";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { Share2, X, Heart, MoveLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import LogoLoader from "../../LogoLoader";

export default function ProfileWrapper({ children, images, setImages }) {
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();
  const [errors, setErrors] = useState({});
  const [shareUrl, setShareUrl] = useState("");
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [message, setMessage] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  const router = useRouter();
  const { data: session } = useSession();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    firmName: '',
    houseNumber: '',
    street: '',
    buildingName: '',
    landmark: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    shopAddress: '',
    contactEmail: '',
    description: '',
    upi_id: "",
    latitude: null,
    longitude: null,
    scanner_image: "",
    shopOpenTime: '',
    shopCloseTime: '',
    shopOpenDays: '',
    hashtags: '',
    mobileNumber: '',
    // contactEmail: '' duplicate
    username: ''
  });
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/me");
      const data = await res.json();
      if (res.ok) {
        setUser(data);
      } else {
        toast.error("Failed to fetch user data.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data.");
    } finally {
      setLoading(false); 
    }
  };
  
  useEffect(() => {
    fetchUserData();
    const fullUrl = `${window.location.origin}${pathname}`;
    setShareUrl(fullUrl);
  }, [pathname]);

  
  // const handleEditClick = () => {
    
  //     router.push("/institution-edit-profile");

  //   setShowModal(true);
  // };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
  
    const formData = new FormData();
    for (const key in form) {
      if (form[key] !== undefined && form[key] !== null) {
        if (key === 'hashtags' && typeof form[key] === 'string') {
          formData.append(key, JSON.stringify(form[key].split(',').map(tag => tag.trim()).filter(Boolean)));
        } else if (key === 'shopOpenDays' && typeof form[key] === 'string') {
          formData.append(key, JSON.stringify(form[key].split(',').map(day => day.trim()).filter(Boolean)));
        } else if (Array.isArray(form[key])) {
          formData.append(key, JSON.stringify(form[key]));
        } else {
          formData.append(key, form[key]);
        }
      }
    }
    try {
      const res = await fetch('/api/institutions/edit-details', {
        method: 'POST',
        body: formData,
      });
  
      const data = await res.json();
      console.log("data:", data);
  
      if (res.ok) {
        setMessage('✅ Profile updated successfully');
        toast.success("Profile updated successfully");
        setShowModal(false);
        setProfileUpdated(true);
      } else {
        setMessage(`❌ Error: ${data.error}`);
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong.");
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

  const institutionId = pathname.split("/").pop();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch("/api/favorites");
        const data = await res.json();
        if (res.ok) {
          const alreadyFav = data.favorites.some(
            (fav) => fav.institutionId === institutionId
          );
          setIsFavorite(alreadyFav);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };
  
    if (session?.user) {
      fetchFavorites();
    }
  }, [session, institutionId]);

  const handleFavoriteToggle = async () => {
    if (!session?.user || session.user.role !== "USER") {
      toast.error("Only users can favorite profiles.");
      return;
    }

    const currentInstitutionId = pathname.split("/").pop();

    try {
      const res = await fetch("/api/favorites", {
        method: isFavorite ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ institutionId: currentInstitutionId }),
      });

      if (res.ok) {
        setIsFavorite(!isFavorite);
        toast.success(isFavorite ? "Removed from favorites." : "Added to your favorites!");
      } else {
        const errorData = await res.json();
        toast.error(errorData?.message || "Failed to update favorite status");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <>
      {loading ? (
        <LogoLoader content="Fetching profile..." />
      ) : (
        <>
          <div className="w-full px-4 pb-2 md:px-8 pt-14 flex justify-between items-center py-2 flex-end">
            {/* <button
              onClick={handleEditClick}
              className="flex items-center cursor-pointer text-blue-600 hover:text-blue-700 transition"
            >
              <FaEdit size={20} strokeWidth={1.5} />
            </button> */}
            <div className="py-2">
              {/* <Link href="/UserHomePage"
              className="flex items-center gap-2 text-blue-600 rounded-md transition ease-in-out duration-400 hover:text-blue-700">
                <MoveLeft size={20} strokeWidth={1.5} /> Back
            </Link> */}
            {user?.role && (
              <Link
                href={
                  user.role === "USER"
                    ? "/UserHomePage"
                    : user.role === "SHOP_OWNER" || user.role === "INSTITUTION"
                    ? "/partnerHome"
                    : "/login"
                }
                className="flex items-center gap-2 text-blue-600 rounded-md transition ease-in-out duration-400 hover:text-blue-700"
              >
                <MoveLeft size={20} strokeWidth={1.5} /> Back
              </Link>
            )}

          </div>

          <div className="flex items-end gap-x-8">
                {user?.role === "USER" && (
                  <button
                    onClick={handleFavoriteToggle}
                    className="transition cursor-pointer"
                    title={isFavorite ? "Unfavorite" : "Add to favorites"}
                  >
                    <Heart
                      size={20}
                      strokeWidth={1.5}
                      className={`transition-all duration-300 ${isFavorite ? "fill-red-500 text-red-500" : "stroke-red-500"
                        }`}
                    />
                  </button>
                )}

            <button
              onClick={handleShare}
              className="cursor-pointer text-gray-800 hover:text-gray-500 transition"
            >
              <Share2 size={20} strokeWidth={1.5} />
            </button>

            {/* <X
              size={20}
              strokeWidth={1.5}
              className="cursor-pointer text-gray-800 hover:text-gray-500 transition"
              title="Delete Image"
              onClick={() => handleDeleteImageWrapper(0)}
            /> */}
          </div>
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
      )}
    </>
  );
}
