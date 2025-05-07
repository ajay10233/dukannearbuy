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
        <div className='bg-gradient-to-br from-[#e7f0ec] via-[#aabec2] to-[#005d6e]'>
        <header>
            <div className="w-full p-4 flex items-center gap-x-2">
                <div className="relative w-12.5 h-12.5">
                    <Image src="/nearbuydukan-Logo/Logo.svg" alt="nearbuydukan" fill sizes='50px' priority/>
                </div>
                <span className="font-semibold text-sm uppercase">nearbuydukan</span>
            </div>
        </header>
        <main className="flex h-[calc(100vh-82px)] w-full overflow-hidden relative">
            <div className="flex flex-col items-center justify-center w-full md:w-1/2 gap-y-10">
                <h1 className="text-3xl md:text-4xl font-bold">Welcome Back!</h1>
                <LoginForm />
            </div>
            
            {/* Right Side  */}
            <div className="hidden md:flex w-1/2 items-center justify-center relative overflow-hidden">
                {/* <div className='bg-[var(--secondary-color)] w-[350px] h-screen rounded-t-[394px] translate-y-20'> */}
                    <div className="relative -translate-x-20 w-[380px] h-[510px]"> 
                        <Image src="/login-Illustration.svg" alt="signup illustration" fill sizes="480px" priority />
                    </div>
                {/* </div> */}
            </div>       
        </main>
        </div>
    )
}
