import { Suspense } from "react";
import SessionManager from "../components/SessionManager/SessionManager";

export default function Page() {
    return (
        <Suspense fallback={<p className="text-center text-gray-500">Loading...</p>}>
            <SessionManager/>
        </Suspense>
    );
}