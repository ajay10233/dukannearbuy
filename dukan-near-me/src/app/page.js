import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LogoutButton from "@/app/components/LogoutButton";
import SessionManager from "./components/SessionManager";
import GlobalSearchBar from "./components/GlobalSearchComponent";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  console.log(session)
  if (!session) {
    return <p>You are not logged in</p>;
  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    </div>
  );
}
