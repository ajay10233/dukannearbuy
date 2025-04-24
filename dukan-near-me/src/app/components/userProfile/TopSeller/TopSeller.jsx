"use client";
import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TopSeller() {
  const [location, setLocation] = useState(null);
  const [sellers, setSellers] = useState([]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start", 
    slidesToScroll: 1, 
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const fetchCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            const address = data.address || {};
            const loc = {
              city: address.city || address.town || address.village || "",
              zipCode: address.postcode || "",
            };
            setLocation(loc);
          } catch (error) {
            console.error("Error fetching address details:", error);
          }
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser");
    }
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  useEffect(() => {
    const sellers = [
      {
        id: 1,
        sellerName: "Rohit Electronics",
        shopName: "Smart Gadget Hub",
        location: "Sector 14, Gurugram",
        customersServed: 250,
        rating: 4.5,
        image: "/hero-section.png",
      },
      {
        id: 2,
        sellerName: "Sneha Fashion",
        shopName: "Trendy Threads",
        location: "Karol Bagh, Delhi",
        customersServed: 310,
        rating: 4.8,
        image: "/hero-section.png",
      },
      {
        id: 3,
        sellerName: "Amit Appliances",
        shopName: "HomeTech",
        location: "Noida Sector 62",
        customersServed: 180,
        rating: 4.2,
        image: "/hero-section.png",
        },
        {
            id: 4,
            sellerName: "Rohit Electronics",
            shopName: "Smart Gadget Hub",
            location: "Sector 14, Gurugram",
            customersServed: 250,
            rating: 4.5,
            image: "/hero-section.png",
          },
          {
            id: 5,
            sellerName: "Sneha Fashion",
            shopName: "Trendy Threads",
            location: "Karol Bagh, Delhi",
            customersServed: 310,
            rating: 4.8,
            image: "/hero-section.png",
          },
          {
            id: 6,
            sellerName: "Amit Appliances",
            shopName: "HomeTech",
            location: "Noida Sector 62",
            customersServed: 180,
            rating: 4.2,
            image: "/hero-section.png",
          },
    ];
    if (location?.city || location?.zipCode) {
      setSellers(sellers);
    }
  }, [location]);

  return (
    <div className="w-full flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-[1300px] flex flex-col gap-8">
        <h2 className="flex justify-center items-center text-center p-4 text-xl md:text-3xl font-bold text-gray-100">
          Most trusted partners near you
        </h2>

        <div className="relative">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute -left-6 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md"
          >
            <ChevronLeft className="text-black" />
          </button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {sellers.map((seller) => (
                <div
                  key={seller.id}
                  // className="min-w-0 flex-[0_0_25%] px-2"
                  className="px-2 flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.3333%] xl:flex-[0_0_25%]"
                >
                  <Link href="#" className="block cursor-pointer">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col justify-center">
                      <div className="relative w-full h-52">
                        <Image
                          src={seller.image}
                          alt={seller.shopName}
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                      <div className="px-4 py-2 flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">
                            {seller.sellerName}
                          </h3>
                          <div className="flex items-center gap-1">
                            <Star size={20} color="#fdc700" fill="#fdc700" strokeWidth={1.5} />
                            {seller.rating}
                          </div>
                        </div>
                        <p className="text-md text-gray-500">{seller.shopName}</p>
                        <p className="text-sm text-gray-500">{seller.location}</p>
                        <p className="text-sm text-gray-600 flex justify-between items-center">
                          Customers Served:{" "}
                          <span className="flex items-center gap-1 text-gray-500">
                            {seller.customersServed}+
                          </span>
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => emblaApi?.scrollNext()}
            className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md">
            <ChevronRight className="text-black" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {sellers.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-3 w-3 rounded-full ${
                selectedIndex === index ? "bg-yellow-400" : "bg-gray-300"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}
