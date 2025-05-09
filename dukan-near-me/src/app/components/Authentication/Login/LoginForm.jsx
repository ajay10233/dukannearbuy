"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/validation";
import toast from "react-hot-toast";
import { useBoolToggle } from "react-haiku";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [show, setShow] = useBoolToggle();
  const { data: session, status } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // const providers = [
  //   {
  //     icon: 'google.svg',
  //     name: 'google'
  //   },
  //   {
  //     icon: 'facebook.svg',
  //     name: 'facebook'
  //   },
  //   {
  //     icon: 'apple.svg',
  //     name: 'apple'
  //   },
  // ]
  const getIpAddress = async () => {
        try {
          const res = await fetch("https://api64.ipify.org?format=json");
          const data = await res.json();
          return data.ip;
        } catch (error) {
          console.error("Error fetching IP:", error);
          return "Unknown IP";
        }
      };

  
  const onSubmit = async (data) => {
    if (data) {
      const { email, password } = data;
      const toastId = toast.loading("Processing...");

      try {
        // Fetch IP address
        const ip = await getIpAddress();
        // Get device info
        const device = navigator.userAgent || "Unknown Device";

        const res = await signIn("credentials", {
          redirect: false,
          identifier: email, // Change 'email' to 'identifier'
          password,
          device,
          ip,
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
  
  useEffect(() => {
    if (session?.user?.role) {
      const role = session.user.role;

      if (role === "SHOP_OWNER") {
        router.push("/partnerHome");
      } else if (role === "INSTITUTION") {
        router.push("/partnerHome");
      } else if (role === "USER") {
        router.push("/UserHomePage");
      } else {
        router.push("/dashboard");
      }
    } else {
      router.push("/login");
    }
  }, [session, router]);

  
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-y-7 w-4/5 md:w-3/5 items-center"
    >
      <div className="flex flex-col gap-y-2 w-full text-[var(--withdarktext)]">
        {/* Email */}
        <div className="flex flex-col">
          <div className="flex flex-col relative">
            <input
              type="text"
              id="email"
              className="w-full border rounded-full outline-none px-5 py-2 md:py-2.5 text-sm md:text-base peer text-[var(--withdarkinnertext)] lowercase"
              {...register("email")}
            />
            <label
              htmlFor="email"
              className={`capitalize absolute top-1/2 -translate-y-1/2 left-5 peer-focus:-translate-y-8.5 peer-focus:scale-90 peer-focus:-translate-x-2 bg-[#C8D7D7] px-1 transition-all duration-200 ${
                watch("email") && `-translate-x-2 scale-90 -translate-y-8.5`
              }`}
            >
              email
            </label>
          </div>
          <p
            className={`${
              errors?.email ? `visible` : `invisible`
            } pl-2 text-red-500 text-sm`}>
            {errors?.email?.message || `Error`}
          </p>
        </div>

        {/* password */}
        <div className="flex flex-col">
          <div className="flex flex-col relative">
            <input
              type={!show ? "password" : "text"}
              id="password"
              className="w-full border rounded-full outline-none px-5 py-2 md:py-2.5 pr-14 text-sm md:text-base peer text-[var(--withdarkinnertext)]"
              {...register("password")}
            />
            <label
              htmlFor="password"
              className={`capitalize absolute top-1/2 -translate-y-1/2 left-5 peer-focus:-translate-y-8.5 peer-focus:scale-90 peer-focus:-translate-x-2 bg-[#C0D0D1] px-1 transition-all duration-200 ${
                watch("password") && `-translate-x-2 scale-90 -translate-y-8.5`
              }`}>
              password
            </label>
            <span className="absolute right-5 top-1/2 -translate-y-1/2">
              {show ? (
                <Eye size={20} onClick={() => setShow()} />
              ) : (
                <EyeClosed size={20} onClick={() => setShow()} />
              )}
            </span>
          </div>
          <div className="flex justify-end px-4">
            <Link href={`/forgot-password`} className="text-sm">
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-4 items-center w-full">
        <button
          type="submit"
          className="bg-blue-600 py-2 md:py-3 w-full text-white text-sm md:text-base rounded-full font-bold cursor-pointer">
            Login
        </button>
        <span className="text-gray-600 text-sm">- or -</span>
        {/* <div className="flex justify-around gap-x-5 w-1/2">
        {
          providers.map((prov, i) => (
            <span className="relative block w-6 h-6 cursor-pointer" key={i} onClick={() => signIn(prov.name, { callbackUrl: "/dashboard" })}>
              <Image src={`/loginSvg/${prov.icon}`} fill sizes="20px" alt={prov.name} priority />
            </span>
          ))
        }
        </div> */}
        <p className="text-gray-600 text-md">
          Don't have an account?{" "}
          <Link href="/getstarted" className="text-gray-800 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}