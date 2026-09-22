import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { AppFrame } from "@/components/layout/AppFrame";

export const metadata: Metadata = {
  title: "Deadline Defender — King County Eviction Defense",
  description:
    "Legal aid case management and document generation for eviction defense advocates in King County, WA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} bg-black`}
      suppressHydrationWarning
    >
      <body className={`${GeistSans.className} ${GeistMono.variable} antialiased min-h-screen bg-black text-foreground`}>
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  );
}
