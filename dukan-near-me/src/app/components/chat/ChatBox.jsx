"use client"

import Image from 'next/image'
import React, { useState } from 'react'
import { Heart, Plus, LockKeyhole, SmilePlus, MapPin } from "lucide-react";
import Link from 'next/link';

export default function ChatBox() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'Shalu the Seller',
            text: "Hey I'm having one doubt can you solve.",
            time: '2 days ago',
            incoming: true
        },
        {
            id: 2,
            receiver: 'Shivam',
            text: "No i am a sigma guy i don't reply to girls ",
            time: '2 days ago',
            incoming: false
        },
    ]);

    return (
        <>
        {/* chat box */}
        <main className='w-3/4 flex flex-col bg-[#FAFAFA]'>
            {/* chat header */}
            <header className="flex items-center justify-between p-4 gap-2.5 bg-[#F7F7FC]">
                <div className='flex items-center gap-3'>
                    <div className='relative w-10 h-10'>
                        <Image src="chatUserSvg/userImage.svg" alt="seller image" fill className="rounded-lg" priority/>      
                    </div>        
                      <div className='gap-1'> 
                        <p className="text-[var(--chatText-color)] text-lg flex items-center gap-2">
                            Shalu the Seller
                            <Heart size={20} color="#DA3036" strokeWidth={1.5} className='cursor-pointer'/>  
                        </p>
                        <p className="text-sm text-green-500">Online</p>
                    </div>
                </div>
                <div className='flex items-center gap-3'>
                    <button className='bg-[var(--chat-color)] text-white gap-2.5 rounded-xl p-3 font-medium text-sm flex items-center cursor-pointer hover:bg-[#128c7eeb] transition'>
                        <Plus size={18} strokeWidth={1.5} color="#fff" />
                        Payment History
                    </button>
                </div>
            </header>

            {/* message container */}
            <div className='flex-1 pt-1.5 pb-4 px-4 overflow-y-auto flex flex-col gap-3'>
                {/* Encryption message */}
                <div className='flex justify-center'>
                    <span className="bg-[var(--encryptionBg-color)] text-[var(--encryptionText-color)] text-sm py-2.5 px-3.5 flex items-center gap-2 rounded-xl">
                        <LockKeyhole size={20} strokeWidth={1.5} />
                        Chats will be automatically deleted after 48 hours of last chat
                    </span>
                </div>

                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.incoming ? 'justify-start' : 'justify-end'}` }>
                        <div className={`p-4 ${msg.incoming ? 'bg-white' : 'bg-[#D7F8F4]'} 
                            ${ msg.incoming ? 'rounded-tl-2xl rounded-tr-2xl rounded-br-2xl' 
                                : 'rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl'}`}>
                            <p className='text-[#010101] opacity-85 font-normal text-sm'>{msg.text}</p>
                            <span className="text-xs text-[#0B3048] opacity-70 block text-right">{msg.time}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* chat footer  */}
            <footer className="p-4 flex items-center bg-[#F6F6F6] gap-3">
                <div className='gap-4'>
                    <button className="p-2 cursor-pointer">
                          <SmilePlus size={20} strokeWidth={1.5} color="#130F26" />
                    </button>
                    <button className="p-2 cursor-pointer">
                        <MapPin size={20} strokeWidth={1.5} color="#130F26" />
                    </button>
                </div>
                <input type="text"
                        placeholder="Type a message..."
                        className="flex-1 py-2 px-4 rounded-full bg-white focus:outline-none shadow-sm"/>
            </footer>
        </main>    
    </>
   )
}

