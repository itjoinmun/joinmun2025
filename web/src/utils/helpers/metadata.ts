export default function getMetadata({
  title = "JOINMUN 2025",
  description = "Jogjakarta International Model United Nations 2025 is a simulation of the United Nations General Assembly, where participants will represent countries and discuss and debate global issues.",
}) {
  return {
    title,
    description,
    metadataBase: new URL("https://joinmun.id/"),

    // Robots meta tag
    robots: {
      index: true, // Allow indexing
      follow: true, // Allow link-following
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
