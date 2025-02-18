import type React from "react"
import type { Metadata } from "next"
import { Geist, Azeret_Mono as Geist_Mono } from "next/font/google"
import Navbar from "@/components/Navbar"
import "@/app/css/globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Agenda Plus +",
  description: "Registra tus citas, clientes y servicios de manera sencilla.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex h-screen overflow-hidden bg-gray-50">
          <Navbar />
          <div className="flex-1 overflow-y-scroll scrollbar">
            <main className="h-full">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}

