import BillHistory from "@/app/components/BillHistory/BillHistory";
import Navbar from "../components/InstitutionHome/navbar/Navbar";
import Image from "next/image";

export default function page() {
  return (
    <div className="relative">
      <Navbar />
      <BillHistory />
      <div className="absolute bottom-0 right-4 w-17 h-17 md:w-32 md:h-32">
          <Image src="/nearbuydukan - watermark.png" alt="Watermark" fill sizes="120" className="object-contain w-17 h-17 md:w-32 md:h-32" priority />
      </div>
    </div>  
  )
}
