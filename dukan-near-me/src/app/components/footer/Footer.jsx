import React from 'react'
import { SendHorizontal } from "lucide-react";
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='flex justify-around items-center bg-[var(--secondary-color)] p-8 text-black font-[var(--font-poppins)]'>
        <div className='grid grid-cols-5 gap-4 w-full'>
            <div className='space-y-2'>
                <h3 className="font-bold text-xl">Exclusive</h3>
                <p className="font-semibold">Subscribe</p>
                <p className='text-sm'>Get 10% off your first order</p>
                <div className="flex items-center border border-black py-2 pl-4 pr-2 w-full gap-2">
                    <input type="email" placeholder="Enter your email" className="bg-transparent flex-grow outline-none" />
                    <button className="text-xl">
                        <SendHorizontal size={20} strokeWidth={1.5} />      
                    </button>
                </div>
            </div>
            <div className='space-y-2 text-center'>
                <h3 className="font-semibold text-lg">Support</h3>
                <p className="font-normal text-sm">Delhi Shadhara near Hanuman Mandir.</p>
                <p className="text-sm">connect2025@gmail.com</p>
                <p className="text-sm">+11111-22222-33333</p>
            </div>
            <div className='space-y-2 text-center'>
                <h3 className="font-semibold text-lg">Account</h3>
                <Link href="#" className="block text-sm">My Account</Link>
                <Link href="/getstarted" className="block text-sm">Login / SignUp</Link>
                <Link href="#" className="block text-sm">My Sellers</Link>
                <Link href="#" className="block text-sm">Near Shop</Link>
            </div>
            <div className='space-y-2 text-center'>
                <h3 className="font-semibold text-lg">Quick Link</h3>
                <Link href="#" className="block text-sm">Privacy Policy</Link>
                <Link href="#" className="block text-sm">Terms Of Use</Link>
                <Link href="#" className="block text-sm">FAQ</Link>
                <Link href="#" className="block text-sm">Contact</Link>
            </div>
            {/*download app */}
              
        </div>      
      
    </footer>
  )
}
