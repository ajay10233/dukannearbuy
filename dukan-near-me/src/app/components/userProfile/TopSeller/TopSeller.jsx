"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link"; 
import { Star } from "lucide-react";

export default function TopSeller () {
  const [location, setLocation] = useState(null);
  const [sellers, setSellers] = useState([]);

  const fetchCurrentLocation = async () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
            const { latitude, longitude } = position.coords;
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            const address = data.address || {};

            const loc = {
                houseNumber: address.house_number || "",
                street: address.road || "",
                buildingName: "",
                landMark: "",
                city: address.city || address.town || address.village || "",
                state: address.state || "",
                country: address.country || "",
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

//   useEffect(() => {
//     const fetchSellers = async () => {
//       if (location?.city || location?.zipCode) {
//         try {
//           const res = await fetch(
//              // api
//           );
//           const data = await res.json();
//           setSellers(data);
//         } catch (error) {
//           console.error("Error fetching sellers:", error);
//         }
//       }
//     };

//     fetchSellers();
//   }, [location]);
    
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
        ];
    
        if (location?.city || location?.zipCode) {
            setSellers(sellers);
        }
    }, [location]);

    return (
        <div className="w-full flex flex-col items-center px-6 py-10">
            <div className="w-full max-w-[1000px] flex flex-col gap-8">
                <h2 className="flex justify-center items-center p-4 text-xl md:text-3xl font-bold text-gray-100">
                    Top certified seller near you
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sellers.length > 0 ? (
                        sellers.map((seller) => (
                            <Link key={seller.id} href="#" className="block cursor-pointer">    
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col justify-center">
                                    <div className="relative w-full h-50">
                                        <Image src={seller.image}
                                                alt={seller.shopName} fill
                                                className="object-cover" priority/>        
                                    </div>
                                    <div className="px-4 py-2 flex flex-col gap-1">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold">{seller.sellerName}</h3>
                                            <div className="flex items-center gap-1">
                                                <Star size={20} color="#fdc700" fill="#fdc700" strokeWidth={1.5} />
                                                    {seller.rating}
                                            </div>
                                        </div>
                                        <p className="text-md text-gray-500">{seller.shopName}</p>
                                        <p className="text-sm text-gray-500">{seller.location}</p>
                                        <p className="text-sm text-gray-600 flex justify-between items-center">
                                            Customers Served:  <span className="flex items-center gap-1 text-gray-500">{seller.customersServed}+</span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                            <p className="text-gray-500 text-center col-span-full">
                                Fetching nearby sellers...
                            </p>
                        )}
                </div>
            </div>
        </div>
    );
};
