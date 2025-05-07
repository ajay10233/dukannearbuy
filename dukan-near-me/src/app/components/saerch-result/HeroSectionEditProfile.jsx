"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import useEmblaCarousel from "embla-carousel-react";
import { Plus, RefreshCcwDot, Store, Crown, X } from "lucide-react";


export default function HeroSectionEditProfile() {
  const [user, setUser] = useState(null);  // Store user data
  const [images, setImages] = useState([]);
  const [imageCount, setImageCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const autoplay = useCallback(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  useEffect(() => {
    const stop = autoplay();
    return stop;
  }, [autoplay]);

  useEffect(() => {
    if (!emblaApi) return;
  
    const updateIndex = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
  
    emblaApi.on('select', updateIndex);
    updateIndex(); // initialize
  }, [emblaApi]);
  

  // Fetch logged-in user details from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/users/me`);
        if (!res.ok) {
          throw new Error("Failed to fetch user data.");
        }
        const data = await res.json();
        setUser(data);

        // Set the fetched photos to the images state
        if (data.photos && data.photos.length) {
          setImages(data.photos); // Use photos from the API
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Error fetching user data");
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const remainingSlots = 10 - imageCount;
    const filesToUpload = files.slice(0, remainingSlots);

    setIsUploading(true);

    for (const file of filesToUpload) {
      if (file.size > 20 * 1024 * 1024) { // 20MB limit
        toast.error(`File ${file.name} is too large (max 20MB).`);
        continue;
      }

      const base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => reject("Failed to read file.");
        reader.readAsDataURL(file);
      });

      // Upload image to the backend
      try {
        const res = await fetch("/api/institutions/upload-photo/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Ensure the token is in the header
          },
          body: JSON.stringify({ images: [base64String] }),
        });

        if (!res.ok) {
          throw new Error("Failed to upload image.");
        }

        const data = await res.json();
        setImages((prev) => [...prev, ...data.urls]); // Add the image URL to the images state
        setImageCount((prev) => prev + 1);
        toast.success(`Uploaded ${file.name}`);
      } catch (error) {
        toast.error("Error uploading image: " + error.message);
      }
    }

    setIsUploading(false);
  };

  const handleDeleteImage = async () => {
    if (!activeImage) return;
  
    try {
      const res = await fetch("/api/institutions/delete-photo", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ imageUrl: activeImage }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete image.");
      }
  
      setImages((prev) => prev.filter((img) => img !== activeImage));
      toast.success("Image deleted successfully!");
      setIsModalOpen(false);
      setActiveImage(null);
    } catch (err) {
      toast.error(err.message);
    }
  };  

  const handleSetPrimary = (index) => {
    const rotated = [...images.slice(index), ...images.slice(0, index)];
    setImages(rotated);
    toast.success("Primary image updated!");
  };

  if (!user) {
    return (
      <div className="text-center">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${user.role === "INSTITUTION" ? "bg-gradient-to-tr from-white to-sky-100" : user.role === "SHOP_OWNER" ? "bg-gradient-to-tl from-lime-100 to-white" : ""}`}>
      <div className="w-full h-60 md:h-90 relative overflow-hidden shadow-inner">
        {images.length > 0 && (
          <button
            className="absolute top-2 right-2 z-20 bg-white/80 cursor-pointer text-black rounded-full p-0.5 shadow-md"
            title="Delete current image"
            onClick={(e) => {
              e.stopPropagation();
              setActiveImage(images[selectedIndex]);
              setIsDeleteModalOpen(true); 
            }}
          >
            <X size={24} />
          </button>
        )}
        {(images.length > 0 || user.profilePhoto) ? (
          <div className="h-full" ref={emblaRef}>
            <div className="flex h-full cursor-pointer">
              {(images.length > 0 && images.map((img, index) => (
                <div className="flex-[0_0_100%] relative h-full group" key={index} onClick={() => { setActiveImage(img); setIsModalOpen(true); }}>
                  <Image
                    src={img}
                    alt={`Uploaded ${index + 1}`}
                    fill
                    className="object-contain md:object-cover"
                    priority
                  />

                  {index === 0 && (
                    <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow">
                      Primary
                    </span>
                  )}

                  {(user.role === "INSTITUTION" || user.role === "SHOP_OWNER") && images.includes(img) && index !== 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleSetPrimary(index);
                      }}
                      className="absolute bottom-2 left-2 cursor-pointer bg-white/80 hover:bg-white rounded-full p-1 shadow group-hover:opacity-100 opacity-0 transition"
                      title="Set as Primary Image"
                    >
                      <RefreshCcwDot size={20} color="#000000" strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              )))}
            </div>
          </div>
        ) :  !isUploading && (
          <p className="text-gray-500 flex items-center justify-center h-full">
            Upload Images here...
          </p>
        )}

        {(user.role === "INSTITUTION" || user.role === "SHOP_OWNER") && imageCount < 10 && (
          <div className="absolute bottom-2 right-2 z-10">
            <label htmlFor="upload-more" title="Upload up to 10 images">
              <div className="bg-white/80 p-0.5 md:p-2 rounded-full cursor-pointer shadow-md">
                <Plus className="w-6 h-6 text-gray-700" />
              </div>
            </label>
            <input
              id="upload-more"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-sm text-gray-700 font-medium">
            Uploading...
          </div>
        )}
      </div>

      <div className="flex w-full p-4 md:px-12 justify-between items-start">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl pb-1 font-bold text-blue-600 flex items-center gap-2">
            {user.role === "INSTITUTION" ? (
              <>
                <Plus size={30} strokeWidth={2.5} color="#ff0000" />
                {user.firmName || "Medical Institute"}

                {user.subscriptionPlan?.name === "PREMIUM" && (
                  <Crown size={24} fill="#f0d000" className="text-yellow-500" />
                )}
                {user.subscriptionPlan?.name === "BUSINESS" && (
                  <Crown size={24} fill="#AFAFAF" className="text-gray-400" />
                )}
              </>
            ) : user.role === "SHOP_OWNER" ? (
              <>
                <Store size={30} strokeWidth={2.5} color="#1751c4" />
                {user.firmName || "Shop Owner"}

                {user.subscriptionPlan?.name === "PREMIUM" && (
                  <Crown size={24} fill="#f0d000" className="text-yellow-500" />
                )}
                {user.subscriptionPlan?.name === "BUSINESS" && (
                  <Crown size={24} fill="#AFAFAF" className="text-gray-400" />
                )}
              </>
            ) : null}
          </h1>
        </div>
      </div>

      {/* Modal for image preview */}
      {isModalOpen && activeImage && !isDeleteModalOpen &&  (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center" onClick={() => setIsModalOpen(false)}>
          <div className="relative max-w-4xl w-full px-4" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-0 right-4 text-white cursor-pointer transition z-50">
            <X size={24} />
          </button>
            <div className="relative w-full max-w-4xl h-90 flex items-center justify-center">
              <Image
                src={activeImage}
                alt="Preview"
                width={1000}
                height={600}
                objectFit="contain"
                className="rounded shadow-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal for delete confirmation */}
      {isDeleteModalOpen && activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center space-y-4 animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800">Are you sure?</h2>
            <p className="text-sm text-gray-600">Do you really want to delete this image?</p>
            <Image
              src={activeImage}
              alt="To be deleted"
              width={300}
              height={200}
              className="object-contain rounded-md border"
            />
            <div className="flex justify-between gap-4 mt-4">
              <button
                onClick={() => {
                  handleDeleteImage();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer transition-all ease-in-out duration hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setActiveImage(null);
                }}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded cursor-pointer transition-all ease-in-out duration hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
