import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/utils/db";
import crypto from "crypto";
import { ObjectId } from "mongodb"; 

const MAX_DEVICES = 10; 

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
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

        // Check active sessions
        const activeSessions = await prisma.session.findMany({
          where: { userId: userId },
        });

        // if (activeSessions.length >= MAX_DEVICES) {
        //   throw new Error(`You have exceeded the allowed login limit (${MAX_DEVICES} devices).`);
        // }

        // Generate a session token
        const sessionToken = crypto.randomBytes(32).toString("hex");

        // Store session in DB
        await prisma.session.create({
          data: {
            userId: userId,
            token: sessionToken,
            device: credentials.device || "Unknown Device",
            ip: credentials.ip || "Unknown IP",
          },
        });

        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          phone: user.phone,
          role: user.role,
          profilePhoto: user.profilePhoto,
          age: user.age,
          gender: user.gender,
          address: {
            houseNumber: user.houseNumber,
            street: user.street,
            buildingName: user.buildingName,
            landmark: user.landmark,
            city: user.city,
            state: user.state,
            country: user.country,
            zipCode: user.zipCode,
          },
          mobileNumber: user.mobileNumber,
          firmName: user.firmName,
          shopAddress: user.shopAddress,
          contactEmail: user.contactEmail,
          paymentDetails: user.paymentDetails,
          description: user.description,
          hashtags: user.hashtags,
          photos: user.photos,
          shopOpenTime: user.shopOpenTime,
          shopCloseTime: user.shopCloseTime,
          shopOpenDays: user.shopOpenDays,
          latitude: user.latitude,
          longitude: user.longitude,
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
        token.email = user.email;
        token.username = user.username;
        token.phone = user.phone;
        token.role = user.role;
        token.profilePhoto = user.profilePhoto;
        token.age = user.age;
        token.gender = user.gender;
        token.address = user.address;
        token.mobileNumber = user.mobileNumber;
        token.firmName = user.firmName;
        token.shopAddress = user.shopAddress;
        token.contactEmail = user.contactEmail;
        token.paymentDetails = user.paymentDetails;
        token.description = user.description;
        token.hashtags = user.hashtags;
        token.photos = user.photos;
        token.shopOpenTime = user.shopOpenTime;
        token.shopCloseTime = user.shopCloseTime;
        token.shopOpenDays = user.shopOpenDays;
        token.latitude = user.latitude;
        token.longitude = user.longitude;
        token.allowedRoutes = user.allowedRoutes;
        token.sessionToken = user.sessionToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.phone = token.phone;
        session.user.role = token.role;
        session.user.profilePhoto = token.profilePhoto;
        session.user.age = token.age;
        session.user.gender = token.gender;
        session.user.address = token.address;
        session.user.mobileNumber = token.mobileNumber;
        session.user.firmName = token.firmName;
        session.user.shopAddress = token.shopAddress;
        session.user.contactEmail = token.contactEmail;
        session.user.paymentDetails = token.paymentDetails;
        session.user.description = token.description;
        session.user.hashtags = token.hashtags;
        session.user.photos = token.photos;
        session.user.shopOpenTime = token.shopOpenTime;
        session.user.shopCloseTime = token.shopCloseTime;
        session.user.shopOpenDays = token.shopOpenDays;
        session.user.latitude = token.latitude;
        session.user.longitude = token.longitude;
        session.user.allowedRoutes = token.allowedRoutes;
      }
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