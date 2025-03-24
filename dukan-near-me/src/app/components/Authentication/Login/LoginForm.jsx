"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/validation";
import toast from "react-hot-toast";
import Image from "next/image";
import { useState } from "react";

export default function LoginForm() {
  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: zodResolver(loginSchema)
  })
  const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    if(data){
      const {email, password} = data;
      
      const toastId = toast.loading('Processing...');
      try {
        const res = await signIn("credentials", {
          redirect: false,
          email,
          password
        });
        if(res.status === 200){
          toast.success('Login successfully!', {id: toastId})
          router.push("/dashboard");
        }else{
          toast.error(res.error, {id: toastId})
        }
      } catch (error) {
        toast.error(res.error || 'Auth error', {id: toastId})
        console.log(error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-96 mx-auto mt-10">
        {/* Email input */}
        <div className="flex flex-col mb-6">
            <label className="absolute top-[26%] left-[13.5%] z-10 px-3 bg-[#FFF6F2] text-[19px] font-medium text-[#757575] tracking-[0.2px] leading-[120%]">Email</label>
            <div className="relative flex justify-center items-center">
                <span className="w-full absolute left-0 flex items-center pl-4">
                    <Image src="/mail.svg" width={22} height={22} alt="emailIcon" className="text-[#616161]"/>
                </span>
                <input className="w-full text-[#757575] text-sm border rounded-[63px] bg-[#FFF6F2] border-[#757575] pl-10 p-2.5 m-1 tracking-[0.2px] leading-[140%] cursor-pointer active:bg-[#FFF6F2] focus:border focus:border-[#757575] focus:outline-0"
                    type="email"
                    name="email"
                    placeholder="email@gmail.com" {...register('email')} />
            </div>
            <p className={`${errors?.email ? `visible` : `invisible`} pl-2 text-red-500 text-sm`}>{errors?.email?.message || `Error`}</p>
        </div>
          
        {/* password input */}
        <div className="flex flex-col">
            <label className="absolute top-[42%] left-[13.5%] z-10 px-3 bg-[#FFF6F2] text-[19px] font-medium text-[#757575] tracking-[0.2px] leading-[120%]">Password</label>
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
        </div>

        {/*Forgot password  */}
        <div className="flex justify-end mt-2 font-semibold tracking-[0.2px] leading-[140%] cursor-pointer">
              <a href="#" className="text-sm text-[#616161]"> Forgot Password? </a>
        </div>  
          
        <button type="submit" className="bg-[#FCE2CE] p-2 rounded-[128px] font-semibold text-[#92613A] text-xl tracking-[0.2px] leading-[140%] mt-8 cursor-pointer">Login</button>
    </form>
  );
}

