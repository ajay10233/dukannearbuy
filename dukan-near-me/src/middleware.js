import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = [
  "/sitemap.xml",
  "/robots.txt",
  "/aboutus",
  "/UserHomePage",
  "/bill-generation-page",
  "/favicon.ico",
];

export async function middleware(req) {
  const { nextUrl } = req;
  const { pathname, origin } = nextUrl;

  // ✅ Allow public paths without auth
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // ✅ Skip middleware for static files & Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/otp-verify") ||
    pathname.startsWith("/getstarted")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const validateRes = await fetch(`${origin}/api/validate-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionToken: token.sessionToken }),
    });

    const { isValid } = await validateRes.json();

    if (!isValid) {
      const response = NextResponse.redirect(new URL("/login", req.url));
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

  if (pathname === "/") {
    if (token.role === "USER") {
      return NextResponse.redirect(new URL("/UserHomePage", req.url));
    } else if (token.role === "INSTITUTION" || token.role === "SHOP_OWNER") {
      return NextResponse.redirect(new URL("/partnerHome", req.url));
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    "/billGenerator/:path*",
    "/((?!sitemap.xml|robots.txt|favicon.ico|_next|images|icons|api|login|otp-verify|getstarted).*)",
    "/((?!sitemap.xml|robots.txt|...).*)",
    "/((?!_next|api|favicon.ico|sitemap.xml|robots.txt|images|icons).*)",
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

// todo to be changed role wise middleware
// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// const roleRoutes = {
//   USER: [
//     "/UserHomePage",
//     "/userProfile",
//     "/notification",
//     "/chat",
//     "/payments",
//     "/favprofile",
//     "/feedback",
//     "/token",
//     "/mytoken",
//     "/scanqr",
//     "/scan-qr",
//     "/shortBill",
//     "/download-bill",
//   ],
//   INSTITUTION: [
//     "/partnerHome",
//     "/partnerProfile",
//     "/billGenerator",
//     "/billHistory",
//     "/create-bill",
//     "/generate-bill",
//     "/billRecord",
//     "/payment",
//     "/payments",
//     "/qr-code",
//     "/myplan",
//     "/notification",
//     "/chat",
//     "/institution-profile",
//     "/institution-edit-profile",
//     "/tokengenerate",
//     "/tokenupdate",
//     "/token",
//     "/download-bill",
//     "/edit-format",
//   ],
//   SHOP_OWNER: [
//     "/partnerHome",
//     "/partnerProfile",
//     "/billGenerator",
//     "/billHistory",
//     "/create-bill",
//     "/generate-bill",
//     "/billRecord",
//     "/payment",
//     "/payments",
//     "/qr-code",
//     "/myplan",
//     "/notification",
//     "/chat",
//     "/institution-profile",
//     "/institution-edit-profile",
//     "/tokengenerate",
//     "/tokenupdate",
//     "/token",
//     "/download-bill",
//     "/edit-format",
//   ],
// };

// export async function middleware(req) {
//   const { nextUrl } = req;
//   const { pathname, origin } = nextUrl;

//   if (req.url.includes("/login")) return NextResponse.next();

//   const token = await getToken({
//     req,
//     secret: process.env.NEXTAUTH_SECRET,
//     secureCookie: process.env.NODE_ENV === "production",
//   });

//   if (!token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   try {
//     const validateRes = await fetch(`${origin}/api/validate-session`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ sessionToken: token.sessionToken }),
//     });

//     const { isValid } = await validateRes.json();

//     if (!isValid) {
//       const response = NextResponse.redirect(new URL("/login", req.url));
//       response.cookies.set("next-auth.session-token", "", {
//         path: "/",
//         httpOnly: true,
//         maxAge: 0,
//       });
//       response.cookies.set("next-auth.csrf-token", "", {
//         path: "/",
//         httpOnly: true,
//         maxAge: 0,
//       });

//       return response;
//     }
//   } catch (error) {
//     console.error("Session validation failed:", error);
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   // Redirect "/" to role-based homepage
//   if (pathname === "/") {
//     if (token.role === "USER") {
//       return NextResponse.redirect(new URL("/UserHomePage", req.url));
//     } else if (["INSTITUTION", "SHOP_OWNER"].includes(token.role)) {
//       return NextResponse.redirect(new URL("/partnerHome", req.url));
//     }
//   }

//   // Restrict access based on role
//   const allowedRoutes = roleRoutes[token.role] || [];
//   const isAllowed = allowedRoutes.some((route) =>
//     pathname.startsWith(route)
//   );

//   if (!isAllowed) {
//     return NextResponse.redirect(new URL("/unauthorized", req.url));
//   }

//   return NextResponse.next();
// }
