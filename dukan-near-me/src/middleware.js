import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Middleware to protect routes and route users based on their role.
 */
export async function middleware(req) {
  const { nextUrl } = req;
  const { pathname, origin } = nextUrl;

  // Get session token using NextAuth
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Redirect to login if no session token
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Optional: Validate the session token against server logic
  try {
    const validateRes = await fetch(`${origin}/api/validate-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionToken: token.sessionToken }),
    });

    const { isValid } = await validateRes.json();

    if (!isValid) {
      const response = NextResponse.redirect(new URL("/login", req.url));

      // Expire session-related cookies
      response.cookies.set("next-auth.session-token", "", {
        path: "/",
        httpOnly: true,
        maxAge: 0,
      });
      response.cookies.set("next-auth.csrf-token", "", {
        path: "/",
        httpOnly: true,
        maxAge: 0,
      });

      return response;
    }
  } catch (error) {
    console.error("Session validation failed:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect to role-specific homepage only if visiting the root "/"
  if (pathname === "/") {
    if (token.role === "USER") {
      return NextResponse.redirect(new URL("/UserHomePage", req.url));
    } else if (token.role === "INSTITUTION") {
      return NextResponse.redirect(new URL("/partnerHome", req.url));
    }
  }

  // Allow all other requests to proceed
  return NextResponse.next();
}

// Route matcher config
export const config = {
  matcher: [
    "/",
    "/billGenerator/:path*",
    "/change-location/:path*",
    "/dashboard/:path*",
    "/payments/:path*",
    "/session-manager/:path*",
    "/admin/:path*",
  ],
};
