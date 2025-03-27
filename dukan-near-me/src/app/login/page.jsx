"use client"
import LoginForm from '../components/Authentication/Login/LoginForm'
import Image from 'next/image'

export default function page() {
    return (
        <main className="flex min-h-screen w-full overflow-hidden">
            <div className="flex flex-col items-center justify-center w-1/2 gap-y-10">
                <h1 className="text-4xl font-bold">Welcome!</h1>
                <LoginForm />
            </div>
  
            {/* Right Side  */}
            <div className="w-1/2 flex items-center justify-center relative overflow-hidden">
                <div className='bg-[var(--secondary-color)] w-[350px] h-screen rounded-t-[394px] translate-y-20'>
                    <div className="relative -translate-x-20 w-[380px] h-[510px]">
                        <Image src="/auth-illustration/login-illustration.svg" alt="signup illustration" fill sizes="480px" priority/>
                    </div>
                </div>
            </div>
        </main>
  
    )
}
