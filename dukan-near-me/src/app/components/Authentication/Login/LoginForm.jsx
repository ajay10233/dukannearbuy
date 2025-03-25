"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/validation";
import toast from "react-hot-toast";
import { useBoolToggle } from "react-haiku";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginForm() {
  const router = useRouter();
  const [show, setShow] = useBoolToggle();

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

  const onSubmit = async (data) => {
    if (data) {
      const { email, password } = data;

      const toastId = toast.loading("Processing...");
      try {
        const res = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
        if (res.status === 200) {
          toast.success("Login successfully!", { id: toastId });
          router.push("/dashboard");
        } else {
          toast.error(res.error, { id: toastId });
        }
      } catch (error) {
        toast.error(res.error || "Auth error", { id: toastId });
        console.log(error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-y-7 w-3/5 items-center"
    >
      <div className="flex flex-col gap-y-2 w-full text-[var(--withdarktext)]">
        {/* Email */}
        <div className="flex flex-col">
          <div className="flex flex-col relative">
            <input
              type="text"
              id="email"
              className="w-full border rounded-full outline-none px-5 py-2.5 peer text-[var(--withdarkinnertext)] lowercase"
              {...register("email")}
            />
            <label
              htmlFor="email"
              className={`capitalize absolute top-1/2 -translate-y-1/2 left-5 peer-focus:-translate-y-8.5 peer-focus:scale-90 peer-focus:-translate-x-2 bg-[var(--background)] px-1 transition-all duration-200 ${
                watch("email") && `-translate-x-2 scale-90 -translate-y-8.5`
              }`}
            >
              email
            </label>
          </div>
          <p
            className={`${
              errors?.email ? `visible` : `invisible`
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
              className="w-full border rounded-full outline-none px-5 py-2.5 pr-14 peer text-[var(--withdarkinnertext)]"
              {...register("password")}
            />
            <label
              htmlFor="password"
              className={`capitalize absolute top-1/2 -translate-y-1/2 left-5 peer-focus:-translate-y-8.5 peer-focus:scale-90 peer-focus:-translate-x-2 bg-[var(--background)] px-1 transition-all duration-200 ${
                watch("password") && `-translate-x-2 scale-90 -translate-y-8.5`
              }`}
            >
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
            <Link href={`/forgotPassword`} className="text-sm">
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-4 items-center w-full">
        <button
          type="submit"
          className="bg-[var(--secondary-color)] py-3 w-full text-[var(--dark-btn)] rounded-full font-bold cursor-pointer"
        >
          Login
        </button>
        <span className="text-[var(--lightText)] text-sm">- or -</span>
        {/* <div className="flex justify-around gap-x-5 w-1/2">
        {
          providers.map((prov, i) => (
            <span className="relative block w-6 h-6 cursor-pointer" key={i} onClick={() => signIn(prov.name, { callbackUrl: "/dashboard" })}>
              <Image src={`/loginSvg/${prov.icon}`} fill sizes="20px" alt={prov.name} priority />
            </span>
          ))
        }
        </div> */}
        <p className="text-[var(--lightText)] text-md">
          New user?{" "}
          <Link href="/getstarted" className="text-[var(--dark-btn)]">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}