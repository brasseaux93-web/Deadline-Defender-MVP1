import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { AppFrame } from "@/components/layout/AppFrame";

export const metadata: Metadata = {
  title: "Deadline Defender — Continuance Vault",
  description:
    "Case management, date defense, and Washington legal instruments for housing, medical, and eviction case managers.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <body className={`${GeistSans.className} ${GeistMono.variable} antialiased`}>
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  );
}
