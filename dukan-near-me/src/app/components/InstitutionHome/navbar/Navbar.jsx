"use client";

import React, { useState, useEffect } from "react";
import { MapPin, UserRound, ChevronDown } from "lucide-react";
// import Sidebar from "@/app/components/InstitutionHome/navbar/sidebar/InstitutionSidebar";
// import UserSidebar from "@/app/components/userProfile/navbar/sidebar/UserSidebar";
import UserSidebar from "../../userProfile/navbar/sidebar/UserSidebar";
import { useRouter } from "next/navigation";
import Image from 'next/image';
// import InstitutionSidebar from "@/app/components/InstitutionHome/navbar/sidebar/InstitutionSidebar";
import InstitutionSidebar from "./sidebar/InstitutionSidebar";

export default function Navbar() {
    const [location, setLocation] = useState({
        houseNumber: "",
        street: "",
        buildingName: "",
        landMark: "",
        city: "",
        suburb: "",
        neighbourhood: "",
        county: "",
        state: "",
        country: "",
        zipCode: "",
    });
    const [isSidebar, setIsSidebar] = useState(false);
    const router = useRouter();
    const [hasFetchedSavedLocation, setHasFetchedSavedLocation] = useState(false);
    const [role, setRole] = useState(null);

        // const handleSidebar = async () => {
        //     try {
        //         const res = await fetch("/api/users/me");
        //         const data = await res.json();
        //         if (data?.role) {
        //             setRole(data.role);
        //         }
        //     } catch (err) {
        //         console.error("Failed to fetch user role:", err);
        //     }
        // };
        
        // useEffect(() => {
        //     handleSidebar();
    // }, []);
    
    useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await fetch("/api/users/me");
            const data = await res.json();
            if (data?.role) {
                setRole(data.role);

                // if (data.role === "INSTITUTION" || data.role === "SHOP_OWNER") {
                //     fetchCurrentLocation();
                // } else if (data.role === "USER") {
                //     await fetchSavedLocation();
                //     setHasFetchedSavedLocation(true);
                // }
                if (data.role === "USER") {
                    await fetchSavedLocation();
                    setHasFetchedSavedLocation(true);
                }
            }
        } catch (err) {
            console.error("Failed to fetch user role:", err);
        }
    };

    fetchData();
}, []);

    
    const fetchSavedLocation = async () => {
        try {
            const res = await fetch("/api/users/location");
            const data = await res.json();
            
            if (data.error) {
                console.error("Error fetching location:", data.error);
                return;
            }
            
            setLocation(data); 
        } catch (error) {
            console.error("Error fetching saved location:", error);
        }
    };

    useEffect(() => {
    if ((role === "INSTITUTION" || role === "SHOP_OWNER") && navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();
                    const address = data.address || {};

                    setLocation({
                        houseNumber: address.house_number || "",
                        street: address.road || "",
                        buildingName: "",
                        landMark: "",
                        city: address.city || address.town || address.village || "",
                        // city: address.city || address.town || address.village || address.suburb || address.neighbourhood || address.county || "",
                        suburb: address.suburb || "",
                        neighbourhood: address.neighbourhood || "",
                        county: address.county || "",
                        state: address.state || "",
                        country: address.country || "",
                        zipCode: address.postcode || "",
                    });
                } catch (error) {
                    console.error("Error fetching address details:", error);
                }
            },
            (error) => {
                console.error("Error watching geolocation:", error);
            },
            { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watchId); // cleanup on unmount
    }
}, [role]);

        
    useEffect(() => {
            if (
                hasFetchedSavedLocation &&
                Object.values(location).every(value => !value)
            ) {
                fetchCurrentLocation();
            }
    }, [hasFetchedSavedLocation]);

    const getTruncatedLocation = () => {
        const locationString = [
            location.houseNumber,
            location.street,
            location.buildingName,
            location.landMark,
            location.city,
            location.state,
            location.country,
            location.zipCode
        ].filter(Boolean).join(", ");

        const maxLength = 15;
        if (locationString.length > maxLength) {
            return locationString.substring(0, maxLength).trim() + " ...";
        }
    
        return locationString;
    };

    
    return (
        <header className='flex w-full justify-between fixed z-50 bg-white font-[var(--font-roboto)]'>      
            <div className='flex items-center p-0 md:pl-4 md:pr-2 text-[var(--secondary-foreground)] text-sm font-medium gap-1 md:gap-2'>
                
                <button className="p-2 cursor-pointer relative w-12.5 h-12.5">
                    <Image src="/nearbuydukan-Logo/Logo.svg" alt="nearbuydukan" fill sizes='50px' priority />
                </button> 
                
                <button className="text-gray-700 font-medium text-sm cursor-pointer"
                    onClick={() => router.push("/change-location")} >
                    <span>
                        {/* display live location */}
                        {Object.values(location).every(value => !value) ? (
                            "Fetching Location..."
                        ) : (
                            <>
                                <span className="hidden sm:inline">
                                    {location.houseNumber && `${location.houseNumber}, `}
                                    {location.street && `${location.street}, `}
                                    
                                    {/*    {location.city && `${location.city}, `}  */}
                                        
                                        {[
                                            location.city,
                                            location.suburb,
                                            location.neighbourhood,
                                            location.county
                                        ].filter(Boolean).join(", ")}, 

                                    {location.state && `${location.state} - `}
                                    {location.zipCode}
                                </span>
                                <span className="inline sm:hidden">
                                    {getTruncatedLocation()}
                                </span>       
                            </> 
                        )}
                    </span>
                </button>
                
                <button className="p-1 cursor-pointer">
                    <ChevronDown size={28} strokeWidth={1.5} color="#187DE6" onClick={() => router.push("/change-location")} />
                </button>    
            </div>
            <div className='w-1/3 flex justify-end lg:justify-around bg-transparent lg:bg-gray-100 rounded-bl-4xl'>
                <p className="text-slate-800 hidden lg:flex justify-end items-center font-[var(--font-rubik)] text-sm">Skip the Queue find the nearest dukan now</p>
                <button className='p-2 cursor-pointer' onClick={() => setIsSidebar(true)}>
                    <UserRound size={28} strokeWidth={1.5} color="#187DE6" />
                </button>        
            </div>    

            {/* Sidebar Component */}
            {/* <Sidebar isOpen={isSidebar} onClose={() => setIsSidebar(false)} /> */}
            {role === "USER" ? (
                <UserSidebar isOpen={isSidebar} onClose={() => setIsSidebar(false)}
                    // onClick={handleSidebar}
                />
                    ) : (
                    <InstitutionSidebar isOpen={isSidebar} onClose={() => setIsSidebar(false)}
                        // onClick={handleSidebar}
                    />
                )}
        </header>
    );
}