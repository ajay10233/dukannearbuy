"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import useEmblaCarousel from "embla-carousel-react";
import { Plus, RefreshCcwDot, Store, Crown, X, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import LogoLoader from "../LogoLoader";


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
  const [modalEmblaRef, modalEmblaApi] = useEmblaCarousel({ loop: true }); // modal carousel


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

  // For main carousel
useEffect(() => {
  if (!emblaApi) return;
  emblaApi.reInit();
}, [images, emblaApi]);

// For modal carousel
useEffect(() => {
  if (!modalEmblaApi) return;
  modalEmblaApi.reInit();
}, [isModalOpen, modalEmblaApi]);

    // for preview images
  const scrollPrev = useCallback(() => {
    if (modalEmblaApi) modalEmblaApi.scrollPrev();
  }, [modalEmblaApi]);

  const scrollNext = useCallback(() => {
    if (modalEmblaApi) modalEmblaApi.scrollNext();
  }, [modalEmblaApi]);


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

        if (images.length === 0 && data.urls.length > 0) {
          try {
            const result = await axios.put("/api/institutions/primary-image", { url: data.urls[0] });
            if (result.status === 200) {
              toast.success("Primary image set automatically!");
              setUser((prev) => ({
                ...prev,
                profilePhoto: data.urls[0],
              }));
            } else {
              toast.error("Failed to set primary image.");
            }
          } catch (error) {
            console.error("Auto-set primary image failed", error);
          }
        }

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

  const handleSetPrimary = async (index) => {
    const image_url = images[index];
    
    const rotated = [...images.slice(index), ...images.slice(0, index)];
    setImages(rotated);
    try {
      // let image_url = images[index];
      const result = await axios.put("/api/institutions/primary-image", { url:image_url });
      if (result.status === 200) {
        toast.success("Primary image updated!");

        setUser((prev) => ({
        ...prev,
        profilePhoto: image_url,
        }));
      } else {
        toast.error("Failed to update primary image.");
      }

    } catch (error) {
      // toast.error("Failed to update primary image.");
    }
    console.log(images[index]);
    // toast.success("Primary image updated!");
  };

  if (!user) {
    return (
      <LogoLoader content={"fetching profile images..."} />
    );
  }

  return (
    <div className={`w-full relative ${user.role === "INSTITUTION" ? "bg-gradient-to-tr from-white to-sky-100" : user.role === "SHOP_OWNER" ? "bg-gradient-to-tl from-lime-100 to-white" : ""}`}>
      
      {/* {user.paidPromotions?.[0]?.notes && ( */}
      {user.paidPromotions?.[0]?.notes &&
        user.paidPromotions[0].expiresAt &&
        new Date(user.paidPromotions[0].expiresAt) > new Date() && (

        <div
          className={`absolute top-3 md:top-6 right-3 md:right-10 z-10 py-1 px-4 text-white text-sm rounded-lg animate-bounce rounded-tl-2xl rounded-bl-sm rounded-br-2xl rounded-tr-sm
            ${user.paidPromotions[0].notes === 'On Sale' ? 'bg-gradient-to-tr from-yellow-500 via-red-500 to-pink-500' : ''}
            ${user.paidPromotions[0].notes === 'New Shop' ? 'bg-gradient-to-br from-blue-500 via-green-500 to-teal-500' : ''}
            ${user.paidPromotions[0].notes === 'Festive Offer' ? 'bg-gradient-to-tl from-orange-500 via-yellow-500 to-red-500' : ''}
            ${user.paidPromotions[0].notes === 'New Product' ? 'bg-gradient-to-bl from-purple-500 via-pink-500 to-red-500' : ''}
            ${user.paidPromotions[0].notes === 'New Service' ? 'bg-gradient-to-tr from-pink-300 via-purple-500 to-blue-500' : ''}
            ${user.paidPromotions[0].notes === 'Exclusive Seller' ? 'bg-gradient-to-tr from-red-500 via-orange-500 to-yellow-500' : ''}
          `}>
              {user.paidPromotions[0].notes === 'Popular Reach' ? 'Most Visited' : user.paidPromotions[0].notes}
        </div>
        
      )}

      <div className="w-full h-60 md:h-100 relative overflow-hidden shadow-inner">
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
        {images.length > 0 ? (
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

                  {img === user?.profilePhoto && (
                    <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow">
                      Primary
                    </span>
                  )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleSetPrimary(index);
                      }}
                      className="absolute bottom-2 left-2 cursor-pointer bg-white/80 hover:bg-white rounded-full p-1 shadow "
                      title="Set as Primary Image"
                    >
                      <RefreshCcwDot size={20} color="#000000" strokeWidth={1.5} />
                    </button>
                </div>
              )))}
            </div>
          </div>
        ) :  !isUploading ? (
          <div className="text-gray-500 flex items-center justify-center h-full">
            Upload Images here...
          </div>
        ) : null}

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

                {user.subscriptionPlan?.name === "PREMIUM" &&
                  new Date(user.subscriptionPlan?.expiresAt) > new Date() && (
                    <Crown size={24} fill="#f0d000" className="text-yellow-500" />
                )}

                {user.subscriptionPlan?.name === "BUSINESS" &&
                  new Date(user.subscriptionPlan?.expiresAt) > new Date() && (
                    <Crown size={24} fill="#AFAFAF" className="text-gray-400" />
                )}
              </>
            ) : user.role === "SHOP_OWNER" ? (
              <>
                <Store size={30} strokeWidth={2.5} color="#1751c4" />
                {user.firmName || "Shop Owner"}

                {user.subscriptionPlan?.name === "PREMIUM" &&
                  new Date(user.subscriptionPlan?.expiresAt) > new Date() && (
                    <Crown size={24} fill="#f0d000" className="text-yellow-500" />
                )}

                {user.subscriptionPlan?.name === "BUSINESS" &&
                  new Date(user.subscriptionPlan?.expiresAt) > new Date() && (
                    <Crown size={24} fill="#AFAFAF" className="text-gray-400" />
                )}
              </>
            ) : null}
          </h1>

        </div>
      </div>

      {isModalOpen && activeImage && !isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center" onClick={() => setIsModalOpen(false)}>
          <div className="relative max-w-4xl w-full px-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white cursor-pointer z-50"
            >
              <X size={24} />
            </button>

              {/* Carousel with navigation */}
              <div className="relative w-full max-w-4xl h-[500px] overflow-hidden rounded-lg" ref={modalEmblaRef}>
                <div className="flex h-full">
                  {images.map((img, index) => (
                    <div key={index} className="flex-[0_0_100%] relative h-full mx-4">
                      <Image
                        src={img}
                        alt={`Preview ${index + 1}`}
                        layout="fill"
                        objectFit="contain"
                        className="rounded shadow-lg" priority
                      />
                    </div>
                  ))}
                </div>

                {/* Prev/Next Buttons */}
                <button
                  onClick={scrollPrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer text-white bg-black/50 p-2 rounded-full z-40 hover:bg-black/70"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={scrollNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-white bg-black/50 p-2 rounded-full z-40 hover:bg-black/70"
                >
                  <ChevronRight size={24} />
                </button>
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