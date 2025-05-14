export default function getMetadata({
  title = "JOINMUN 2025",
  description = "Jogjakarta International Model United Nations 2025 is a simulation of the United Nations General Assembly, where participants will represent countries and discuss and debate global issues.",
}) {
  return {
    title,
    description,
    metadataBase: new URL("https://joinmun.id/"),
    keywords: [
      "JOINMUN",
      "Model United Nations",
      "MUN",
      "Jogjakarta",
      "International Conference",
      "Youth Leadership",
      "Diplomacy",
      "UN Simulation",
      "Indonesia MUN",
    ],
    authors: [{ name: "JOINMUN Team" }],
    creator: "JOINMUN",
    publisher: "JOINMUN",
    category: "Education",
    classification: "Conference",
    referrer: "origin-when-cross-origin" as const,

    // Robots meta tag
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large" as const,
        "max-snippet": -1,
      },
    },

    // For mobile optimization
    formatDetection: {
      telephone: false,
    },

    // Open Graph metadata
    openGraph: {
      title,
      description,
      url: "https://joinmun.id/",
      siteName: "JOINMUN",
      images: [
        {
          url: `/metadata/web-app-manifest-512x512.png`,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/png",
        },
      ],
      locale: "id_ID",
      type: "website",
    },

    // Twitter metadata
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/metadata/web-app-manifest-512x512.png`],
      creator: "@joinmun",
      site: "@joinmun",
    },

    // Favicon and icon definitions
    icons: {
      icon: [
        {
          url: `/metadata/favicon-192x192.png`,
          sizes: "192x192",
          type: "image/png",
        },
        {
          url: `/metadata/favicon-512x512.png`,
          sizes: "512x512",
          type: "image/png",
        },
        { url: `/metadata/favicon.ico` },
      ],
      apple: [
        {
          url: `/metadata/apple-touch-icon.png`,
          sizes: "180x180",
          type: "image/png",
        },
      ],
      shortcut: [{ url: `/metadata/favicon.ico` }],
      other: [
        {
          rel: "android-chrome",
          url: `/metadata/web-app-manifest-192x192.png`,
        },
        {
          rel: "android-chrome",
          url: `/metadata/web-app-manifest-512x512.png`,
        },
      ],
    },

    manifest: `/metadata/site.webmanifest`,
  };
}
