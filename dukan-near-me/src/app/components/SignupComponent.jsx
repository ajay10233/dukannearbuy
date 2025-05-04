"use client"; 

import Image from "next/image";
import SignupForm from "@/app/components/Authentication/Signup/SignupForm";

export default function Signup() {
    return (
        <div className="bg-gradient-to-bl from-[#e7f0ec] via-[#aabec2] to-[#005d6e]">
            <header>
                <div className="w-full p-4 flex items-center gap-x-2">
                    <div className="relative w-10 h-10">
                        <Image src="/nearbuydukan-Logo/Logo.svg" alt="nearbuydukan" fill sizes='50px' priority/>
                    </div>
                    <span className="font-semibold text-sm uppercase">nearbuydukan</span>
                </div>
            </header>
            <main className="flex h-[calc(100vh-72px)] w-full font-[var(--font-rubik)]">
            <div className="w-1/2 hidden md:flex items-center justify-center relative overflow-hidden">
                {/* <div className='bg-[var(--secondary-color)] w-[350px] h-screen rounded-tl-[394px] rounded-tr-[394px] translate-y-20'> */}
                    <div className="relative translate-x-2 w-[480px] h-[510px]">
                        <Image src="/signup-illustration.svg" alt="signup illustration" fill sizes="510px" priority />
                    </div>
                {/* </div> */}
            </div>
            <div className="flex flex-col w-full md:w-1/2 items-center justify-center gap-y-2 md:gap-y-7 overflow-hidden">
                <h1 className="text-3xl md:text-4xl font-bold text-[#424242] text-center my-1">Create Account</h1>
                <SignupForm />
            </div>
            </main>
        </div>
    );
}
