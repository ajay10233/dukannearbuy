import Link from "next/link";
import SignupForm from "../components/Authentication/Signup/SignupForm";
import Image from 'next/image'

export default function Signup() {
    return (
        <main className="flex min-h-screen w-full bg-[#FFF6F2] font-[var(--font-rubik)]">
            <div className="w-1/2 flex items-center justify-center relative overflow-hidden">
                <div className='bg-[#FCE2CE] w-[350px] h-[563px] rounded-tl-[394px] rounded-tr-[394px] absolute left-[120px] top-[70px]'></div>        
                    <div className="relative">
                        <Image src="/signup-illustration.svg" alt="signup illustration" height={510} width={510} className='object-contain z-10'/>
                    </div>
            </div>
            <div className="flex flex-col justify-center w-1/2 px-16 overflow-hidden">
                <h1 className="text-4xl font-bold text-[#424242] text-center my-1">Create Account</h1>
                {/* signup form */}
                <SignupForm />
                
                <div className="mt-4 flex flex-col items-center justify-center">
                    <span className="px-4 text-lg font-normal tracking-[0.2px] leading-[140%] text-center text-[#553922] opacity-40">- or -</span>
                </div>
                <div className="mt-1 text-center gap-1">
                    <span className='font-normal text-sm tracking-[0.2px] leading-[140%] opacity-40 text-[#553922]'>Already have an account?{' '}</span>
                        <Link href="/login" className="text-[#C3824E] font-semibold text-sm tracking-[0.2px] leading-[140%]">
                            Sign in
                        </Link>
                </div>
            </div>
        </main>
    )
}
