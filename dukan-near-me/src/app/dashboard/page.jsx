import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LogoutButton from "@/components/LogoutButton";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p>You are not logged in</p>;
  }
  return (
      <div>
      <h1>Welcome, {session.user.firstName + session.user.lastName}!</h1>
      <p className="lowercase">Your role: {session.user.role}</p>
      <LogoutButton />
    </div>
  );
}
