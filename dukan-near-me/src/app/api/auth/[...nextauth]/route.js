import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/utils/db";
import crypto from "crypto";
import { ObjectId } from "mongodb"; 

const MAX_DEVICES = 3; 

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
      // GithubProvider({
      //   clientId: process.env.GITHUB_ID,
      //   clientSecret: process.env.GITHUB_SECRET,
      // }),
      // GoogleProvider({
      //   clientId: process.env.GOOGLE_ID,
      //   clientSecret: process.env.GOOGLE_SECRET,
      // }),
    CredentialsProvider({
      async authorize(credentials) {
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
        const userId = new ObjectId(user.id);

        const activeSessions = await prisma.session.findMany({
          where: { userId: userId },
        });
    
    
        if (activeSessions.length >= MAX_DEVICES) {
          throw new Error(`You have exceeded the allowed login limit (${MAX_DEVICES} devices).`);
        }
    
        // Generate a unique token for the session
        const sessionToken = crypto.randomBytes(32).toString("hex");
    
        // Store the new session in the database
        await prisma.session.create({
          data: {
            userId: userId,
            token: sessionToken,
            device: credentials.device || "Unknown Device", // Pass device info from frontend
            ip: credentials.ip || "Unknown IP",
          },
        });

        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          allowedRoutes: user.role === "ADMIN" ? ["/", "/dashboard", "/admin"] : ["/", "/dashboard"],
          sessionToken,
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
        token.sessionToken = user.sessionToken;
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
