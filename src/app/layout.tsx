import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://ayre.example"),
  title: "AYRE",
  description: "AYRE scores public macro predictions and turns track records into browseable scorecards.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${mono.variable}`}>
        <div className="min-h-screen bg-app text-white">
          <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 pb-10 md:px-6">
            <SiteHeader />
            <main className="flex-1 py-8">{children}</main>
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
