"use client"

import Image from 'next/image'
import { MoveLeft, Search } from "lucide-react";
import Link from 'next/link';
import { useState } from 'react';

export default function SidebarChat() {
    const [activeTab, setActiveTab] = useState("seller");

  return (
      <>
        {/* sidebar chat  */}
        <aside className='w-1/4 bg-[#F5FAFC] p-4 flex flex-col gap-4'>
            {/* search bar  */}
            <div className="flex items-center gap-2">
                <button className="p-2 cursor-pointer">
                    <MoveLeft size={20} strokeWidth={1.5} />
                </button>
                <div className="flex-1 flex items-center gap-2 bg-white px-4 py-3 rounded-3xl border border-[#D1E4E8]">
                    <Search size={20} strokeWidth={1.5}  color='#9393C1' />
                    <input type="text"
                            placeholder="Search or start a new chat"
                            className="bg-transparent outline-none text-sm flex-1 cursor-pointer"/>
                </div>
            </div>
              
            {/* toggle tab */}
            <div className='flex items-center justify-center w-full'>
                <button className={`w-1/2 flex items-center justify-center py-3 px-4 gap-2.5 rounded-tl-xl rounded-bl-xl transition-all duration-500 cursor-pointer ${activeTab === "seller" ? "bg-[var(--chat-color)] text-white font-semibold" : "bg-white text-[#7D7D7D] font-normal"}`}
                    onClick={() => setActiveTab("seller")}>
                    Select a seller      
                </button>
                <button className={`w-1/2 flex items-center justify-center py-3 px-4 gap-2.5 rounded-tr-xl rounded-br-xl transition-all duration-500 cursor-pointer ${activeTab === "favourite" ? "bg-[var(--chat-color)] text-white font-semibold" : "bg-white text-[#7D7D7D] font-normal"}`}
                    onClick={() => setActiveTab("favourite")}>
                    Favourite      
                </button>
            </div>  

            <div className='w-full'>
                <div className='flex justify-between gap-2.5 py-2'>
                    <div className='relative w-14 h-14'>
                        <Image src="/chatUserSvg/userImage.svg" alt="seller image" fill className="rounded-md object-cover" priority />
                    </div>
                    <div className="flex flex-col justify-center gap-1 flex-grow">
                        <Link href="#" className="font-medium text-[var(--chatText-color)]">Piyush Singh</Link>
                        <span className="text-[var(--chatText-color)] font-normal text-[12px]">Haha oh man</span>
                    </div>
                    <div className="flex flex-col items-end justify-center gap-1">
                        <span className="text-[var(--chat-color)] text-sm">08:20 pm</span>
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 flex items-center justify-center bg-[var(--chat-color)] text-white text-xs rounded-full">
                                1
                            </div>
                        </div>
                    </div>    
                </div>     
            </div>
        </aside>
    </>
  )
}
