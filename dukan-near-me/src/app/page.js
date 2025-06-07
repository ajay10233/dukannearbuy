import Image from "next/image";
import RolesCard from "@/app/components/GetStarted/RolesCard";
import Link from "next/link";
import Head from "next/head";

export default function GetStarted() {
  return (
    <>
      <Head>
        <title>Get Started - NearbuyDukan</title>
        <meta name="description" content="Join NearbuyDukan to explore, list, or manage local shops and services. Start your journey now!" />
        <meta name="keywords" content="NearbuyDukan, get started, local business, nearby shops, register, join now" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://nearbuydukan.com/get-started" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="Get Started - NearbuyDukan" />
        <meta property="og:description" content="Join NearbuyDukan to explore or list nearby shops and services." />
        <meta property="og:url" content="https://nearbuydukan.com/get-started" />
        <meta property="og:image" content="https://nearbuydukan.com/nearbuydukan-Logo/Logo.png" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Get Started - NearbuyDukan" />
        <meta name="twitter:description" content="Explore or list your local shop on NearbuyDukan today." />
        <meta name="twitter:image" content="https://nearbuydukan.com/nearbuydukan-Logo/Logo.png" />
      </Head>

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
    </>
  );
}
