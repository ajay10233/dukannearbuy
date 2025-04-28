import Image from "next/image";
import Navbar from "../components/InstitutionHome/navbar/Navbar";
import CreateBill from "../components/bill-format/CreateBill";
import EditFormat from "../components/bill-format/EditFormat";
import Toggles from "../components/bill-format/Toggles";
import UploadPdfImage from "../components/bill-format/UploadPdfImage";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative">
      <Navbar />
      <main className="flex flex-col flex-1 bg-white/30 p-3 md:p-6 gap-4 rounded-md shadow-md w-full md:w-full md:max-w-5xl self-center mt-16">
        <EditFormat />
        <Toggles />
        <UploadPdfImage />
        <CreateBill />
      </main>
      <div className="absolute bottom-1 right-4 w-17 h-17 md:w-32 md:h-32">
      <Image
          src="/nearbuydukan - watermark.png"
          alt="Watermark"
          fill sizes="120"
          className="object-contain w-17 h-17 md:w-32 md:h-32"
          priority/>
      </div>      
    </div>
  );
}
