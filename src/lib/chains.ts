export type SubgraphChainKey = "base-sepolia" | "op-sepolia" | "mode-sepolia" | "zora-sepolia";
export type DirectReadChainKey =
  | "lisk-sepolia"
  | "ink-sepolia"
  | "world-chain-sepolia"
  | "soneium-minato"
  | "unichain-sepolia"
  | "celo-sepolia";
export type ChainKey = SubgraphChainKey | DirectReadChainKey;

export interface ChainConfig {
  key: ChainKey;
  name: string;
  shortName: string;
  chainId: number;
  subgraphUrl: string | null;
}

export const CHAIN_CONFIGS: ChainConfig[] = [
  {
    key: "base-sepolia",
    name: "Base Sepolia",
    shortName: "Base",
    chainId: 84532,
    subgraphUrl: "https://api.studio.thegraph.com/query/1747406/surge-protocol/v0.0.3",
  },
  {
    key: "op-sepolia",
    name: "OP Sepolia",
    shortName: "OP",
    chainId: 11155420,
    subgraphUrl: "https://api.studio.thegraph.com/query/1747406/surge-protocol-op/v0.0.1",
  },
  {
    key: "mode-sepolia",
    name: "Mode Sepolia",
    shortName: "Mode",
    chainId: 919,
    subgraphUrl: null,
  },
  {
    key: "zora-sepolia",
    name: "Zora Sepolia",
    shortName: "Zora",
    chainId: 999999999,
    subgraphUrl: null,
  },
  {
    key: "lisk-sepolia",
    name: "Lisk Sepolia",
    shortName: "Lisk",
    chainId: 4202,
    subgraphUrl: null,
  },
  {
    key: "ink-sepolia",
    name: "Ink Sepolia",
    shortName: "Ink",
    chainId: 763373,
    subgraphUrl: null,
  },
  {
    key: "world-chain-sepolia",
    name: "World Chain Sepolia",
    shortName: "World",
    chainId: 4801,
    subgraphUrl: null,
  },
  {
    key: "soneium-minato",
    name: "Soneium Minato",
    shortName: "Soneium",
    chainId: 1946,
    subgraphUrl: null,
  },
  {
    key: "unichain-sepolia",
    name: "Unichain Sepolia",
    shortName: "Unichain",
    chainId: 1301,
    subgraphUrl: null,
  },
  {
    key: "celo-sepolia",
    name: "Celo Sepolia",
    shortName: "Celo",
    chainId: 11142220,
    subgraphUrl: null,
  },
];

export const SUBGRAPH_CHAINS = CHAIN_CONFIGS.filter(
  (c): c is ChainConfig & { subgraphUrl: string } => c.subgraphUrl !== null,
);

export const DIRECT_READ_CHAINS = CHAIN_CONFIGS.filter((c) => c.subgraphUrl === null);

export function getChainByChainId(chainId: number): ChainConfig | undefined {
  return CHAIN_CONFIGS.find((c) => c.chainId === chainId);
}
