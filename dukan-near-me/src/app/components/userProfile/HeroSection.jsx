"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSection() {  
  const slides = [
    "/userProfile/hero-section.svg",
    "/userProfile/hero-section.svg",
    "/userProfile/hero-section.svg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {  
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => { 
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="overflow-hidden relative w-full">
        <div className="flex transition-transform ease-out duration-50">
              
        
        </div>
    </div>
  );
}
