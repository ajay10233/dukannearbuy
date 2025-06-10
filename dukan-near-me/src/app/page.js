import Image from "next/image";
import RolesCard from "@/app/components/GetStarted/RolesCard";
import Link from "next/link";

export const metadata = {
  title: "Get Started - NearbuyDukan",
  description: "Join NearbuyDukan to explore, list, or manage local shops and services. Start your journey now!",
  keywords: ["NearbuyDukan", "get started", "local business", "nearby shops", "register", "join now"],
  robots: "index, follow",
  alternates: {
    canonical: "https://nearbuydukan.com/get-started",
  },
  openGraph: {
    title: "Get Started - NearbuyDukan",
    description: "Join NearbuyDukan to explore or list nearby shops and services.",
    url: "https://nearbuydukan.com/get-started",
    images: [
      {
        url: "https://nearbuydukan.com/nearbuydukan-Logo/Logo.png",
        width: 1200,
        height: 630,
        alt: "NearbuyDukan Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get Started - NearbuyDukan",
    description: "Explore or list your local shop on NearbuyDukan today.",
    images: ["https://nearbuydukan.com/nearbuydukan-Logo/Logo.png"],
  },
};

export default function GetStarted() {
  return (
    <main className='h-screen overflow-hidden bg-gradient-to-br from-[#e7f0ec] via-[#aabec2] to-[#005d6e]'>
      <header className='flex justify-between p-5'>
        <div className="w-3/4 flex items-center gap-x-2">
          <div className="relative w-10 h-10">
            <Image src="/nearbuydukan-Logo/Logo.svg" alt="nearbuydukan" fill sizes='50px' priority />
          </div>
          <span className="font-semibold text-sm uppercase">nearbuydukan</span>
        </div>
        <div className="flex items-center whitespace-nowrap text-sm gap-x-2 md:gap-x-5 text-slate-700">
          <Link href="/aboutus#help" className="text-[10px] md:text-sm cursor-pointer">Need help?</Link>
          <Link href="mailto:contact@nearbuydukaan.com" className="text-[10px] md:text-sm cursor-pointer">Contact us</Link>
        </div>
      </header>
      <section className='flex justify-center items-center h-full'>
        <div className="flex flex-col items-center w-4/5 md:w-2/6 h-3/4 md:h-full">
          <div className="flex">
            <h1 className='text-2xl md:text-3xl font-bold text-slate-800'>Start with us now</h1>
          </div>
          <RolesCard />
        </div>
      </section>
    </main>
  );
}
