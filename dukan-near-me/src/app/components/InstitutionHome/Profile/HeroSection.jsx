"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import toast from "react-hot-toast";
import useEmblaCarousel from "embla-carousel-react";
import { Plus, X, RefreshCcwDot } from "lucide-react";
import ProfileWrapper from "./ProfileWrapper";

export default function HeroSection() {
  const { data: session } = useSession();
  const [images, setImages] = useState([]);
  const [imageCount, setImageCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
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

  const handleDeleteImage = (indexToDelete) => {
    const updatedImages = images.filter((_, i) => i !== indexToDelete);
    setImages(updatedImages);
    setImageCount(updatedImages.length);
    toast.success("Image deleted");
  };

  const handleSetPrimary = (index) => {
    const rotated = [...images.slice(index), ...images.slice(0, index)];
    setImages(rotated);
    toast.success("Primary image updated!");
  };
  
  

  return (
    <div className="w-full bg-gradient-to-tl from-sky-200 to-white">
      {/* <ProfileWrapper/> */}
      <div className="w-full h-72 relative overflow-hidden shadow-inner border border-dashed border-white">
        {(images.length > 0 || session?.user?.image) ? (
          <div className="h-full" ref={emblaRef}>
            <div className="flex h-full">
              {(images.length > 0 ? images : [session.user.image]).map((img, index) => (
                <div className="flex-[0_0_100%] relative h-full group" key={index}>
                  <Image
                    src={img}
                    alt={`Uploaded ${index + 1}`}
                    fill
                    className="object-cover"
                    priority
                  />

                  {/* Label for Primary image */}
                  {index === 0 && (
                    <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow">
                      Primary
                    </span>
                  )}

                  {images.includes(img) && (
                    <button
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-2 right-2 cursor-pointer bg-white/80 hover:bg-white rounded-full p-1 shadow group-hover:opacity-100 opacity-0 transition"
                      title="Delete Image">
                        <X size={20} color="#000000" strokeWidth={1.5} />
                    </button>
                  )}

                  {/* Set as Primary Button */}
                    {images.includes(img) && index !== 0 && (
                      <button
                        onClick={() => handleSetPrimary(index)}
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
        {imageCount < 10 && (
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
      <div className="flex w-full p-4 md:px-12 md:pt-8 justify-between items-start">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl pb-3 md:pb-6 font-bold text-blue-600 flex items-center gap-2">
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
        </div>
      </div>
    </div>
  );
}
