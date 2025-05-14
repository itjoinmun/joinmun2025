import "@/styles/globals.css";
import { cn } from "@/utils/helpers/cn";
import { outfit, plusJakartaSans } from "@/utils/helpers/fonts";
import getMetadata from "@/utils/helpers/metadata";
import type { Metadata } from "next";
import Script from "next/script";

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
        <meta name="keywords" content="JOINMUN, event, MUN, joinmun, MUN 2025, mun event" />
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              name: "Jogjakarta International Model United Nations 2025",
              description:
                "Jogjakarta International Model United Nations 2025 is a simulation of the United Nations General Assembly, where participants will represent countries and discuss and debate global issues.",
              startDate: "2025-01-01",
              endDate: "2025-01-05",
              location: {
                "@type": "Place",
                name: "Yogyakarta",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Yogyakarta",
                  addressRegion: "Yogyakarta",
                  addressCountry: "ID",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: -7.7956,
                  longitude: 110.3695,
                },
              },
              organizer: {
                "@type": "Organization",
                name: "JOINMUN",
                url: "https://joinmun.id",
              },
              offers: {
                "@type": "Offer",
                availability: "https://schema.org/InStock",
                price: "0",
                priceCurrency: "IDR",
              },
              performer: {
                "@type": "Organization",
                name: "JOINMUN Team",
              },
            }),
          }}
        />
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
