"use client";
import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight, Crown } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import LogoLoader from "../../LogoLoader";

export default function TopSeller() {
  const [location, setLocation] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 2500, stopOnInteraction: false })]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const fetchTopProfiles = async (latitude, longitude) => {
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
      localStorage.setItem("user_location", JSON.stringify(loc));

      console.log("Latitude:", latitude, "Longitude:", longitude);

      const response = await fetch(
        `/api/top-profiles?latitude=${latitude}&longitude=${longitude}`
      );
      const nearbySellers = await response.json();
      console.log("Nearby sellers:", nearbySellers);
      setSellers(nearbySellers);
    } catch (error) {
      console.error("Error fetching location or profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentLocation = () => {
    const cachedLocation = localStorage.getItem("user_location");
    if (cachedLocation) {
      const loc = JSON.parse(cachedLocation);
      setLocation(loc);
    }

    if (navigator.geolocation) {
      const geoTimeout = setTimeout(() => {
        console.warn("Geolocation timeout. Using fallback or cached data.");
        setLoading(false);
      }, 10000); // 10s timeout

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(geoTimeout);
          const { latitude, longitude } = position.coords;
          fetchTopProfiles(latitude, longitude);
        },
        (error) => {
          clearTimeout(geoTimeout);
          console.error("Error getting geolocation:", error);
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  
  return (
    <div className="w-full flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-[1300px] flex flex-col gap-8">
        <h2 className="flex justify-center items-center text-center p-4 text-xl md:text-3xl font-bold text-gray-100">
          Most trusted partners near you
        </h2>

        {loading ? (
          // <div className="text-center text-gray-400 py-10">Fetching trusted sellers near you...</div>
          <LogoLoader content={"Loading home..."} />
        ) : sellers.length > 0 ? (
            <div className="relative">
              {/* {sellers.length > 4 && ( */}
                <button
                  onClick={() => emblaApi?.scrollPrev()}
                  className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-white/20 hover:bg-white/25 transition-all ease-in-out duration-400 rounded-full p-2 shadow-md"
                >
                  <ChevronLeft className="text-yellow-300" />
                </button>
              {/* )} */}

            <div className="overflow-hidden" ref={emblaRef}>
              {/* <div className={`flex flex-row ${
                  sellers.length < 4 ? "justify-center gap-4" : ""
                }`}> */}
                <div className={`flex flex-row md:justify-center`}>
                {sellers.map((seller, i) => (
                  <div
                    key={seller.id || i}
                    className="px-2 flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.3333%] xl:flex-[0_0_25%]"
                  >
                    <Link href={`/partnerProfile/${seller?.user?.id}`} className="block cursor-pointer">
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col justify-center relative">
                        <div className="relative w-full h-52 border-b border-gray-400">
                          {/* <Image
                            src={seller?.user?.photos?.[0] || "/default-img.jpg"}
                            alt={seller?.user?.firmName || "Default Image"}
                            fill
                            className="object-cover"
                            priority
                          /> */}
                          <Image
                            src={
                              seller?.user?.profilePhoto && seller?.user?.profilePhoto !== "null"
                                ? seller.user.profilePhoto
                                : seller?.user?.photos?.length > 0
                                  ? seller.user.photos[0]
                                  : "/default-img.jpg"
                            }
                            alt={seller?.user?.firmName || "Default Image"}
                            fill
                            className="object-cover"
                            priority
                          />

                        </div>
                        <div className="px-4 py-2 flex flex-col gap-1">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold flex items-center gap-1">
                              {seller?.user?.firmName}

                              {seller?.subscriptionPlan?.name === "PREMIUM" &&
                                new Date(seller?.subscriptionPlan?.expiresAt) > new Date() && (
                                  <Crown size={18} fill="#f0d000" className="text-yellow-500" />
                              )}

                              {seller?.subscriptionPlan?.name === "BUSINESS" &&
                                new Date(seller?.subscriptionPlan?.expiresAt) > new Date() && (
                                  <Crown size={18} fill="#AFAFAF" className="text-gray-400" />
                              )}
                            </h3>
                            <div className="flex items-center gap-1">
                              {seller?.averageRating > 0 && (
                                <div className="flex items-center gap-1">
                                  <Star
                                    size={20}
                                    color="#fdc700"
                                    fill="#fdc700"
                                    strokeWidth={1.5}
                                  />
                                  <span className="text-sm font-medium text-yellow-600">
                                    {seller.averageRating.toFixed(1)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-md text-gray-500">
                            {seller?.user?.city}, {seller?.user?.state},{" "}
                            {seller?.user?.country}
                          </p>
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold">Distance: </span>
                            {seller?.distance?.toFixed(2)} km away
                          </p>
                        </div>

                        {/* Badge */}
                        {seller?.notes && (
                          <div
                            className={`absolute top-2 right-2 py-1 px-4 text-white text-sm rounded-lg animate-bounce rounded-tl-2xl rounded-bl-sm rounded-br-2xl rounded-tr-sm
                            ${seller?.notes === 'On Sale' ? 'bg-gradient-to-tr from-yellow-500 via-red-500 to-pink-500' : ''}
                            ${seller?.notes === 'New Shop' ? 'bg-gradient-to-br from-blue-500 via-green-500 to-teal-500' : ''}
                            ${seller?.notes === 'Festive Offer' ? 'bg-gradient-to-tl from-orange-500 via-yellow-500 to-red-500' : ''}
                            ${seller?.notes === 'New Product' ? 'bg-gradient-to-bl from-purple-500 via-pink-500 to-red-500' : ''}
                            ${seller?.notes === 'New Service' ? 'bg-gradient-to-tr from-pink-300 via-purple-500 to-blue-500' : ''}
                            ${seller?.notes === 'Exclusive Seller' ? 'bg-gradient-to-tr from-red-500 via-orange-500 to-yellow-500' : ''}
                            ${seller?.notes === 'Promotion' ? 'bg-gradient-to-tr from-indigo-400 via-purple-500 to-pink-500' : ''} 
                            ${seller?.notes === 'Reloacate' ? 'bg-gradient-to-tr from-yellow-500 via-red-500 to-pink-500' : ''}
                          `}>
                            {seller.notes === 'Popular Reach' ? 'Most Visited' : seller.notes}
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

              {/* {sellers.length > 4 && ( */}
                <button
                  onClick={() => emblaApi?.scrollNext()}
                  className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-white/20 hover:bg-white/25 transition-all ease-in-out duration-400 rounded-full p-2 shadow-md"
                >
                  <ChevronRight className="text-yellow-300" />
                </button>
              {/* )} */}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">No sellers found near you.</div>
        )}

        {/* Dot Indicators */}
        {!loading && sellers.length > 0 && (
          <div className="flex justify-center gap-2 mt-4">
            {sellers.map((_, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 rounded-full cursor-pointer bg-yellow-300 ${
                  selectedIndex === index ? "bg-blue-500" : ""
                }`}
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
