"use client";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/validation";
import toast from "react-hot-toast";
import { useBoolToggle } from "react-haiku";
import { Eye, EyeClosed, Loader2 } from "lucide-react"; // <- Loader icon
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LogoLoader from "../../LogoLoader";

export default function LoginForm() {
  const router = useRouter();
  const [show, setShow] = useBoolToggle();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false); // <- Loading state
  const [showModal, setShowModal] = useState(false);
  const [modalShownOnce, setModalShownOnce] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

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
  setModalShownOnce(false);

  if (!data) return;

  setIsLoading(true);
  const { email, password } = data;
  const toastId = toast.loading("Processing...");

  try {
    const ip = await getIpAddress();
    const device = navigator.userAgent || "Unknown Device";

    const res = await signIn("credentials", {
      redirect: false,
      identifier: email,
      password,
      device,
      ip,
    });

    if (res.ok) {
      toast.success("Login successfully!", { id: toastId });

      const session = await getSession(); // Get full session with user info

      // Role-based redirection
      const role = session?.user?.role;
      if (role === "USER") {
        router.push("/UserHomePage");
      } else if (role === "INSTITUTION"|| role === "SHOP_OWNER") {
        router.push("/partnerHome");
      } else {
        router.push("/dashboard"); // default for normal users
      }

    } else if (res.error === "NOT_VERIFIED") {
      toast.error("You must verify your email first.", { id: toastId });
      if (!modalShownOnce) {
        setShowModal(true);
        setModalShownOnce(true);
      }
    } else {
      toast.error(res.error || "Invalid credentials", { id: toastId });
    }

  } catch (error) {
    console.error("Auth error", error);
    toast.error("Something went wrong during login", { id: toastId });
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    if (session?.user?.role) {
      const role = session.user.role;
      if (role === "SHOP_OWNER" || role === "INSTITUTION") {
        router.push("/partnerHome");
      } else if (role === "USER") {
        router.push("/UserHomePage");
      } else {
        router.push("/dashboard");
      }
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
              className={`capitalize absolute top-1/2 -translate-y-1/2 left-5 peer-focus:-translate-y-8.5 peer-focus:scale-90 peer-focus:-translate-x-2 bg-[#C8D7D7] px-1 transition-all duration-200 ${watch("email") && `-translate-x-2 scale-90 -translate-y-8.5`
                }`}
            >
              email
            </label>
          </div>
          <p
            className={`${errors?.email ? `visible` : `invisible`
              } pl-2 text-red-500 text-sm`}
          >
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
              className={`capitalize absolute top-1/2 -translate-y-1/2 left-5 peer-focus:-translate-y-8.5 peer-focus:scale-90 peer-focus:-translate-x-2 bg-[#C0D0D1] px-1 transition-all duration-200 ${watch("password") && `-translate-x-2 scale-90 -translate-y-8.5`
                }`}
            >
              password
            </label>
            <span className="absolute right-5 top-1/2 -translate-y-1/2">
              {show ? (
                <Eye size={20} onClick={() => setShow()} className="text-gray-600 md:text-[var(--withdarkinnertext)]" />
              ) : (
                <EyeClosed size={20} onClick={() => setShow()} className="text-gray-600 md:text-[var(--withdarkinnertext)]" />
              )}
            </span>
          </div>
          <div className="flex justify-end px-4">
            <Link href={`/forgot-password`} className="text-sm text-gray-700 md:text-[var(--withdarkinnertext)]">
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-4 items-center w-full">
        <button
          type="submit"
          disabled={isLoading}
          className={`py-2 md:py-3 w-full text-white text-sm md:text-base rounded-full font-bold cursor-pointer transition-all ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600"
            }`}
        >
          {isLoading && <LogoLoader content={"Logging in..."} />} 

          Login
        </button>

        <span className="text-gray-700 md:text-gray-600 text-sm">- or -</span>

        <p className="text-gray-700 md:text-gray-600 text-md">
          Don't have an account?{" "}
          <Link href="/getstarted" className="text-blue-800 md:text-gray-800 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
      
      {/* Verification Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-4 md:p-6 rounded-xl border-4 border-double border-sky-800 shadow-xl w-75 md:w-full md:max-w-lg text-center"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Email Verification Required</h2>
              <p className="text-sm text-gray-600 mb-6">
                It looks like your email hasn't been verified yet. Please verify your email address to continue logging in.
              </p>

              <div className="flex flex-row gap-4 items-center justify-center whitespace-nowrap">
                <Link href="/otp-verify">
                  <motion.span
                    whileHover={{ scale: 1.05}}
                    className="px-3 md:px-6 py-3 bg-blue-600 text-white rounded-md cursor-pointer transition-all ease-in-out duration-300 hover:bg-blue-700"
                  >
                    Verify My Email
                  </motion.span>
                </Link>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-3 md:px-6 py-2 bg-gray-50 border border-gray-300 text-gray-800 rounded-md cursor-pointer transition-all ease-in-out duration-300 hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
