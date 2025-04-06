"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const images = [
    "/hero-section.png",
    "/hero-section.png",
    "/hero-section.png",
    "/hero-section.png"
];

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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList() || []);
    emblaApi.on("select", () => setSelectedIndex(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  return (
    <div className="flex flex-col items-center w-full md:p-4 gap-y-4 py-0 px-2">
      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex gap-x-5 px-2">
          {images.map((src, index) => (
            <div
              className={`min-w-75 h-50 md:min-w-[1000px] md:h-[400px] flex-shrink-0 rounded-md overflow-hidden shadow-lg transition-opacity duration-500 relative z-0 ${
                index === selectedIndex ? "opacity-100" : "opacity-20"
              }`}
              key={index}>
              <Image
                src={src}
                alt={`Promotion image ${index + 1}`}
                fill
                className="object-cover"
                priority
              />
              {index !== selectedIndex && (
                <div className="absolute inset-0 bg-black opacity-40 transition-opacity duration-500"></div>
              )}
            </div>
          ))}
        </div>
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
