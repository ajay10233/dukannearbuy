import React from 'react'
import { SendHorizontal } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className='flex justify-around items-center bg-[var(--secondary-color)] px-8 py-12 text-black font-[var(--font-poppins)]'>
        <div className='grid grid-cols-5 gap-6 w-full'>
            <div className='space-y-2'>
                <h3 className="font-bold text-xl pb-2.5">Exclusive</h3>
                <p className="font-semibold">Subscribe</p>
                <p className='text-sm'>Get 10% off your first order</p>
                <div className="flex items-center border-[1.5px] border-black p-2 w-[80%] gap-2 rounded-sm">
                    <div className="flex-grow">
                        <input type="email" placeholder="Enter your email" className="bg-transparent w-full outline-none" />
                    </div>
                    <button className="text-xl">
                        <SendHorizontal size={20} strokeWidth={1.5} className=' cursor-pointer' />      
                    </button>
                </div>
            </div>
            <div className='space-y-2 text-center'>
                <h3 className="font-semibold text-lg pb-2.5">Support</h3>
                <p className="font-normal text-sm">Delhi Shadhara near Hanuman Mandir.</p>
                <p className="text-sm">connect2025@gmail.com</p>
                <p className="text-sm">+11111-22222-33333</p>
            </div>
            <div className='space-y-2 text-center'>
                <h3 className="font-semibold text-lg pb-2.5">Account</h3>
                <Link href="#" className="block text-sm">My Account</Link>
                <Link href="/getstarted" className="block text-sm">Login / SignUp</Link>
                <Link href="#" className="block text-sm">My Sellers</Link>
                <Link href="#" className="block text-sm">Near Shop</Link>
            </div>
            <div className='space-y-2 text-center'>
                <h3 className="font-semibold text-lg pb-2.5">Quick Link</h3>
                <Link href="#" className="block text-sm">Privacy Policy</Link>
                <Link href="#" className="block text-sm">Terms Of Use</Link>
                <Link href="#" className="block text-sm">FAQ</Link>
                <Link href="#" className="block text-sm">Contact</Link>
            </div>
              {/*download app */}
            <div className='space-y-2 text-center'>
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
            </div>  
        </div>        
    </footer>
  )
}
