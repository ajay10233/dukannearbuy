// "use client";
// import { useEffect, useState, useCallback } from "react";
// import useEmblaCarousel from "embla-carousel-react";
// import Image from "next/image";
// import Link from "next/link";
// import { Star } from "lucide-react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// export default function TopSeller() {
//   const [location, setLocation] = useState(null);
//   const [sellers, setSellers] = useState([]);

//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", slidesToScroll: 1 });

//   const onSelect = useCallback(() => {
//     if (!emblaApi) return;
//     setSelectedIndex(emblaApi.selectedScrollSnap());
//   }, [emblaApi]);

//   useEffect(() => {
//     if (emblaApi) emblaApi.on("select", onSelect);
//   }, [emblaApi, onSelect]);

//   const fetchCurrentLocation = async () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;
//           try {
//             const res = await fetch(
//               `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
//             );
//             const data = await res.json();
//             const address = data.address || {};
//             const loc = { city: address.city || address.town || address.village || "", zipCode: address.postcode || "" };
//             setLocation(loc);
//           } catch (error) {
//             console.error("Error fetching address details:", error);
//           }
//         },
//         (error) => {
//           console.error("Error getting geolocation:", error);
//         }
//       );
//     } else {
//       alert("Geolocation is not supported by this browser");
//     }
//   };

//   useEffect(() => {
//     fetchCurrentLocation();
//   }, []);

//   useEffect(() => {
//         const sellers = [
//             { id: 1, sellerName: "Rohit Electronics", shopName: "Smart Gadget Hub", location: "Sector 14, Gurugram", customersServed: 250, rating: 4.5, image: "/hero-section.png", badge: "On Sale" },
//             { id: 2, sellerName: "Sneha Fashion", shopName: "Trendy Threads", location: "Karol Bagh, Delhi", customersServed: 310, rating: 4.8, image: "/hero-section.png", badge: "New Shop" },
//             { id: 3, sellerName: "Amit Appliances", shopName: "HomeTech", location: "Noida Sector 62", customersServed: 180, rating: 4.2, image: "/hero-section.png", badge: "Festive Offer" },
//             { id: 4, sellerName: "Gaurav Mobiles", shopName: "Mobile World", location: "Rajouri Garden, Delhi", customersServed: 500, rating: 4.9, image: "/hero-section.png", badge: "New Service" },
//             { id: 5, sellerName: "Anita Fashion", shopName: "Stylish Wear", location: "Connaught Place, Delhi", customersServed: 400, rating: 4.6, image: "/hero-section.png", badge: "New Product" },
//             { id: 6, sellerName: "Ravi Appliances", shopName: "Home & Kitchen", location: "Vasant Kunj, Delhi", customersServed: 220, rating: 4.3, image: "/hero-section.png", badge: "Exclusive Seller" }
//         ];

//         if (location?.city || location?.zipCode) {
//         setSellers(sellers);
//         }
//   }, [location]);

//   return (
//     <div className="w-full flex flex-col items-center px-6 py-10">
//       <div className="w-full max-w-[1300px] flex flex-col gap-8">
//         <h2 className="flex justify-center items-center text-center p-4 text-xl md:text-3xl font-bold text-gray-100">
//           Most trusted partners near you
//         </h2>

//         <div className="relative">
//             <button onClick={() => emblaApi?.scrollPrev()} className="absolute -left-6 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-white rounded-full p-2 shadow-md">
//                 <ChevronLeft className="text-black" />
//             </button>

//             <div className="overflow-hidden" ref={emblaRef}>
//                 <div className="flex">                {sellers.map((seller) => (
//                     <div key={seller.id} className="px-2 flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.3333%] xl:flex-[0_0_25%]">
//                     <Link href="#" className="block cursor-pointer">
//                         <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col justify-center relative">
//                         <div className="relative w-full h-52">
//                             <Image src={seller.image} alt={seller.shopName} fill className="object-cover" priority />
//                         </div>
//                         <div className="px-4 py-2 flex flex-col gap-1">
//                             <div className="flex justify-between items-center">
//                             <h3 className="text-lg font-semibold">{seller.sellerName}</h3>
//                             <div className="flex items-center gap-1">
//                                 <Star size={20} color="#fdc700" fill="#fdc700" strokeWidth={1.5} />
//                                 {seller.rating}
//                             </div>
//                             </div>
//                             <p className="text-md text-gray-500">{seller.shopName}</p>
//                             <p className="text-sm text-gray-500">{seller.location}</p>
//                             <p className="text-sm text-gray-600 flex justify-between items-center">
//                             Customers Served: <span className="flex items-center gap-1 text-gray-500">{seller.customersServed}+</span>
//                             </p>
//                         </div>

//                         {/* Badge with Bounce Effect and Different Gradient Patterns */}
//                         <div className={`absolute top-2 right-2 py-1 px-4 text-white text-sm rounded-lg animate-bounce rounded-tl-2xl rounded-bl-sm rounded-br-2xl rounded-tr-sm
//                             ${seller.badge === 'On Sale' ? 'bg-gradient-to-tr from-yellow-500 via-red-500 to-pink-500' : ''}
//                             ${seller.badge === 'New Shop' ? 'bg-gradient-to-br from-blue-500 via-green-500 to-teal-500' : ''}
//                             ${seller.badge === 'Festive Offer' ? 'bg-gradient-to-tl from-orange-500 via-yellow-500 to-red-500' : ''}
//                             ${seller.badge === 'New Product' ? 'bg-gradient-to-bl from-purple-500 via-pink-500 to-red-500' : ''}
//                             ${seller.badge === 'New Service' ? 'bg-gradient-to-tr from-pink-300 via-purple-500 to-blue-500' : ''}
//                             ${seller.badge === 'Exclusive Seller' ? 'bg-gradient-to-tr from-red-500 via-orange-500 to-yellow-500' : ''}`}>
//                             {seller.badge}
//                         </div>
//                         </div>
//                     </Link>
//                     </div>
//                 ))}
//                 </div>
//             </div>

//             <button onClick={() => emblaApi?.scrollNext()} className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-white rounded-full p-2 shadow-md">
//                 <ChevronRight className="text-black" />
//             </button>
//         </div>

//         {/* Dot Indicators */}
//         <div className="flex justify-center gap-2 mt-4">
//             {sellers.map((_, index) => (
//                 <button key={index} onClick={() => emblaApi?.scrollTo(index)} className={`h-3 w-3 cursor-pointer rounded-full ${selectedIndex === index ? "bg-yellow-400" : "bg-gray-300"}`}></button>
//             ))}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

export default function TopSeller() {
  const [location, setLocation] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [paidPromotions, setPaidPromotions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", slidesToScroll: 1 }
  , [Autoplay({ delay: 2500, stopOnInteraction: false })]
);

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
            const loc = { city: address.city || address.town || address.village || "", zipCode: address.postcode || "" };
            setLocation(loc);

            const response = await fetch(`/api/top-profiles?latitude=${latitude}&longitude=${longitude}&radius=5`);
            const nearbySellers = await response.json();
            console.log(nearbySellers);
            setSellers(nearbySellers);
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
    fetch('/api/paid-promotions')
      .then(res => res.json())
      .then(data => {
        console.log("paid promotion:", data);
      });
  }, []);

  return (
    <div className="w-full flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-[1300px] flex flex-col gap-8">
        <h2 className="flex justify-center items-center text-center p-4 text-xl md:text-3xl font-bold text-gray-100">
          Most trusted partners near you
        </h2>

        <div className="relative">
        {sellers.length > 0 && (
          <button onClick={() => emblaApi?.scrollPrev()} className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-white rounded-full p-2 shadow-md">
            <ChevronLeft className="text-black" />
          </button>
        )}

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex flex-col">
              
            {sellers.length > 0 ? (
              sellers.map((seller) => (
                <div key={seller.id} className="px-2 flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.3333%] xl:flex-[0_0_25%]">
                  <Link href={`/partnerProfile/${seller?.user?.id}`}  className="block cursor-pointer">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col justify-center relative">
                      <div className="relative w-full h-52">
                        <Image src={seller?.user?.photos[0]} alt={seller?.user?.firmName} fill className="object-cover" priority />
                      </div>
                      <div className="px-4 py-2 flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold flex items-center gap-1">
                          {seller?.user?.firmName}
                          {seller?.subscriptionPlan?.name === "PREMIUM" && (
                            <Crown size={18} fill="#f0d000" className="text-yellow-500" />
                          )}
                          {seller?.subscriptionPlan?.name === "BUSINESS" && (
                            <Crown size={18} fill="#AFAFAF" className="text-gray-400" />
                          )}
                        </h3>
                          <div className="flex items-center gap-1">
                            <Star size={20} color="#fdc700" fill="#fdc700" strokeWidth={1.5} />
                            {seller.rating && seller.rating > 0 && (
                              <span className="text-sm font-medium text-yellow-600">
                                {seller?.rating} Rating
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-md text-gray-500">
                          {seller?.user?.houseNumber}, {seller?.user?.buildingName}, {seller?.user?.street}, {seller?.user?.city}, {seller.user.zipCode}
                        </p>
                        <p className="text-sm text-gray-500">
                          {seller?.distance?.toFixed(2)} km away
                        </p>
                        <p className="text-sm text-gray-600 flex justify-between items-center">
                          {/* Customers Served: <span className="flex items-center gap-1 text-gray-500">{seller.customersServed}+</span> */}
                        </p>
                      </div>

                      {/* Badge */}
                      <div className={`absolute top-2 right-2 py-1 px-4 text-white text-sm rounded-lg animate-bounce rounded-tl-2xl rounded-bl-sm rounded-br-2xl rounded-tr-sm
                          ${seller.badge === 'On Sale' ? 'bg-gradient-to-tr from-yellow-500 via-red-500 to-pink-500' : ''}
                          ${seller.badge === 'New Shop' ? 'bg-gradient-to-br from-blue-500 via-green-500 to-teal-500' : ''}
                          ${seller.badge === 'Festive Offer' ? 'bg-gradient-to-tl from-orange-500 via-yellow-500 to-red-500' : ''}
                          ${seller.badge === 'New Product' ? 'bg-gradient-to-bl from-purple-500 via-pink-500 to-red-500' : ''}
                          ${seller.badge === 'New Service' ? 'bg-gradient-to-tr from-pink-300 via-purple-500 to-blue-500' : ''}
                          ${seller.badge === 'Exclusive Seller' ? 'bg-gradient-to-tr from-red-500 via-orange-500 to-yellow-500' : ''}`}>
                        {seller.badge}
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No sellers found near you</p>
            )}
            </div>
          </div>

          {sellers.length > 0 && (
            <button onClick={() => emblaApi?.scrollNext()} className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-white rounded-full p-2 shadow-md">
              <ChevronRight className="text-black" />
            </button>
          )}
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {sellers.map((_, index) => (
            <div key={index} className={`w-2.5 h-2.5 rounded-full bg-gray-300 ${selectedIndex === index ? "bg-blue-500" : ""}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
