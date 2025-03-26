import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: async ({ token, req }) => {
      const path = req.nextUrl.pathname;

      if (!token) return false;

      console.log("Session Token:", token.sessionToken);

      // If sessionToken is missing, log the user out
      if (!token.sessionToken) {
        const logoutUrl = new URL("/api/logout-device", req.nextUrl.origin);
        await fetch(logoutUrl, {
          method: "POST",
          body: JSON.stringify({ sessionToken: null }),
          headers: { "Content-Type": "application/json" },
        });

        // Clear session cookies
        const logoutResponse = NextResponse.redirect(new URL("/login", req.nextUrl.origin));
        logoutResponse.cookies.set("next-auth.session-token", "", { maxAge: 0 });
        logoutResponse.cookies.set("next-auth.csrf-token", "", { maxAge: 0 });

        return logoutResponse;
      }

      if (token.role === "admin") return true;

      return token.allowedRoutes?.includes(path);
    },
  },
});

export const config = {
  matcher: ["/", "/dashboard/:path*", "/admin/:path*", "/content/:path*"],
};
