import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/utils/helpers/cn";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JOINMUN 2025",
  description: "Jogjakarta International Model United Nations 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(plusJakartaSans.variable, plusJakartaSans.className, "antialiased")}>
        {children}
      </body>
    </html>
  );
}
