"use client";
import { useRouter } from "next/navigation";
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import { signupSchema } from "@/schemas/validation";
import axios from "axios";
import toast from "react-hot-toast";

export default function Signup() {
  const {register, handleSubmit, formState: {errors}, watch} = useForm({
    resolver: zodResolver(signupSchema)
  })
  
  const router = useRouter();

  const onSubmit = async(data) => {
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-96 mx-auto mt-10">
      <div className="flex flex-col">
        <input type="text" name="firstName" placeholder="Your first name" {...register('firstName')} className="p-2 border mb-2" />
        <p className={`${errors?.firstName ? `visible` : `invisible`} text-red-500 text-sm`}>{errors?.firstName?.message || `Error`}</p>
      </div>
      <div className="flex flex-col">
        <input type="text" name="lastName" placeholder="Your last name" {...register('lastName')} className="p-2 border mb-2" />
        <p className={`${errors?.lastName ? `visible` : `invisible`} text-red-500 text-sm`}>{errors?.lastName?.message || `Error`}</p>
      </div>
      <div className="flex flex-col">
        <input type="text" name="phone" placeholder="Phone" {...register('phone')} className="p-2 border mb-2" maxLength={10}/>
        <p className={`${errors?.phone ? `visible` : `invisible`} text-red-500 text-sm`}>{errors?.phone?.message || `Error`}</p>
      </div>
      <div className="flex flex-col">
        <input type="email" name="email" placeholder="Email" {...register('email')} className="p-2 border mb-2" />
        <p className={`${errors?.email ? `visible` : `invisible`} text-red-500 text-sm`}>{errors?.email?.message || `Error`}</p>
      </div>
      <div className="flex flex-col">
        <input type="password" name="password" placeholder="Password" {...register('password')} className="p-2 border mb-2" />
        <p className={`${errors?.password ? `visible` : `invisible`} text-red-500 text-sm`}>{errors?.password?.message || `Error`}</p>
      </div>
      <button type="submit" className="bg-green-500 text-white p-2">Sign Up</button>
    </form>
  );
}
