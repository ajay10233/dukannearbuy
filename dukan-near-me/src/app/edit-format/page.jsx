import Navbar from "../components/InstitutionHome/navbar/Navbar";
import CreateBill from "../components/bill-format/CreateBill";
import EditFormat from "../components/bill-format/EditFormat";
import Toggles from "../components/bill-format/Toggles";
import UploadPdfImage from "../components/bill-format/UploadPdfImage";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto pt-8 px-6 pb-6 p-6 rounded-md shadow-md">
        <EditFormat />
        <Toggles />
        <UploadPdfImage />
        <CreateBill />
      </main>
    </div>
  );
}
