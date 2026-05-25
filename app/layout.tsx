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
  },
  twitter: {
    card: "summary_large_image",
    title: "Mercury Skills",
    description: "Curated, open-source skills for the Mercury Agent.",
  },
  icons: {
    icon: "/favicon.svg",
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
