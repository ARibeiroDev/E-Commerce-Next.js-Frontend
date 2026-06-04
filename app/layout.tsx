import type { Metadata } from "next";
import { Geist, Geist_Mono, Lato } from "next/font/google";
import "@/app/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/providers/AuthProvider";
import CartProvider from "@/components/providers/CartProvider";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | ClothingCo.",
    default: "ClothingCo.",
  },
  description: "Quality Clothing at Affordable Prices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lato.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-gray-100 dark:bg-stone-900 text-stone-800 dark:text-gray-100 overflow-x-hidden">
        <AuthProvider>
          <CartProvider />
          <Header />
          {children}
          <Footer />
          <ToastContainer position="bottom-right" autoClose={2000} />
        </AuthProvider>
      </body>
    </html>
  );
}
