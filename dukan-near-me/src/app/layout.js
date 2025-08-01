import { Plus_Jakarta_Sans, Rubik, Work_Sans, Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SessionProviderWrapper from "@/app/components/SessionManager/SessionProviderWrapper"; 
import { UserProvider } from "@/context/UserContext";
import { StrictMode } from 'react';
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
  title: "NearBuyDukan",
  description: "Find nearest shops and medical institutes with best ratings",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}> */}
      <body className={`${rubik.variable} ${plusJakartaSans.variable} ${poppins.variable} antialiased`}>
        <StrictMode>
          {/* <HeaderLocation /> */}
          <UserProvider>
            <SessionProviderWrapper> {/* ✅ Wrap in a client component */}
            {/* <LoaderWrapper>  */}
                {children}
              {/* </LoaderWrapper> */}
              <Toaster position="top-right" reverseOrder={false} />
                {/* <SocketInitializer /> */}
            </SessionProviderWrapper>
          </UserProvider>
        </StrictMode>
      </body>
    </html>
  );
}
