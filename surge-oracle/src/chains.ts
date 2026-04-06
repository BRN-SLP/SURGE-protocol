export const SURGE_IDENTITY_ADDRESS = "0xd0056f2aa729a2b9e8da9cd1d893bd4d8bf3af26" as const;
export const SURGE_SCORE_ADDRESS = "0x27a4381ef8c9184fa82e7d13af96f562bcfe213b" as const;

export interface OracleChain {
  id: number;
  name: string;
  shortName: string;
  rpc: string;
  deployBlock: number; // block when contracts were deployed — oracle scans from here
  hasBadge: boolean;
}

export const ORACLE_CHAINS: OracleChain[] = [
  {
    id: 84532,
    name: "Base Sepolia",
    shortName: "base",
    rpc: "https://sepolia.base.org",
    deployBlock: 39692832,
    hasBadge: true,
  },
  {
    id: 11155420,
    name: "OP Sepolia",
    shortName: "op",
    rpc: "https://sepolia.optimism.io",
    deployBlock: 41405350,
    hasBadge: false,
  },
  {
    id: 4202,
    name: "Lisk Sepolia",
    shortName: "lisk",
    rpc: "https://rpc.sepolia-api.lisk.com",
    deployBlock: 34920404,
    hasBadge: true,
  },
  {
    id: 999999999,
    name: "Zora Sepolia",
    shortName: "zora",
    rpc: "https://sepolia.rpc.zora.energy",
    deployBlock: 38536915,
    hasBadge: true,
  },
  {
    id: 763373,
    name: "Ink Sepolia",
    shortName: "ink",
    rpc: "https://rpc-gel-sepolia.inkonchain.com",
    deployBlock: 46150552,
    hasBadge: true,
  },
  {
    id: 919,
    name: "Mode Sepolia",
    shortName: "mode",
    rpc: "https://sepolia.mode.network",
    deployBlock: 43642968,
    hasBadge: true,
  },
  {
    id: 4801,
    name: "World Chain Sepolia",
    shortName: "world",
    rpc: "https://worldchain-sepolia.g.alchemy.com/public",
    deployBlock: 27303230,
    hasBadge: true,
  },
  {
    id: 1946,
    name: "Soneium Minato",
    shortName: "soneium",
    rpc: "https://rpc.minato.soneium.org",
    deployBlock: 25979783,
    hasBadge: true,
  },
  {
    id: 1301,
    name: "Unichain Sepolia",
    shortName: "unichain",
    rpc: "https://sepolia.unichain.org",
    deployBlock: 48301491,
    hasBadge: true,
  },
];
