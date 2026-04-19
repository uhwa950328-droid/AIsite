import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import { NavigationProgress } from "@/components/layout/NavigationProgress";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "AI Review",
  description: "AI 툴 랭킹과 카테고리별 목록, 리뷰",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
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
