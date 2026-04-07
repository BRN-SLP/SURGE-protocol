// Per-chain SurgeIdentity proxy addresses (ERC-1967 proxies, v2 ERC-1155 rebuild)
export const SURGE_IDENTITY_ADDRESSES: Record<number, `0x${string}`> = {
  84532: "0xeBEEE0F31Aa48836631F7C9E1fadad595009eBe3", // Base Sepolia
  11155420: "0x7BaC76EC1a9E5f048dcF115623EB49d0aA826fDf", // OP Sepolia
  1301: "0x7BaC76EC1a9E5f048dcF115623EB49d0aA826fDf", // Unichain Sepolia
  4202: "0x7BaC76EC1a9E5f048dcF115623EB49d0aA826fDf", // Lisk Sepolia
  4801: "0x7BaC76EC1a9E5f048dcF115623EB49d0aA826fDf", // Worldchain Sepolia
  763373: "0x7BaC76EC1a9E5f048dcF115623EB49d0aA826fDf", // Ink Sepolia
  919: "0xdec42A0f052e84E2121bFe94F18A8fAFFc2E3811", // Mode Sepolia
  999999999: "0xdec42A0f052e84E2121bFe94F18A8fAFFc2E3811", // Zora Sepolia
  1946: "0xdec42A0f052e84E2121bFe94F18A8fAFFc2E3811", // Soneium Minato
  11142220: "0x27a4381ef8c9184fa82e7d13af96f562bcfe213b", // Celo Sepolia
};

// Per-chain SurgeScore addresses
export const SURGE_SCORE_ADDRESSES: Record<number, `0x${string}`> = {
  84532: "0x9859bd2D159A565B9385870f27C1CAB3353cB2D8",
  11155420: "0xdec42A0f052e84E2121bFe94F18A8fAFFc2E3811",
  1301: "0xdec42A0f052e84E2121bFe94F18A8fAFFc2E3811",
  4202: "0xdec42A0f052e84E2121bFe94F18A8fAFFc2E3811",
  4801: "0xdec42A0f052e84E2121bFe94F18A8fAFFc2E3811",
  763373: "0xdec42A0f052e84E2121bFe94F18A8fAFFc2E3811",
  919: "0xeBEEE0F31Aa48836631F7C9E1fadad595009eBe3",
  999999999: "0xeBEEE0F31Aa48836631F7C9E1fadad595009eBe3",
  1946: "0xeBEEE0F31Aa48836631F7C9E1fadad595009eBe3",
  11142220: "0xff56358a8303060d117003ea1d6b0328af4615fa", // Celo Sepolia
};

// Legacy single-address exports (Base Sepolia default) — kept for backwards compat
export const SURGE_IDENTITY_ADDRESS = SURGE_IDENTITY_ADDRESSES[84532];
export const SURGE_SCORE_ADDRESS = SURGE_SCORE_ADDRESSES[84532];

export interface OracleChain {
  id: number;
  name: string;
  shortName: string;
  rpc: string;
  deployBlock: number; // block when v2 contracts were deployed — oracle scans from here
  hasBadge: boolean;
}

export const ORACLE_CHAINS: OracleChain[] = [
  {
    id: 84532,
    name: "Base Sepolia",
    shortName: "base",
    rpc: "https://sepolia.base.org",
    deployBlock: 39904423,
    hasBadge: true,
  },
  {
    id: 11155420,
    name: "OP Sepolia",
    shortName: "op",
    rpc: "https://sepolia.optimism.io",
    deployBlock: 41887318,
    hasBadge: false,
  },
  {
    id: 4202,
    name: "Lisk Sepolia",
    shortName: "lisk",
    rpc: "https://rpc.sepolia-api.lisk.com",
    deployBlock: 35132131,
    hasBadge: true,
  },
  {
    id: 999999999,
    name: "Zora Sepolia",
    shortName: "zora",
    rpc: "https://sepolia.rpc.zora.energy",
    deployBlock: 38748630,
    hasBadge: true,
  },
  {
    id: 763373,
    name: "Ink Sepolia",
    shortName: "ink",
    rpc: "https://rpc-gel-sepolia.inkonchain.com",
    deployBlock: 46573987,
    hasBadge: true,
  },
  {
    id: 919,
    name: "Mode Sepolia",
    shortName: "mode",
    rpc: "https://sepolia.mode.network",
    deployBlock: 43854708,
    hasBadge: true,
  },
  {
    id: 4801,
    name: "World Chain Sepolia",
    shortName: "world",
    rpc: "https://worldchain-sepolia.g.alchemy.com/public",
    deployBlock: 27514977,
    hasBadge: true,
  },
  {
    id: 1946,
    name: "Soneium Minato",
    shortName: "soneium",
    rpc: "https://rpc.minato.soneium.org",
    deployBlock: 26191527,
    hasBadge: true,
  },
  {
    id: 1301,
    name: "Unichain Sepolia",
    shortName: "unichain",
    rpc: "https://sepolia.unichain.org",
    deployBlock: 48724809,
    hasBadge: true,
  },
  {
    id: 11142220,
    name: "Celo Sepolia",
    shortName: "celo",
    rpc: "https://celo-sepolia.drpc.org",
    deployBlock: 22302848,
    hasBadge: true,
  },
];
