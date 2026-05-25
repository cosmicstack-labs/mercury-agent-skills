import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#08090b" },
    { media: "(prefers-color-scheme: light)", color: "#fbfbfa" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://skills.mercuryagent.sh"),
  title: {
    default: "Mercury Skills — the hub for agent skills",
    template: "%s · Mercury Skills",
  },
  description:
    "Discover, browse, and install Mercury agent skills. A curated, open-source library of capabilities for the Mercury Agent.",
  openGraph: {
    title: "Mercury Skills",
    description:
      "Discover, browse, and install Mercury agent skills. A curated, open-source library of capabilities for the Mercury Agent.",
    url: "https://skills.mercuryagent.sh",
    siteName: "Mercury Skills",
    type: "website",
    // og:image is supplied by app/opengraph-image.tsx (dynamic 1200x630 card)
    // and overridden per-skill by app/skills/[...slug]/opengraph-image.tsx.
  },
  twitter: {
    card: "summary_large_image",
    title: "Mercury Skills",
    description: "Curated, open-source skills for the Mercury Agent.",
    // twitter:image mirrors og:image automatically from the convention files.
  },
  icons: {
    icon: [
      {
        url: "/logo-dark.png",
        media: "(prefers-color-scheme: dark)",
        type: "image/png",
      },
      {
        url: "/logo-light.png",
        media: "(prefers-color-scheme: light)",
        type: "image/png",
      },
    ],
    apple: "/logo-dark.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
