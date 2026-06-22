import type { Metadata } from "next";
import { Inter, DM_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AlgoViz | Your Code, Animated",
  description: "Paste your DSA code and see it animated step-by-step. Find bugs, understand pointers, and learn patterns.",
};

import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmMono.variable} ${jetBrainsMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
