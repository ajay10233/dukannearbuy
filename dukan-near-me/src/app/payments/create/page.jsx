import { Suspense } from "react";
import CreatePayment from "@/app/components/Payments/CreatePayment";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center text-gray-500">Loading...</p>}>
      <CreatePayment />
    </Suspense>
  );
}
