import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { nextUrl } = req;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // console.log("Requested Path:", nextUrl.pathname);
  if (!token) {
    // console.log("No token found, redirecting to login...");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // console.log("User Token:", token);
  const response = await fetch(`${req.nextUrl.origin}/api/validate-session`, {
    method: "POST",
    body: JSON.stringify({ sessionToken: token.sessionToken }),
    headers: { "Content-Type": "application/json" },
  });

  const { isValid } = await response.json();
  if (!isValid) {
    // console.log("Invalid session, redirecting to login...");
    const logoutResponse = NextResponse.redirect(new URL("/login", req.url));
    logoutResponse.cookies.set("next-auth.session-token", "", { path: "/", httpOnly: true, maxAge: 0 });
    logoutResponse.cookies.set("next-auth.csrf-token", "", { path: "/", httpOnly: true, maxAge: 0 });

    return logoutResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/billGenerator/:path*",
    "/change-location/:path*",
    "/chat/:path*",
    "/chats/:path*",
    "/dashboard/:path*", 
    // "/getStarted/:path*", 
    "/payments/:path*", 
    "/profile/:path*",
    "/session-manager/:path*",
    "/userProfile/:path*",
    "/admin/:path*", 
  ],
};
