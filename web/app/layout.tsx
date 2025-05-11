import "@/styles/globals.css";
import { cn } from "@/utils/cn";
import { outfit, plusJakartaSans } from "@/utils/fonts";
import getMetadata from "@/utils/helpers/metadata";
import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "JOINMUN 2025",
//   description: "Jogjakarta International Model United Nations 2025",
// };

export const metadata: Metadata = getMetadata({
  title: "Jogjakarta International Model United Nations 2025",
  description:
    "Jogjakarta International Model United Nations 2025 is a simulation of the United Nations General Assembly, where participants will represent countries and discuss and debate global issues.",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="7nd1GeM2rKgHgw3IK89kDHxOgJcJsMUUHNqgRNd98nw"
        />
        <meta name="apple-mobile-web-app-title" content="JOINMUN" />
      </head>
      <body
        className={cn(
          plusJakartaSans.className,
          outfit.variable,
          "bg-background text-primary-foreground antialiased",
        )}
      >
        {children}
      </body>
    </html>
  );
}
