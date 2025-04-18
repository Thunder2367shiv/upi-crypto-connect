import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import PhantomWalletProvider from "@/lib/PhantomWalletProvider";
import { Toaster } from "@/components/ui/toaster"
import Chatbot from '@/components/Chatbot';
// import PayPalProvider from "@/lib/PayPalProvider"; // ✅ Import the new component

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "UPI Crypto Connect",
  description: "Buy crypto with UPI seamlessly!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* <PayPalProvider>  */}
          <AuthProvider>
            <PhantomWalletProvider>
              <Navbar />
              <main className="bg-gradient-to-t from-green-100  via-cyan-900  to-black animate-gradient-x">{children}</main>
              <Chatbot/>
              <Toaster />
            </PhantomWalletProvider>
          </AuthProvider>
        {/* </PayPalProvider> */}
      </body>
    </html>
  );
}
