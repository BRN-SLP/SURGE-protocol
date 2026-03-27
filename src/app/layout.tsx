import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SURGE Protocol — Your Reputation. Your Identity. Unchained.",
    template: "%s | SURGE Protocol",
  },
  description:
    "Identity-first reputation protocol on Optimism Superchain. One identity across every wallet. Lose a key, keep everything.",
  keywords: ["Web3", "identity", "reputation", "Superchain", "Optimism", "DeFi"],
  openGraph: {
    title: "SURGE Protocol",
    description: "Your Reputation. Your Identity. Unchained. One identity across every wallet.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SURGE Protocol",
    description: "Your Reputation. Your Identity. Unchained.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
