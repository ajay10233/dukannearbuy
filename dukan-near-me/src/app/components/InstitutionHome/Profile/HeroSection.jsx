"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import toast from "react-hot-toast";
import useEmblaCarousel from "embla-carousel-react";

export default function HeroSection() {
  const { data: session } = useSession();
  console.log("session:", session);
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
  
    for (const file of filesToUpload) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large (max 2MB).`);
        continue;
      }
  
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
  
        try {
          setIsUploading(true);
          const res = await fetch("/api/institutions/upload-photo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ images: [base64String] })
          });
  
          const data = await res.json();
          if (res.ok) {
            setImages((prev) => [...prev, data?.urls?.[0]]);
            setImageCount((prev) => prev + 1);
            toast.success("Image uploaded!");
          } else {
            toast.error(data.error || "Upload failed.");
          }
        } catch (err) {
          toast.error("Something went wrong.");
        } finally {
          setIsUploading(false);
        }
      };
  
      reader.readAsDataURL(file);
    }
  };

    return (
    <div className="w-full bg-white rounded-lg shadow-md text-center pt-15">
      <div className="w-full h-70 relative rounded-md overflow-hidden shadow-inner">
        {(images.length > 0 || session?.user?.image) ? (
          <div className="h-full" ref={emblaRef}>
            <div className="flex h-full">
              {(images.length > 0 ? images : [session.user.image]).map((img, index) => (
                <div className="flex-[0_0_100%] relative h-full" key={index}>
                  <Image
                    src={img}
                    alt={`Uploaded ${index + 1}`}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 flex items-center justify-center h-full">
            No image
          </p>
        )}

        <input
          type="file"
          accept="image/*"
          title="Upload an image"
          aria-label="Upload image"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleImageChange}
        />

        {isUploading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-sm text-gray-700 font-medium">
            Uploading...
          </div>
        )}
      </div>
    </div>
  );
}
