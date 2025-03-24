"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/validation";
import toast from "react-hot-toast";

export default function Login() {
  const {register, handleSubmit, formState: {errors}} = useForm({
    resolver: zodResolver(loginSchema)
  })
  const router = useRouter();

  // const onSubmit = async (data) => {
  //   if(data){
  //     const {email, password} = data;
      
  //     const toastId = toast.loading('Processing...');
  //     try {
  //       const res = await signIn("credentials", {
  //         redirect: false,
  //         email,
  //         password
  //       });
  //       if(res.status === 200){
  //         toast.success('Login successfully!', {id: toastId})
  //         router.push("/dashboard");
  //       }else{
  //         toast.error(res.error, {id: toastId})
  //       }
  //     } catch (error) {
  //       toast.error(res.error || 'Auth error', {id: toastId})
  //       console.log(error);
  //     }
  //   }
  // };

  const onSubmit = async (data) => {
    if(data){
      const { email, password } = data;  // 'email' is actually the identifier now
  
      const toastId = toast.loading("Processing...");
      try {
        const res = await signIn("credentials", {
          redirect: false,
          identifier: email,  // Change 'email' to 'identifier' here
          password,
        });
  
        if (res.status === 200) {
          toast.success("Login successfully!", { id: toastId });
          router.push("/dashboard");
        } else {
          toast.error(res.error || "Invalid credentials", { id: toastId });
        }
      } catch (error) {
        toast.error("Auth error", { id: toastId });
        console.error(error);
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-96 mx-auto mt-10">
      <div className="flex flex-col">
        <input type="text" name="email" placeholder="Email" {...register('email')} className="p-2 border mb-2" />
        <p className={`${errors?.email ? `visible` : `invisible`} text-red-500 text-sm`}>{errors?.email?.message || `Error`}</p>
      </div>
      <div className="flex flex-col">
        <input type="password" name="password" placeholder="Password" {...register('password')} className="p-2 border mb-2" />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2">Login</button>
    </form>
  );
}
