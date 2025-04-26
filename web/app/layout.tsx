import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/utils/helpers/cn";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
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
      <body className={cn(plusJakartaSans.variable, plusJakartaSans.className, "antialiased bg-background text-primary-foreground")}>
        {children}
      </body>
    </html>
  );
}
