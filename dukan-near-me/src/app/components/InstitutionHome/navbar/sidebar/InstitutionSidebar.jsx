"use client"

import React from 'react'
import { UserRound, X, Home, MessageSquareWarning, QrCode, ScanLine, BookCheck, FolderDown, Settings, LogOut, CircleHelp, Handshake, HandCoins, Info } from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/app/components/LogoutButton';
import { TfiAnnouncement } from "react-icons/tfi";


export default function InstitutionSidebar({ isOpen, onClose }) {
    const pathName = usePathname();

    const handleInviteFriend = () => {
        const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
        const shareUrl = `${baseUrl}/getstarted`;

        if (navigator.share) {
            navigator.share({
                title: "Get Started with Us!",
                url: shareUrl,
            })
            .then(() => console.log("Link shared successfully!"))
            .catch((err) => console.error("Error sharing:", err));
        } else {
            navigator.clipboard.writeText(shareUrl)
            .then(() => toast.success("Link copied to clipboard! 📋"))
            .catch((err) => toast.error("Failed to copy link."));
        }
    };

    return (
        <>
            <div className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-40' : 'opacity-0 pointer-events-none'} z-50 `}
                onClick={onClose}></div>

            <div className={`fixed top-0 right-0 p-4 w-55 md:w-65 h-full flex flex-col bg-white shadow-xl transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-60 `}>
                {/* offcanvas header */}
                <div className="flex justify-between items-center p-2 border-b border-gray-200">
                    {/* <Link href="/institutionProfile" className='hover:text-blue-500 transition duration-200 cursor-pointer'> */}
                        <div className='flex justify-start items-center gap-3'>
                            <UserRound size={28} strokeWidth={2} className="text-blue-700" />
                            <h2 className="text-lg md:text-xl font-bold text-blue-700 uppercase">Profile</h2>
                        </div>
                    {/* </Link> */}
                    <button onClick={onClose} className="text-xl cursor-pointer">
                        <X size={20} strokeWidth={1.5} className='text-gray-600'/>
                    </button>
                </div>

                {/* offcanvas body */}
                <div className="flex flex-col pt-8 px-4 pb-4 space-y-4 flex-grow">
                    <h2 className='font-semibold text-md md:text-lg uppercase text-gray-800'> overview</h2>
                    <div className="flex flex-col space-y-3">

                        {pathName !== "/partnerHome" && (
                            <Link href="/partnerHome"
                                className="flex items-center gap-2 text-sm md:text-[16px] text-gray-700 hover:text-blue-700 transition duration-200">
                                <Home size={20} strokeWidth={1.5} />
                                Home
                            </Link>
                        )}

                        <Link href="/partnerProfile"
                            // href="/search-result"
                            className="flex items-center gap-2 text-sm md:text-[16px] text-gray-700 hover:text-blue-700 transition duration-200">
                            <UserRound size={20} strokeWidth={1.5} />
                                My Profile
                        </Link>
                        {/* <Link href="/chat"
                            className="flex items-center gap-2 text-md text-gray-700 hover:text-blue-700 transition duration-200">
                            <MessageCircleMore size={20} strokeWidth={1.5} />
                                Chats
                        </Link> */}
                        <Link href="/notification"
                            className=" flex items-center gap-2 text-sm md:text-[16px] text-gray-700 hover:text-blue-700 transition duration-200">
                            <MessageSquareWarning size={20} strokeWidth={1.5} />
                            {/* <TfiAnnouncement size={20} strokeWidth={1.5} /> */}
                                Notification
                        </Link>
                        <Link href="/qr-code"
                            className="flex items-center gap-2 text-sm md:text-[16px] text-gray-700 hover:text-blue-700 transition duration-200">
                            <QrCode size={20} strokeWidth={1.5} />
                                My QR         
                        </Link>
                        <Link href="/scan-qr"
                            className="flex items-center gap-2 text-sm md:text-[16px] text-gray-700 hover:text-blue-700 transition duration-200"> 
                            <ScanLine size={20} strokeWidth={1.5} />
                            Scan QR
                        </Link>
                        <Link href="/tokengenerate"
                            className="flex items-center gap-2 text-sm md:text-[16px] text-gray-700 hover:text-blue-700 transition duration-200"> 
                            <HandCoins size={20} strokeWidth={1.5} />
                            Token 
                        </Link>
                        {/* <Link href="#"
                            className="flex items-center gap-2 text-md text-gray-700 hover:text-blue-700 transition duration-200"> 
                            <ScanLine size={20} strokeWidth={1.5} />
                            Token Generate
                        </Link>
                        <Link href="#"
                            className="flex items-center gap-2 text-md text-gray-700 hover:text-blue-700 transition duration-200"> 
                            <ScanLine size={20} strokeWidth={1.5} />
                            Live Token Update
                        </Link> */}
                        <Link href="/billhistory"
                            className="flex items-center gap-2 text-sm md:text-[16px] text-gray-700 hover:text-blue-700 transition duration-200">
                            <BookCheck size={20} strokeWidth={1.5} />
                            Bill History
                        </Link>
                        <Link href="/myplan"
                            className="flex items-center gap-2 text-sm md:text-[16px] text-gray-700 hover:text-blue-700 transition duration-200">
                            <FolderDown size={20} strokeWidth={1.5} />
                            My Plans
                        </Link>
                        {/* <Link href="#"
                            className="flex items-center gap-2 text-md text-gray-700 hover:text-blue-700 transition duration-200">
                            <TableOfContents size={20} strokeWidth={1.5} />
                            FAQ
                        </Link> */}
                    </div>
                </div>

                <div className='flex flex-col p-4 border-t border-gray-200 space-y-3'>
                    <Link href="/aboutus"
                        className="flex items-center gap-2 text-sm md:text-[16px] text-gray-700 hover:text-blue-700 transition duration-200">
                        <Info size={20} strokeWidth={1.5} />
                            About us
                    </Link>
                    <span onClick={handleInviteFriend}
                        className="flex items-center gap-2 cursor-pointer text-sm md:text-[16px] text-gray-700 hover:text-blue-700 transition duration-200">
                        <Handshake size={20} strokeWidth={1.5} />
                            Invite a Friend
                    </span>
                </div>

                {/* offcanvas footer */}
                <div className='flex flex-col px-4 pt-4 border-t border-gray-200 space-y-3'>
                    {/* <Link href="#"
                        className="flex items-center gap-2 text-sm md:text-[16px] text-gray-700 hover:text-blue-700 transition duration-200">
                        <Settings size={20} strokeWidth={1.5} />
                            Settings
                    </Link> */}
                    <Link href="#"
                        className="flex items-center gap-2 text-sm md:text-[16px] text-red-500">
                        {/* <LogOut size={20} strokeWidth={1.5} /> */}
                            <LogoutButton onClose={onClose}/>
                    </Link>
                </div>
            </div>
        </>
    )
}