import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import { NavigationProgress } from "@/components/layout/NavigationProgress";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

const defaultSiteUrl = "http://localhost:3000";

function getMetadataBase(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);
  if (process.env.VERCEL_URL)
    return new URL(`https://${process.env.VERCEL_URL}`);
  return new URL(defaultSiteUrl);
}

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const ogTitle = "AI Review";
const ogDescription = "AI 툴 랭킹과 카테고리별 목록, 리뷰";

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: ogTitle,
  description: ogDescription,
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: ogTitle,
    title: ogTitle,
    description: ogDescription,
    images: [
      {
        url: "/og.png",
        width: 1024,
        height: 386,
        alt: "AI TOOL RANKING",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ogTitle,
    description: ogDescription,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-dvh font-sans antialiased`}
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
