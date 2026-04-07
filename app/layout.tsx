import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "LinkHarbor | High-Speed File Downloader & Secure Vault",
  description: "LinkHarbor is a secure, high-speed file downloader and vault service. Accelerate your downloads with our VPS relay, batch process URL lists, and store files safely.",
  keywords: ["file downloader", "high speed download", "vps relay", "secure vault", "link harbor", "batch downloader", "file storage"],
  authors: [{ name: "EverydayCodings" }],
  openGraph: {
    title: "LinkHarbor | High-Speed File Downloader & Secure Vault",
    description: "Accelerate your downloads and secure your files with LinkHarbor.",
    url: "https://linkharbor.everydaycodings.com", // Placeholder URL based on the user's corpus name
    siteName: "LinkHarbor",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LinkHarbor - High-Speed File Downloader",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkHarbor | High-Speed File Downloader & Secure Vault",
    description: "Accelerate your downloads and secure your files with LinkHarbor.",
    images: ["/og-image.png"],
    creator: "@everydaycodings",
  },
  icons: {
    icon: [
      { url: "/favicon.png" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
