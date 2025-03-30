"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { signupSchema } from "@/schemas/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useBoolToggle } from "react-haiku";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    resolver: zodResolver(signupSchema),
  });
  const [show, setShow] = useBoolToggle()

  const router = useRouter();

  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  

  const onSubmit = async (data) => {
    if (data) {
      const toastId = toast.loading("Processing...");
      try {
        const res = await axios.post("/api/auth/signup", data, { role });
        if (res.status === 200) {
          toast.success("Register successfully!", { id: toastId });
          router.push("/login");
        } else {
          toast.error(`Something went wrong!`, { id: toastId });
        }
      } catch (error) {
        toast.error(`Api error!`, { id: toastId });
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (!role) {
      router.push("/getstarted");
    }
  }, [role, router]);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-y-7 w-3/5 items-center"
    >
      <div className="flex flex-col gap-y-3 text-[var(--withdarktext)]">

        {/* First Name and Last Name */}
        <div className="flex *:w-1/2 gap-x-3">
            <div className="flex flex-col">
                <div className="flex flex-col relative">
                    <input type="text" id="firstName" className="capitalize w-full border rounded-full outline-none px-5 py-2.5 peer text-[var(--withdarkinnertext)]"  {...register('firstName')}/>
                    <label htmlFor="firstName" className={`"capitalize absolute top-1/2 -translate-y-1/2 left-5 bg-[var(--background)] px-1 transition-all duration-200 peer-focus:-translate-y-8.5 peer-focus:scale-90 peer-focus:-translate-x-2 ${watch("firstName") && `-translate-x-2 scale-90 -translate-y-8.5`}`}>First Name</label>
                </div>
                <p className={`${errors?.firstName ? `visible` : `invisible`} pl-2 text-red-500 text-sm`}>{errors?.firstName?.message || `Error`}</p>
            </div>
            <div className="flex flex-col">
                <div className="flex flex-col relative">
                    <input type="text" id="lastName" className="capitalize w-full border rounded-full outline-none px-5 py-2.5 peer text-[var(--withdarkinnertext)]"  {...register('lastName')}/>
                    <label htmlFor="lastName" className={`capitalize absolute top-1/2 -translate-y-1/2 left-5 peer-focus:-translate-y-8.5 peer-focus:scale-90 peer-focus:-translate-x-2 bg-[var(--background)] px-1 transition-all duration-200 ${watch("lastName") && `-translate-x-2 scale-90 -translate-y-8.5`}`}>last Name</label>
                </div>
                <p className={`${errors?.lastName ? `visible` : `invisible`} pl-2 text-red-500 text-sm`}>{errors?.lastName?.message || `Error`}</p>
            </div>
        </div>

        {/* Email */}
        <div className="flex flex-col">
            <div className="flex flex-col relative">
                <input type="text" id="email" className="lowercase w-full border rounded-full outline-none px-5 py-2.5 peer text-[var(--withdarkinnertext)]" {...register('email')}/>
                <label htmlFor="email" className={`capitalize absolute top-1/2 -translate-y-1/2 left-5 peer-focus:-translate-y-8.5 peer-focus:scale-90 peer-focus:-translate-x-2 bg-[var(--background)] px-1 transition-all duration-200 ${watch("email") && `-translate-x-2 scale-90 -translate-y-8.5`}`}>email</label>
            </div>
            <p className={`${errors?.email ? `visible` : `invisible`} pl-2 text-red-500 text-sm`}>{errors?.email?.message || `Error`}</p>
        </div>

        {/* Phone */}
        <div className="flex flex-col">
            <div className="flex flex-col relative">
                <input type="text" id="phone" className="w-full border rounded-full outline-none px-5 py-2.5 peer text-[var(--withdarkinnertext)]" {...register('phone')} onChange={(e) => setValue("phone", e.target.value.replace(/\D/g, ""))} maxLength={10}/>
                <label htmlFor="phone" className={`capitalize absolute top-1/2 -translate-y-1/2 left-5 peer-focus:-translate-y-8.5 peer-focus:scale-90 peer-focus:-translate-x-2 bg-[var(--background)] px-1 transition-all duration-200 ${watch("phone") && `-translate-x-2 scale-90 -translate-y-8.5`}`}>phone</label>
            </div>
            <p className={`${errors?.phone ? `visible` : `invisible`} pl-2 text-red-500 text-sm`}>{errors?.phone?.message || `Error`}</p>
        </div>

        {/* Password */}
        <div className="flex flex-col">
            <div className="flex flex-col relative">
                <input type={!show ? "password" : "text"} id="password" className="w-full border rounded-full outline-none px-5 py-2.5 pr-14 peer text-[var(--withdarkinnertext)]" {...register('password')}/>
                <label htmlFor="password" className={`capitalize absolute top-1/2 -translate-y-1/2 left-5 peer-focus:-translate-y-8.5 peer-focus:scale-90 peer-focus:-translate-x-2 bg-[var(--background)] px-1 transition-all duration-200 ${watch("password") && `-translate-x-2 scale-90 -translate-y-8.5`}`}>password</label>
                <span className="absolute right-5 top-1/2 -translate-y-1/2">{show ? <Eye size={20} onClick={() => setShow()}/> : <EyeClosed  size={20} onClick={() => setShow()}/>}</span>
            </div>
            <p className={`${errors?.password ? `visible` : `invisible`} pl-2 text-red-500 text-sm`}>{errors?.password?.message || `Error`}</p>
        </div>

      </div> 

      {/* Signup button  */}
      <div className="flex flex-col gap-y-4 items-center w-full">
        <button
            type="submit"
            className="bg-[var(--secondary-color)] py-3 w-full text-[var(--dark-btn)] rounded-full font-bold cursor-pointer"
        >
            Create an account
        </button>
        <span className="text-[var(--lightText)] text-sm">- or -</span>
        <p className="text-[var(--lightText)] text-md">Already have an account? <Link href='/login' className="text-[var(--dark-btn)]">Login</Link></p>
      </div>
    </form>
  );
}