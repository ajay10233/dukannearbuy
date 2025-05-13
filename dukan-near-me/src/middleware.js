import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { nextUrl } = req;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If sessionToken exists, validate it (optional extra validation)
  const response = await fetch(`${req.nextUrl.origin}/api/validate-session`, {
    method: "POST",
    body: JSON.stringify({ sessionToken: token.sessionToken }),
    headers: { "Content-Type": "application/json" },
  });

  const { isValid } = await response.json();
  if (!isValid) {
    const logoutResponse = NextResponse.redirect(new URL("/login", req.url));
    logoutResponse.cookies.set("next-auth.session-token", "", { path: "/", httpOnly: true, maxAge: 0 });
    logoutResponse.cookies.set("next-auth.csrf-token", "", { path: "/", httpOnly: true, maxAge: 0 });

    return logoutResponse;
  }

  // If path is exactly `/`, redirect based on user role
  if (nextUrl.pathname === "/") {
    if (token.role === "USER") {
      return NextResponse.redirect(new URL("/UserHomePage", req.url));
    } else if (token.role === "INSTITUTION") {
      return NextResponse.redirect(new URL("/partnerHome", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", 
    "/billGenerator/:path*",
    "/change-location/:path*",
    // "/chat/:path*",
    // "/chats/:path*",
    "/dashboard/:path*",
    "/payments/:path*",
    "/profile/:path*",
    "/session-manager/:path*",
    "/userProfile/:path*",
    "/admin/:path*",    
  ],
};
