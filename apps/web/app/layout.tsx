import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Invoice Extractor",
  description: "Extract data from PDF invoices with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="flex h-screen bg-gray-100">
          <Sidebar /> 
          <div className="flex flex-1 flex-col overflow-y-auto">
            <Header />
            {children}
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}