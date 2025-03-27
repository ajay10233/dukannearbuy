import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/utils/db";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
      GithubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
      }),
    // CredentialsProvider({
    //   // We don't need built-in credentials format...
    //   // name: "Credentials",
    //   // credentials: {
    //   //   email: { label: "Email", type: "email" },
    //   //   password: { label: "Password", type: "password" },
    //   // },
    //   async authorize(credentials) {
    //     // console.log(credentials);
        
    //     const user = await prisma.user.findUnique({ where: {email: credentials.email} });
    //     if (!user) throw new Error("User not found");

    //     const isValid = await bcrypt.compare(credentials.password, user.password);
    //     if (!isValid) throw new Error("Invalid credentials");
    //     return {
    //       // id: user._id.toString(),   //MongoDB's ID is always a string
    //       id: user.id, 
    //       firstName: user.firstName,
    //       lastName: user.lastName,
    //       email: user.email,
    //       role: user.role,
    //       allowedRoutes: user.role === "ADMIN" ? ["/","/dashboard", "/admin"] : ["/","/dashboard"],
    //     };
    //   },
    // }),
    CredentialsProvider({
      async authorize(credentials) {
        console.log(credentials);
        if (!credentials.identifier || !credentials.password) {
          throw new Error("Identifier and password are required");
        }
    
        // Find user by email, username, or phone number
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { username: credentials.identifier },
              { phone: credentials.identifier },
            ],
          },
        });
    
        if (!user) throw new Error("User not found");
    
        // Validate password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid credentials");
    
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          firnName:user.firnName,
          allowedRoutes: user.role === "ADMIN" ? ["/", "/dashboard", "/admin"] : ["/", "/dashboard"],
        };
      },
    }),
    
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.allowedRoutes = user.allowedRoutes;
      }
      // console.log("Updated JWT token: ", token);
      return token;
    },
    async session({ session, token }) {
      if(token){
        session.user.id = token.id;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.role = token.role;
        session.user.allowedRoutes = token.allowedRoutes;
      }
      // console.log("Updated session: ", session);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
