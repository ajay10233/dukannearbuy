import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

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
    } else if (token.role === "INSTITUTION"|| token.role === "SHOP_OWNER") {
      return NextResponse.redirect(new URL("/partnerHome", req.url));
    }
  }

  // Allow all other requests to proceed
  return NextResponse.next();
}

// Route matcher config
export const config = {
  matcher: [
    // "/",
    "/billGenerator/:path*",
    "/change-location/:path*",
    "/dashboard/:path*",
    "/payments/:path*",
    "/session-manager/:path*",
    "/admin/:path*",
    "/bill-genration-page/:path*",
    "/billGenerator/:path*",
    "/billHistory/:path*",
    "/billRecord/:path*",
    "/change-location/:path*",
    "/chat/:path*",
    "/create-bill/:path*",
    "/dashboard/:path*",
    "/download-bill/:path*",
    "/edit-format/:path*",
    "/favprofile/:path*",
    "/feedback/:path*",
    "/forgot-password/:path*",
    "/generate-bill/:path*",
    "/institution-edit-profile/:path*",
    "/institution-profile/:path*",
    "/myplan/:path*",
    "/mytoken/:path*",
    "/notification/:path*",
    "/partnerHome/:path*",
    "/partnerProfile/:path*",
    "/payment/:path*",
    "/payments/:path*",
    "/qr-code/:path*",
    // "/reset/:path*", // uncomment if needed
    "/scan-qr/:path*",
    "/scanqr/:path*",
    "/shortBill/:path*",
    "/token/:path*",
    "/tokengenerate/:path*",
    "/tokenupdate/:path*",
    "/UserHomePage/:path*",
    "/userProfile/:path*",
  ],
};
