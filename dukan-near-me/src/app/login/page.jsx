"use client"
import LoginForm from '../components/Authentication/Login/LoginForm'
import Image from 'next/image'

// export default function Login() {
//   const { register, handleSubmit, formState: { errors } } = useForm({
//     resolver: zodResolver(loginSchema)
//   });

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-96 mx-auto mt-10">
//       <div className="flex flex-col">
//         <input type="text" name="email" placeholder="Email" {...register('email')} className="p-2 border mb-2" />
//         <p className={`${errors?.email ? `visible` : `invisible`} text-red-500 text-sm`}>
//           {errors?.email?.message || `Error`}
//         </p>
//       </div>
//       <div className="flex flex-col">
//         <input type="password" name="password" placeholder="Password" {...register('password')} className="p-2 border mb-2" />
//       </div>
//       <button type="submit" className="bg-blue-500 text-white p-2">Login</button>
//     </form>
//   );
// }

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
