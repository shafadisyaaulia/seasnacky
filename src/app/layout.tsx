import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google"; 
import "./globals.css"; 

import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { CartProvider } from "@/context/CartContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { Toaster } from 'react-hot-toast'; // ✅ WAJIB DIIMPORT
import ShopStatusChecker from "@/components/ShopStatusChecker";

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
        
        <NotificationProvider>
          <CartProvider>
            <ShopStatusChecker />
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </CartProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}