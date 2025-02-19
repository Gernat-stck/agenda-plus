// app/layout.tsx
import React, { ReactNode } from "react";
import { ClienteProvider } from "@/contexts/ClienteContext";
import { CitasProvider } from "@/contexts/CitasContext";
import { Geist, Azeret_Mono as Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "@/app/css/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Agenda Plus +",
  description: "Registra tus citas, clientes y servicios de manera sencilla.",
};

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClienteProvider>
          <CitasProvider>
            <div className="flex h-screen overflow-hidden bg-gray-50">
              <Navbar />
              <div className="flex-1 overflow-y-scroll scrollbar">
                <main className="h-full">{children}</main>
              </div>
            </div>
          </CitasProvider>
        </ClienteProvider>
      </body>
    </html>
  );
}

export default Layout;