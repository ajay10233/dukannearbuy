import Image from "next/image";
import RolesCard from "../components/GetStarted/RolesCard";

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
        <div className="flex text-sm gap-x-5 text-slate-700">
            <button className="cursor-pointer">Need help?</button>
            <button className="cursor-pointer">Contact us</button>
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
  )
}
