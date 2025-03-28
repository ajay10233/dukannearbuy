import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname;

      // if (path === "/" || path === "/dashboard") return true;

      if (!token) return false;

      if (token.role === "admin") return true;

      return token.allowedRoutes?.includes(path)
    },
  },
});

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/admin/:path*",
    "/content/:path*",
  ],
};
