"use client"

import React from 'react'
import { UserRound, X, MessageCircleMore, Home, MessageSquareWarning, QrCode, ScanLine, BookCheck, FolderDown, Settings, LogOut } from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ isOpen, onClose }) {
    const pathName = usePathname();
    return (
        <>
            <div className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-40' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}></div>

            <div className={`fixed top-0 right-0 p-4 w-75 h-full flex flex-col bg-white shadow-xl transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* offcanvas header */}
                <div className="flex justify-between items-center p-2 border-b border-gray-200">
                    <Link href="/userProfile" className='hover:text-blue-500 transition duration-200 cursor-pointer'>
                        <div className='flex justify-start items-center gap-3'>
                            <UserRound size={28} strokeWidth={2} className="text-blue-700" />
                            <h2 className="text-xl font-bold text-blue-700 uppercase">Profile</h2>
                        </div>
                    </Link>
                    <button onClick={onClose} className="text-xl cursor-pointer">
                        <X size={20} strokeWidth={1.5} className='text-gray-600'/>
                    </button>
                </div>

                {/* offcanvas body */}
                <div className="flex flex-col pt-8 px-4 pb-4 space-y-4 flex-grow">
                    <h2 className='font-semibold  text-lg uppercase text-gray-800'> overview</h2>
                    <div className="flex flex-col space-y-3">

                        {pathName !== "#" && (
                            <Link href="#"
                                className="flex items-center gap-2 text-md text-gray-700 hover:text-blue-700 transition duration-200">
                                <Home size={20} strokeWidth={1.5} />
                                Home
                            </Link>
                        )}

                        <Link href="/institutionProfile"
                            className="flex items-center gap-2 text-md text-gray-700 hover:text-blue-700 transition duration-200">
                            <MessageCircleMore size={20} strokeWidth={1.5} />
                                My Profile
                        </Link>
                        <Link href="/chat"
                            className="flex items-center gap-2 text-md text-gray-700 hover:text-blue-700 transition duration-200">
                            <MessageCircleMore size={20} strokeWidth={1.5} />
                                Chats
                        </Link>
                        <Link href="#"
                            className=" flex items-center gap-2 text-md text-gray-700 hover:text-blue-700 transition duration-200">
                            <MessageSquareWarning size={20} strokeWidth={1.5} />
                                Notification
                        </Link>
                        <Link href="#"
                            className="flex items-center gap-2 text-md text-gray-700 hover:text-blue-700 transition duration-200">
                            <QrCode size={20} strokeWidth={1.5} />
                                My QR         
                        </Link>
                        <Link href="#"
                            className="flex items-center gap-2 text-md text-gray-700 hover:text-blue-700 transition duration-200"> 
                            <ScanLine size={20} strokeWidth={1.5} />
                            Scan QR
                        </Link>
                        <Link href="#"
                            className="flex items-center gap-2 text-md text-gray-700 hover:text-blue-700 transition duration-200"> 
                            <ScanLine size={20} strokeWidth={1.5} />
                            My Token
                        </Link>
                        <Link href="#"
                            className="flex items-center gap-2 text-md text-gray-700 hover:text-blue-700 transition duration-200">
                            <BookCheck size={20} strokeWidth={1.5} />
                            Bill Record
                        </Link>
                        <Link href="#"
                            className="flex items-center gap-2 text-md text-gray-700 hover:text-blue-700 transition duration-200">
                            <FolderDown size={20} strokeWidth={1.5} />
                            My Plans
                        </Link>
                    </div>
                </div>

                {/* offcanvas footer */}
                <div className='flex flex-col p-4 border-t border-gray-200 space-y-3'>
                    <Link href="#"
                        className="flex items-center gap-2 text-md text-gray-700 hover:text-blue-700 transition duration-200">
                        <Settings size={20} strokeWidth={1.5} />
                            Settings
                    </Link>
                    <Link href="#"
                        className="flex items-center gap-2 text-md text-red-500">
                        <LogOut size={20} strokeWidth={1.5} />
                            Logout
                    </Link>
                </div>
            </div>
        </>
    )
}