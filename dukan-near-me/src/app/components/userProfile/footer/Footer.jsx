"use client"

import React, { useEffect, useState } from 'react'
import { SendHorizontal, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from "next/navigation";

export default function Footer() {
    const router = useRouter();
    const [role, setRole] = useState("");

    useEffect(() => {
        const fetchUserRole = async () => {
        try {
            const res = await fetch("/api/users/me");
            const data = await res.json();
            setRole(data.role);
        } catch (error) {
            console.error("Error fetching user role:", error);
        }
        };
        fetchUserRole();
    }, []);

    const handleAccountRedirect = () => {
        if (role === "USER") {
        router.push("/userProfile");
        } else if (role === "SHOP_OWNER" || role === "INSTITUTION") {
        router.push("/partnerProfile");
        } else {
        router.push("/login");
        }
    };

  return (
      <footer className='flex flex-col justify-around items-center bg-black p-6 md:px-8 md:pt-12 md:pb-6 gap-6 md:gap-8 text-white font-[var(--font-poppins)]'>
        <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6 w-full'>
            {/* <div className='gap-y-2'>
                <h3 className="font-bold text-md md:text-xl pb-2.5">Exclusive</h3>
                <p className="font-semibold text-md">Subscribe</p>
                <p className='text-xs md:text-sm p-1'>Get 10% off your first order</p>
                <div className="flex items-center border-[1.5px] border-gray-400 p-1 md:p-2 text-xs md:text-sm w-[80%] gap-2 rounded-sm">
                    <div className="flex-grow">
                        <input type="email" placeholder="Enter your email" className="bg-transparent w-full outline-none" />
                    </div>
                    <button className="text-xl">
                        <SendHorizontal size={20} strokeWidth={1.5} className=' cursor-pointer' />      
                    </button>
                </div>
            </div> */}
            <div className='gap-y-2 text-md md:text-center'>
                <h3 className="font-semibold text-lg md:text-xl pb-2.5">Account</h3>
                <span onClick={handleAccountRedirect} className="block text-xs md:text-sm p-1 cursor-pointer transition-all ease-in-out duration-500 hover:text-teal-400">My Account</span>
                <Link href="/getstarted" className="block text-xs md:text-sm p-1 cursor-pointer transition-all ease-in-out duration-500 hover:text-teal-400">Login / SignUp</Link>
                <Link href="/favprofile" className="block text-xs md:text-sm p-1 cursor-pointer transition-all ease-in-out duration-500 hover:text-teal-400">My Sellers</Link>
            </div>
            <div className='gap-y-2 text-md md:text-center'>
                <h3 className="font-semibold text-lg md:text-xl pb-2.5">Quick Link</h3>
                    <Link href="/aboutus#help" className="block text-xs md:text-sm p-1 cursor-pointer transition-all ease-in-out duration-500 hover:text-teal-400">Help</Link>
                    <Link href="/terms&condition#privacy-policy" className="block text-xs md:text-sm p-1 cursor-pointer transition-all ease-in-out duration-500 hover:text-teal-400">Privacy Policy</Link>
                    <Link href="/terms&condition" className="block text-xs md:text-sm p-1 cursor-pointer transition-all ease-in-out duration-500 hover:text-teal-400">Terms Of Use</Link>
                    <Link href="mailto:contact@nearbuydukaan.com" className="block text-xs md:text-sm p-1 cursor-pointer transition-all ease-in-out duration-500 hover:text-teal-400">Contact</Link>
              </div>
            <div className='hidden md:block  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full max-w-5xl mx-auto text-center'>
                <h3 className="font-semibold text-lg md:text-xl pb-2.5">Support</h3>
                <a href="mailto:contact@nearbuydukaan.com" className="text-xs md:text-sm p-1 cursor-pointer transition-all ease-in-out duration-500 hover:text-teal-400">contact@nearbuydukaan.com</a><br />
                <a href="https://www.instagram.com/nearbuydukaan?igsh=Zzl0N3AzN2w1cmRu&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs md:text-sm p-1 transition-all ease-in-out duration-500 hover:text-teal-400 cursor-pointer">
                    Follow us on Instagram
                </a>
            </div>
            {/*download app */}
            {/* <div className='space-y-2 text-center'>
                <h3 className="font-semibold text-lg pb-2.5">Download App</h3>
                <p className="text-sm font-semibold text-gray-800">
                    Save 10% with App New User Only
                </p>
                <div className="flex items-center space-x-3">
                    <div className="w-25 h-25 flex justify-center items-center">
                        <Image src="/footer/Qrcode.svg" alt="QR Code" width={100} height={100} className="object-cover" priority />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Image src="/footer/GooglePlay.svg" alt="Google Play" width={120} height={45} className="object-contain" priority />
                        <Image src="/footer/AppStore.svg" alt="App Store" width={120} height={45} className="object-contain" priority />
                    </div>
                </div>
            </div>   */}          
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full max-w-5xl mx-auto text-center md:hidden'>
                <h3 className="font-semibold text-lg md:text-xl pb-2.5">Support</h3>
                {/* <p className="font-normal text-xs md:text-sm p-1">Delhi Shahdara near Hanuman Mandir.</p> */}
                <a href="mailto:contact@nearbuydukaan.com" className="text-xs md:text-sm p-1 cursor-pointer transition-all ease-in-out duration-500 hover:text-teal-400">contact@nearbuydukaan.com</a>
                <a href="https://www.instagram.com/nearbuydukaan?igsh=Zzl0N3AzN2w1cmRu&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs md:text-sm p-1 transition-all ease-in-out duration-500 hover:text-teal-400 cursor-pointer">
                    Follow us on Instagram
                </a>
        </div>  
        <div className="w-full flex flex-col items-center gap-2 md:gap-4">
            {/* Social Links */}
            <div className="flex gap-x-4">
                {/* <Link href="#" className="text-xl cursor-pointer transition-all ease-in-out duration-500 hover:text-teal-400">
                    <Facebook size={20} strokeWidth={1.5} />
                </Link>
                <Link href="#" className="text-xl cursor-pointer transition-all ease-in-out duration-500 hover:text-teal-400">
                    <Twitter size={20} strokeWidth={1.5} />
                </Link> */}
                <Link
                href="https://www.linkedin.com/in/ajay-sharma-8b7922183/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl cursor-pointer transition-all ease-in-out duration-500 hover:text-teal-400">
                    <Linkedin size={20} strokeWidth={1.5} />
                </Link>

                <Link href="https://www.instagram.com/nearbuydukaan?igsh=Zzl0N3AzN2w1cmRu&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                      className="text-xl cursor-pointer transition-all ease-in-out duration-500 hover:text-teal-400">
                    <Instagram size={20} strokeWidth={1.5} />
                </Link>
            </div>

            {/* Copyright */}
            <div className="relative w-full mt-4">
                <div className="text-sm text-center w-full">
                    © {new Date().getFullYear()} NearBuyDukan. All rights reserved.
                </div>
                <p className="text-xs md:text-sm text-gray-400 font-semibold italic md:absolute md:right-4 md:top-0 mt-2 md:mt-0 text-center md:text-right animate-pulse hover:scale-105 transition-transform duration-500">
                    Local Market, Hyper Services
                </p>
            </div>

        </div>      
          

    </footer>
  )
}
