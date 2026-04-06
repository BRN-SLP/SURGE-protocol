import { http } from "wagmi";
import { optimismSepolia, baseSepolia } from "wagmi/chains";
import { defineChain } from "viem";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

// Custom chains not yet in wagmi/viem defaults
const liskSepolia = defineChain({
  id: 4202,
  name: "Lisk Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.sepolia-api.lisk.com"] } },
  blockExplorers: {
    default: { name: "Lisk Explorer", url: "https://sepolia-blockscout.lisk.com" },
  },
  testnet: true,
});

const zoraSepolia = defineChain({
  id: 999999999,
  name: "Zora Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://sepolia.rpc.zora.energy"] } },
  blockExplorers: {
    default: { name: "Zora Explorer", url: "https://sepolia.explorer.zora.energy" },
  },
  testnet: true,
});

const inkSepolia = defineChain({
  id: 763373,
  name: "Ink Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc-gel-sepolia.inkonchain.com"] } },
  blockExplorers: {
    default: { name: "Ink Explorer", url: "https://explorer-sepolia.inkonchain.com" },
  },
  testnet: true,
});

const modeSepolia = defineChain({
  id: 919,
  name: "Mode Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://sepolia.mode.network"] } },
  blockExplorers: {
    default: { name: "Mode Explorer", url: "https://sepolia.explorer.mode.network" },
  },
  testnet: true,
});

const worldChainSepolia = defineChain({
  id: 4801,
  name: "World Chain Sepolia",
  nativeCurrency: { name: "WLD", symbol: "WLD", decimals: 18 },
  rpcUrls: { default: { http: ["https://worldchain-sepolia.g.alchemy.com/public"] } },
  blockExplorers: {
    default: { name: "World Explorer", url: "https://worldchain-sepolia.explorer.alchemy.com" },
  },
  testnet: true,
});

const soneiumMinato = defineChain({
  id: 1946,
  name: "Soneium Minato",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.minato.soneium.org"] } },
  blockExplorers: {
    default: { name: "Soneium Explorer", url: "https://explorer-testnet.soneium.org" },
  },
  testnet: true,
});

const unichainSepolia = defineChain({
  id: 1301,
  name: "Unichain Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://sepolia.unichain.org"] } },
  blockExplorers: {
    default: { name: "Unichain Explorer", url: "https://unichain-sepolia.blockscout.com" },
  },
  testnet: true,
});

export const SURGE_CHAINS = [
  optimismSepolia,
  baseSepolia,
  liskSepolia,
  zoraSepolia,
  inkSepolia,
  modeSepolia,
  worldChainSepolia,
  soneiumMinato,
  unichainSepolia,
] as const;

export const wagmiConfig = getDefaultConfig({
  appName: "SURGE Protocol",
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!,
  chains: SURGE_CHAINS,
  transports: {
    [optimismSepolia.id]: http(),
    [baseSepolia.id]: http(),
    [liskSepolia.id]: http(),
    [zoraSepolia.id]: http(),
    [inkSepolia.id]: http(),
    [modeSepolia.id]: http(),
    [worldChainSepolia.id]: http(),
    [soneiumMinato.id]: http(),
    [unichainSepolia.id]: http(),
  },
  ssr: true,
});
