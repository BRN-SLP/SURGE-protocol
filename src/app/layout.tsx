import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
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
    <html lang="en" className={robotoCondensed.variable} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <PostHogProvider>{children}</PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
