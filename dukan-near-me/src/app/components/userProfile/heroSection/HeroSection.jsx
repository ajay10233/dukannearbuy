"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react"; 
import axios from "axios";

const DotButton = ({ onClick, isSelected }) => (
    <button
      className={`w-3 h-3 rounded-md border-2 border-gray-500 transition-colors duration-300 ${
        isSelected ? "bg-gray-500" : "bg-transparent"
      }`}
      onClick={onClick}
    />
);  

export default function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const [images, setImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  // ✅ Fetch images from your API
  const fetchImages = async () => {
    try {
      const res = await axios.get(`/api/admin-images`);
      setImages(res.data); // assuming res.data is an array of { link, details }
    } catch (err) {
      console.error("Failed to fetch images:", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList() || []);
    emblaApi.on("select", () => setSelectedIndex(emblaApi.selectedScrollSnap()));
  }, [emblaApi, images]);

  return (
    <div className="flex flex-col items-center w-full md:p-4 gap-y-4 py-0 px-2">
      <div className="overflow-hidden w-full relative" ref={emblaRef}> {/* relative data for positioning buttons */}
        <div className="flex gap-x-5 px-2">
          {images.map((img, index) => (
            <div
              className={`min-w-75 h-50 md:min-w-[1000px] md:h-[500px] flex-shrink-0 rounded-md overflow-hidden shadow-lg transition-opacity duration-500 relative z-0 ${
                index === selectedIndex ? "opacity-100" : "opacity-40"
              }`}
              key={img.id || index}
            >
              {/* Make sure to set width/height for `next/image` if you're not using `fill` */}
              <Image
                src={img.link}
                alt={img.details || `Promotion image ${index + 1}`}
                layout="fill"
                // objectFit="contain"
                objectFit="cover"
                className="transition-opacity duration-500"
                priority
              />
              {index !== selectedIndex && (
                <div className="absolute inset-0 bg-black opacity-40 transition-opacity duration-500"></div>
              )}
            </div>
          ))}
        </div>

        {/* Left and Right Navigation */}
        <button 
          onClick={() => emblaApi && emblaApi.scrollPrev()} 
          className="absolute top-1/2 left-2 transform -translate-y-1/2  p-2 rounded-full z-10 cursor-pointer"
        >
          <ChevronLeft size={40} color="#fff" />
        </button>
        <button 
          onClick={() => emblaApi && emblaApi.scrollNext()} 
          className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 rounded-full z-10 cursor-pointer"
        >
          <ChevronRight size={40} color="#fff" />
        </button>

      </div>

      <div className="flex gap-2 gap-y-4">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
            isSelected={index === selectedIndex}
          />
        ))}
      </div>
    </div>
  );
}
