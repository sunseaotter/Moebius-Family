import type { Metadata } from "next";
import { Geist, Geist_Mono, Zen_Maru_Gothic } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { PendingBanner } from "@/components/pending-banner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const zenMaru = Zen_Maru_Gothic({
  variable: "--font-zen-maru",
  weight: ["500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Moebius Family",
  description: "A place for Moebius to get to know each other and to connect.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${zenMaru.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-wood-50 text-wood-900">
        <PendingBanner />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-wood-200 py-8 text-center text-xs text-wood-500">
          The Moebius Family — a place to know each other and to connect.
        </footer>
      </body>
    </html>
  );
}
