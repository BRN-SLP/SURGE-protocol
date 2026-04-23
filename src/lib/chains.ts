export type SubgraphChainKey = "base-sepolia" | "op-sepolia" | "celo-sepolia";
export type DirectReadChainKey =
  | "mode-sepolia"
  | "zora-sepolia"
  | "lisk-sepolia"
  | "ink-sepolia"
  | "world-chain-sepolia"
  | "soneium-minato"
  | "unichain-sepolia";
export type ChainKey = SubgraphChainKey | DirectReadChainKey;

export interface ChainConfig {
  key: ChainKey;
  name: string;
  shortName: string;
  chainId: number;
  subgraphUrl: string | null;
  deployBlock: bigint;
}

export const CHAIN_CONFIGS: ChainConfig[] = [
  {
    key: "base-sepolia",
    name: "Base Sepolia",
    shortName: "Base",
    chainId: 84532,
    subgraphUrl: "https://api.studio.thegraph.com/query/1747406/surge-protocol/v0.0.4",
    deployBlock: 39904423n,
  },
  {
    key: "op-sepolia",
    name: "OP Sepolia",
    shortName: "OP",
    chainId: 11155420,
    subgraphUrl: "https://api.studio.thegraph.com/query/1747406/surge-protocol-op/v0.0.2",
    deployBlock: 41887318n,
  },
  {
    key: "mode-sepolia",
    name: "Mode Sepolia",
    shortName: "Mode",
    chainId: 919,
    subgraphUrl: null,
    deployBlock: 43854708n,
  },
  {
    key: "zora-sepolia",
    name: "Zora Sepolia",
    shortName: "Zora",
    chainId: 999999999,
    subgraphUrl: null,
    deployBlock: 38748630n,
  },
  {
    key: "lisk-sepolia",
    name: "Lisk Sepolia",
    shortName: "Lisk",
    chainId: 4202,
    subgraphUrl: null,
    deployBlock: 35132131n,
  },
  {
    key: "ink-sepolia",
    name: "Ink Sepolia",
    shortName: "Ink",
    chainId: 763373,
    subgraphUrl: null,
    deployBlock: 46573987n,
  },
  {
    key: "world-chain-sepolia",
    name: "World Chain Sepolia",
    shortName: "World",
    chainId: 4801,
    subgraphUrl: null,
    deployBlock: 27514977n,
  },
  {
    key: "soneium-minato",
    name: "Soneium Minato",
    shortName: "Soneium",
    chainId: 1946,
    subgraphUrl: null,
    deployBlock: 26191527n,
  },
  {
    key: "unichain-sepolia",
    name: "Unichain Sepolia",
    shortName: "Unichain",
    chainId: 1301,
    subgraphUrl: null,
    deployBlock: 48724809n,
  },
  {
    key: "celo-sepolia",
    name: "Celo Sepolia",
    shortName: "Celo",
    chainId: 11142220,
    subgraphUrl: "https://api.studio.thegraph.com/query/1747406/surge-protocol-celo/v0.0.1",
    deployBlock: 22302848n,
  },
];

export const SUBGRAPH_CHAINS = CHAIN_CONFIGS.filter(
  (c): c is ChainConfig & { key: SubgraphChainKey; subgraphUrl: string } => c.subgraphUrl !== null,
);

export const DIRECT_READ_CHAINS = CHAIN_CONFIGS.filter(
  (c): c is ChainConfig & { key: DirectReadChainKey; subgraphUrl: null } => c.subgraphUrl === null,
);

export function getChainByChainId(chainId: number): ChainConfig | undefined {
  return CHAIN_CONFIGS.find((c) => c.chainId === chainId);
}
