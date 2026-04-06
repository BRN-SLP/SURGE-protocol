"use client";

import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { wagmiConfig } from "@/lib/wagmi";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

const surgeTheme = darkTheme({
  accentColor: "#dc3333",
  accentColorForeground: "#f5f5f5",
  borderRadius: "small",
  fontStack: "system",
  overlayBlur: "none",
});

// Override background colors to match our design
const theme = {
  ...surgeTheme,
  colors: {
    ...surgeTheme.colors,
    modalBackground: "#141414",
    modalBorder: "#2a2a2a",
    menuItemBackground: "#1a1a1a",
    profileForeground: "#141414",
    connectButtonBackground: "#141414",
    connectButtonInnerBackground: "#1a1a1a",
  },
};

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={theme}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
