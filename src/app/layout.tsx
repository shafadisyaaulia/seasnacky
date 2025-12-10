import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google"; 
import "./globals.css"; 

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from 'react-hot-toast'; // ✅ WAJIB DIIMPORT

/* // Font Google dimatikan sementara agar build Docker tidak Time Out
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
*/

// Metadata sebaiknya tetap dinyalakan
export const metadata: Metadata = {
  title: "SeaSnacky Marketplace",
  description: "Marketplace Hasil Laut Segar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Hapus variable font dari className body */}
      <body className="antialiased">
        
        {/* ======================================================= */}
        {/* ✅ TOASTER DITEMPATKAN DI SINI */}
        <Toaster 
            position="top-center" // Posisinya di tengah atas
            reverseOrder={false} 
        /> 
        {/* ======================================================= */}
        
        <CartProvider>
          <Header />
          <div className="min-h-[60vh]">{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}