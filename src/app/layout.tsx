import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { ToastProvider } from "@/components/ui/ToastProvider";
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
    url: "https://surge-protocol.xyz",
    siteName: "SURGE Protocol",
  },
  twitter: {
    card: "summary_large_image",
    title: "SURGE Protocol",
    description: "Your Reputation. Your Identity. Unchained.",
    site: "@SURGEprotocol",
  },
  metadataBase: new URL("https://surge-protocol.xyz"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={robotoCondensed.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0&icon_names=key,password,terminal"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0&icon_names=key,password,terminal"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <Web3Provider>
            <ToastProvider>
              <PostHogProvider>{children}</PostHogProvider>
            </ToastProvider>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
