"use client"

import { useRouter } from "next/navigation";
import { signupSchema } from "@/schemas/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { useState } from "react";

export default function SignupForm() {
  const {register, handleSubmit, formState: {errors}, watch} = useForm({
    resolver: zodResolver(signupSchema)
  })
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data) => {
    console.log(data);
    if(data){
      const toastId = toast.loading('Processing...');
      try {
        const res = await axios.post('/api/auth/signup', data, {role: 'USER'});
        if(res.status === 200){
          toast.success('Register successfully!', {id: toastId});
          router.push("/login");
        }else{
          toast.error(`Something went wrong!`, {id: toastId})
        }
      } catch (error) {
        toast.error(`Api error!`, {id: toastId})
        console.log(error);
        
      }
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-96 mx-auto mt-8">
        <div className="flex gap-2 mb-2">
            {/* first name  */}
            <div className="flex flex-col w-[187px]">
                <label className="absolute top-[19%] right-[28%] z-10 px-3 bg-[#FFF6F2] text-[19px] font-medium text-[#757575] tracking-[0.2px] leading-[120%]">First Name</label>      
                <div className="relative flex justify-center items-center">
                    <span className="w-full absolute left-0 flex items-center pl-4">
                        <Image src="/mail.svg" width={22} height={22} alt="FirstName" className="text-[#616161]"/>
                    </span>
                    <input className="w-full text-[#757575] text-sm border rounded-[63px] bg-[#FFF6F2] border-[#757575] pl-10 p-2.5 m-1 tracking-[0.2px] leading-[140%] cursor-pointer active:bg-[#FFF6F2] focus:border focus:border-[#757575] focus:outline-0"
                        type="text"
                        name="firstName"
                        placeholder="Enter first name" {...register('firstName')} />
                </div>
                <p className={`${errors?.firstName ? `visible` : `invisible`} text-red-500 text-sm`}>
                    {errors?.firstName?.message || `Error`}
                </p>
            </div>
              
            {/* last name */}
            <div className="flex flex-col w-[187px]">
                <label className="absolute top-[19%] right-[13%] z-10 px-3 bg-[#FFF6F2] text-[19px] font-medium text-[#757575] tracking-[0.2px] leading-[120%]">Last Name</label>      
                <div className="relative flex justify-center items-center">
                    <span className="w-full absolute left-0 flex items-center pl-4">
                        <Image src="/mail.svg" width={22} height={22} alt="FirstName" className="text-[#616161]"/>
                    </span>     
                    <input className="w-full text-[#757575] text-sm border rounded-[63px] bg-[#FFF6F2] border-[#757575] pl-10 p-2.5 m-1 tracking-[0.2px] leading-[140%] cursor-pointer active:bg-[#FFF6F2] focus:border focus:border-[#757575] focus:outline-0"
                        type="text"
                        name="lastName"
                          placeholder="Enter last name" {...register('lastName')} />
                </div>      
                <p className={`${errors?.lastName ? `visible` : `invisible`} text-red-500 text-sm`}>
                    {errors?.lastName?.message || `Error`}
                </p>
            </div>
        </div>

            {/* Phone number */}
            <div className="flex flex-col mb-2">
                <label className="absolute top-[32%] right-[28%] z-10 px-3 bg-[#FFF6F2] text-[19px] font-medium text-[#757575] tracking-[0.2px] leading-[120%]">Phone no</label>
                    <div className="relative flex justify-center items-center">
                        <span className="w-full absolute left-0 flex items-center pl-4">
                            <Image src="/phone.svg" width={22} height={22} alt="emailIcon" className="text-[#616161]"/>
                        </span>
                    <input className="w-full text-[#757575] text-sm border rounded-[63px] bg-[#FFF6F2] border-[#757575] pl-10 p-2.5 m-1 tracking-[0.2px] leading-[140%] cursor-pointer active:bg-[#FFF6F2] focus:border focus:border-[#757575] focus:outline-0"
                        type="text"
                        name="phone"
                        placeholder="Enter your phone number" {...register('phone')} maxLength={10} />
                </div>
                <p className={`${errors?.phone ? `visible` : `invisible`} text-red-500 text-sm`}>{errors?.phone?.message || `Error`}</p>
            </div>

            {/* Email */}
            <div className="flex flex-col mb-2">
                <label className="absolute top-[45%] right-[31%] z-10 px-3 bg-[#FFF6F2] text-[19px] font-medium text-[#757575] tracking-[0.2px] leading-[120%]">Email</label>
                <div className="relative flex justify-center items-center">
                    <span className="w-full absolute left-0 flex items-center pl-4">
                        <Image src="/mail.svg" width={22} height={22} alt="emailIcon" className="text-[#616161]"/>
                    </span>
                    <input className="w-full text-[#757575] text-sm border rounded-[63px] bg-[#FFF6F2] border-[#757575] pl-10 p-2.5 m-1 tracking-[0.2px] leading-[140%] cursor-pointer active:bg-[#FFF6F2] focus:border focus:border-[#757575] focus:outline-0"
                        type="email"
                        name="email"
                        placeholder="email@gmail.com" {...register('email')} />
                </div>  
                <p className={`${errors?.email ? `visible` : `invisible`} text-red-500 text-sm`}>{errors?.email?.message || `Error`}</p>
            </div>
          
            {/* password */}
            <div className="flex flex-col">
                <label className="absolute bottom-[38%] right-[28%] z-10 px-3 bg-[#FFF6F2] text-[19px] font-medium text-[#757575] tracking-[0.2px] leading-[120%]">Password</label>
                <div className="relative flex justify-center items-center">
                    <span className="w-full absolute left-0 flex items-center pl-4">
                        <Image src="/lock-password.svg" width={22} height={22} alt="passwordIcon" className="text-[#9E9E9E]"/>
                    </span>
                    <input className="w-full text-[#9E9E9E] text-sm border rounded-[63px] bg-[#FFF6F2] border-[#757575] pl-10 p-2.5 m-1 tracking-[0.2px] leading-[140%] cursor-pointer focus:border focus:border-[#757575] focus:outline-0"
                        type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password" {...register('password')} />
                    <span onClick={() => setShowPassword(!showPassword)} className="w-full absolute left-[85%] flex items-center pl-4 cursor-pointer">
                        <Image src={showPassword ? "/view-password.svg" : "/view-off-slash.svg"} width={18} height={18} alt="toggle password visibilty" className="text-[#9E9E9E] opacity-80"/>
                    </span>
                </div>
                <p className={`${errors?.password ? `visible` : `invisible`} text-red-500 text-sm`}>{errors?.password?.message || `Error`}</p>
            </div>               
            {/* Signup button  */}
        <button type="submit" className="bg-[#FCE2CE] p-2 rounded-[128px] font-semibold text-[#92613A] text-xl tracking-[0.2px] leading-[140%] mt-4 cursor-pointer transition transform active:scale-90 duration-150 ease-out">Sign Up</button>
    </form>
  )
}
