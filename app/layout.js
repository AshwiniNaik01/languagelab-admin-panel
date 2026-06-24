import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Language Lab — Admin Panel",
  description: "SuperAdmin dashboard for managing institutes, editors, students and licenses.",
};

import ProtectedRoute from "./components/ProtectedRoute";
import { SidebarProvider } from "./components/SidebarContext";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SidebarProvider>
          <ProtectedRoute>{children}</ProtectedRoute>
        </SidebarProvider>
      </body>
    </html>
  );
}
