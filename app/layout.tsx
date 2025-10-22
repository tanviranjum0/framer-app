import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";

const geistSans = Mulish({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Framer Motion",
  description:
    "Framer Motion is a production-ready motion library for React that brings your applications to life with sophisticated, performant animations. Built by Framer for professional developers, it provides a declarative API for creating fluid, accessible interactions that enhance user experience and interface polish.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} antialiased`}>{children}</body>
    </html>
  );
}
