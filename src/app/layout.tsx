import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BanaSat - Alıcı İlan Platformu",
  description: "Aradığınızı değil, en uygun teklifi bulun.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} antialiased light`} suppressHydrationWarning>
      <head>
      </head>
      <body className="font-sans min-h-full flex flex-col bg-background-light dark:bg-background-dark text-gray-900 dark:text-white transition-colors duration-200">
        <div className="relative flex h-auto min-h-screen w-full flex-col">
          <AuthProvider>
            {children}
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
