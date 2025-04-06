import { Suspense } from "react";
import PaymentHistory from "@/app/components/Payments/PaymentHistory";

export default function PaymentHistoryPage() {
  return (
    <Suspense fallback={<p className="text-center text-gray-500">Loading...</p>}>
      <PaymentHistory />
    </Suspense>
  );
}
