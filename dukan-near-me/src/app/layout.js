import { Plus_Jakarta_Sans, Rubik, Work_Sans, Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SocketInitializer from "@/app/components/SocketInitializer";
import SessionProviderWrapper from "@/app/components/SessionManager/SessionProviderWrapper"; 

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: '400'
});
const workSans = Work_Sans({
  variable: '--font-workSans',
  subsets: ["latin"],
  weight: '400'
})

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: '400'
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: '400'
})

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: '400'
})

export const metadata = {
  title: "Dukanwala",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}> */}
      <body className={`${rubik.variable} ${plusJakartaSans.variable} ${poppins.variable} antialiased`}>
      {/* <HeaderLocation /> */}
        <SessionProviderWrapper> {/* ✅ Wrap in a client component */}
          {children}
          <Toaster position="bottom-right" reverseOrder={false} />
            <SocketInitializer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
