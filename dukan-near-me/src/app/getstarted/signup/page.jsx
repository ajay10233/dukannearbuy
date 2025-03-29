import { Suspense } from "react";
import SignupComponent from "@/app/components/SignupComponent";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center text-gray-500">Loading...</p>}>
      <SignupComponent />
    </Suspense>
  );
}
