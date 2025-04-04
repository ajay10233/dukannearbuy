import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PaymentHistory from "./components/chat/PaymentHistory";
import SessionManager from "./components/SessionManager/SessionManager";
import GlobalSearchBar from "./components/GlobalSearchComponent";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[var(--font-rubik)]">
      <GlobalSearchBar/>
    <Dialog>
      <DialogTrigger asChild>
        <span>+</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-4/5 rounded-xl border-none flex flex-col bg-[#F5FAFC] overflow-auto dialogScroll">
        <DialogHeader>
          <div className="hidden">
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </div>
          <div className="flex justify-center items-center font-[family-name:var(--font-plusJakarta)]">
            <button className="bg-teal-700 p-3 w-3/4 outline-none rounded-xl text-white text-sm">Your all time transaction history</button>
          </div>
        </DialogHeader>
        <div className="flex flex-col">
          <PaymentHistory />
        </div>
      </DialogContent>
    </Dialog>
    </div>
  );
}
