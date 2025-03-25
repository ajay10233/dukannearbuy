"use client"

import React from 'react'
import LoginForm from '../components/Authentication/Login/LoginForm'
import Image from 'next/image'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

export default function page() {
    return (
        <main className="flex min-h-screen w-full bg-[#FFF6F2] font-[var(--font-rubik)]">
            <div className="flex flex-col justify-center items-center w-1/2 px-16 gap-4">
                <h1 className="text-4xl font-bold text-[#424242] text-center ">Welcome Back!!</h1>
                {/* Form */}
                <LoginForm />
  
                <div className="gap-4 flex flex-col items-center justify-center">
                    <span className="px-4 text-lg font-normal tracking-[0.2px] leading-[140%] text-center text-[#553922] opacity-40">- or -</span>
                    {/* Social Logins */}
                    <div className="flex gap-6">
                        <button onClick={() => signIn("google")} className="p-[15px] cursor-pointer">
                            <Image src="/google.svg" alt="Google Icon" width={22} height={22}/>
                        </button>
                        <button onClick={() => signIn("facebook")} className="p-[15px] cursor-pointer">
                            <Image src="/facebook.svg" alt="Facebook Icon" width={22} height={22}/>
                        </button>
                        <button onClick={() => signIn("apple")} className="p-[15px] cursor-pointer">
                            <Image src="/apple.svg" alt="Apple Icon" width={22} height={22}/>
                        </button>
                    </div>
                </div>
        
                <div className="text-center gap-1">
                    <span className='font-normal text-sm tracking-[0.2px] leading-[140%] opacity-40 text-[#553922]'>Don't have an account?{' '}</span>
                    <Link href="/signup" className="text-[#C3824E] font-semibold text-sm tracking-[0.2px] leading-[140%]">
                        Sign up
                    </Link>
                </div>
            </div>
  
            {/* Right Side  */}
            <div className="w-1/2 flex items-center justify-center relative overflow-hidden">
                <div className='bg-[#FCE2CE] w-[350px] h-[563px] rounded-tl-[394px] rounded-tr-[394px] absolute left-[45%] top-[60px]'></div>        
                    <div className="relative">
                        <Image src="/login-illustration.svg" fill sizes='435px 435px' alt="Login illustration" className='object-contain z-10' priority/>
                    </div>
            </div>
        </main>
  
    )
}