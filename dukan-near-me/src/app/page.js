import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LogoutButton from "@/app/components/LogoutButton";
import SessionManager from "./components/SessionManager";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  console.log(session)
  if (!session) {
    return <p>You are not logged in</p>;
  }
  return (
      <div className="text-center">
      <h1>Welcome, {session.user.firstName + session.user.lastName}!</h1>
      <p className="lowercase">Your role: {session.user.role}</p>
      <LogoutButton />
      <SessionManager/>
    </div>
  );
}
