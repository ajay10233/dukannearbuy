"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import toast from "react-hot-toast";
import useEmblaCarousel from "embla-carousel-react";
import { Plus, X, RefreshCcwDot, Store, Star, Crown} from "lucide-react";
import ProfileWrapper from "./ProfileWrapper";

export default function HeroSection() {
  const { data: session } = useSession();
  const [images, setImages] = useState([]);
  const [imageCount, setImageCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

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

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const remainingSlots = 10 - imageCount;
    const filesToUpload = files.slice(0, remainingSlots);

    setIsUploading(true);

    for (const file of filesToUpload) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large (max 2MB).`);
        continue;
      }

      const base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => reject("Failed to read file.");
        reader.readAsDataURL(file);
      });

      setImages((prev) => [...prev, base64String]);
      setImageCount((prev) => prev + 1);
      toast.success(`Uploaded ${file.name}`);
    }

    setIsUploading(false);
  };

//   const handleDeleteImage = (indexToDelete) => {
//     const updatedImages = images.filter((_, i) => i !== indexToDelete);
//     setImages(updatedImages);
//     setImageCount(updatedImages.length);
//     toast.success("Image deleted successfully");
    //   };

    // const handleDeleteImage = async (indexToDelete) => {
    //     const imageToDelete = images[indexToDelete];
      
    //     try {
    //       const response = await fetch("/api/institutions/delete-photo", {
    //         method: "DELETE",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ imageUrl: imageToDelete }),
    //       });
      
    //       const result = await response.json();
      
    //       if (!response.ok) {
    //         throw new Error(result.error || "Failed to delete image");
    //       }
      
    //       const updatedImages = images.filter((_, i) => i !== indexToDelete);
    //       setImages(updatedImages);
    //       setImageCount(updatedImages.length);
    //       toast.success("Image deleted successfully");
    //     } catch (error) {
    //       console.error("Error deleting image:", error);
    //       toast.error(error.message || "Failed to delete image");
    //     }
    //   };
      

  const handleSetPrimary = (index) => {
    const rotated = [...images.slice(index), ...images.slice(0, index)];
    setImages(rotated);
    toast.success("Primary image updated!");
  };

  return (
    <div className={`-full ${session?.user?.role === "INSTITUTION"
        ? "bg-gradient-to-tr from-white to-sky-100"
        : session?.user?.role === "SHOP_OWNER"
          ? "bg-gradient-to-tl from-lime-100 to-white"
          : ""
      }`}>
      {/* <ProfileWrapper/> */}
      <div className="w-full h-60 md:h-81 relative overflow-hidden shadow-inner">
        {(images.length > 0 || session?.user?.image) ? (
          <div className="h-full" ref={emblaRef}>
            <div className="flex h-full cursor-pointer">
              {(images.length > 0 ? images : [session.user.image]).map((img, index) => (
                  <div className="flex-[0_0_100%] relative h-full group" key={index}
                    onClick={() => {
                        setActiveImage(img);
                        setIsModalOpen(true);
                    }}>
                  <Image
                    src={img}
                    alt={`Uploaded ${index + 1}`}
                    fill
                    className="object-contain md:object-cover"
                    priority
                  />

                  {/* Label for Primary image */}
                  {index === 0 && (
                    <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow">
                      Primary
                    </span>
                      )}
                      
                      {/* {(session?.user?.role === "INSTITUTION" || session?.user?.role === "SHOP_OWNER") && images.includes(img) && (
                            <button
                                onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteImage(index);
                                }}
                                className="absolute top-2 right-2 cursor-pointer bg-white/80 hover:bg-white rounded-full p-1 shadow group-hover:opacity-100 opacity-0 transition"
                                title="Delete Image">
                                <X size={20} color="#000000" strokeWidth={1.5} />
                            </button>
                        )} */}

                      {/* Set as Primary Button */}
                      {(session?.user?.role === "INSTITUTION" || session?.user?.role === "SHOP_OWNER") && images.includes(img) && index !== 0 && (
                            <button
                                onClick={(e) => {
                                e.stopPropagation();  // Prevent the modal from opening
                                handleSetPrimary(index);
                                }}
                                className="absolute bottom-2 left-2 cursor-pointer bg-white/80 hover:bg-white rounded-full p-1 shadow group-hover:opacity-100 opacity-0 transition"
                                title="Set as Primary Image">
                                <RefreshCcwDot size={20} color="#000000" strokeWidth={1.5} />
                            </button>
                        )}

                </div>
              ))}
            </div>
          </div>
        ) : !isUploading && (
          <p className="text-gray-500 flex items-center justify-center h-full">
            Upload Images here...
          </p>
        )}

        {/* Plus Icon to Upload More images */}

        {(session?.user?.role === "INSTITUTION" || session?.user?.role === "SHOP_OWNER") && 
            imageCount < 10 && (
            <div className="absolute bottom-2 right-2 z-10">
                <label htmlFor="upload-more" title="Upload up to 10 images">
                    <div className="bg-white/80 hover:bg-white p-0.5 md:p-2 rounded-full cursor-pointer shadow-md">
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

        {/* Uploading overlay */}
        {isUploading && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-sm text-gray-700 font-medium">
                Uploading...
            </div>
        )}

      </div>
        <div className="flex w-full p-4 md:px-12 justify-between items-start">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl md:text-3xl pb-1 font-bold text-blue-600 flex items-center gap-2">
                    {session?.user?.role === "INSTITUTION" ? (                            
                    <>
                        <Plus size={30} strokeWidth={2.5} color="#ff0000" />
                        {session?.user?.firmName || "Medical Institute"}
                        
                        {session?.user?.subscriptionPlan?.name === "PREMIUM" && (
                          // <Star size={24} fill="#f0d000" className="text-yellow-500" />
                          <Crown size={24} fill="#f0d000" className="text-yellow-500" />
                        )}
                        {session?.user?.subscriptionPlan?.name === "BUSINESS" && (
                          <Crown size={24} fill='#AFAFAF' className="text-gray-400" />
                        )}
                    </>
                        ) : session?.user?.role === "SHOP_OWNER" ? (
                    <>
                        <Store size={30} strokeWidth={2.5} color="#1751c4" />
                        {session?.user?.firmName || "Shop Owner"}

                        {session?.user?.subscriptionPlan?.name === "PREMIUM" && (
                          <Crown size={24} fill="#f0d000" className="text-yellow-500" />
                        )}
                        {session?.user?.subscriptionPlan?.name === "BUSINESS" && (
                          <Crown size={24} fill='#AFAFAF' className="text-gray-400" />
                        )}
                    </>
                    ) : null}
                </h1>
            </div>
        </div>
          
        {/* Modal for image preview */}
        {isModalOpen && activeImage && (
            <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
                onClick={() => setIsModalOpen(false)}>
                <div className="relative max-w-4xl w-full px-4"
                    onClick={(e) => e.stopPropagation()} >
                    <div className="relative w-full h-[80vh]">
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
    </div>
  );
}
