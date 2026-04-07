import type { PublicClient } from "viem";
import { SURGE_IDENTITY_ADDRESSES } from "./chains.js";

// ── ABIs ──────────────────────────────────────────────────────

export const SURGE_SCORE_ABI = [
  {
    type: "function",
    name: "addScore",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "reason", type: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

// IdentityMinted(address indexed wallet, uint256 indexed identityId, uint256 position)
const IDENTITY_MINTED_EVENT = {
  type: "event",
  name: "IdentityMinted",
  inputs: [
    { name: "wallet", type: "address", indexed: true },
    { name: "identityId", type: "uint256", indexed: true },
    { name: "position", type: "uint256", indexed: false },
  ],
  anonymous: false,
} as const;

// WalletLinked(uint256 indexed identityId, address indexed newWallet, bool promotedToSecurity)
const WALLET_LINKED_EVENT = {
  type: "event",
  name: "WalletLinked",
  inputs: [
    { name: "identityId", type: "uint256", indexed: true },
    { name: "newWallet", type: "address", indexed: true },
    { name: "promotedToSecurity", type: "bool", indexed: false },
  ],
  anonymous: false,
} as const;

// ── Wallet discovery ──────────────────────────────────────────

// Public RPCs limit eth_getLogs to 10k blocks per request.
const LOG_CHUNK = 9_000n;

async function getMintLogs(
  client: PublicClient,
  address: `0x${string}`,
  fromBlock: bigint,
  toBlock: bigint,
) {
  const allLogs = [];
  for (let from = fromBlock; from <= toBlock; from += LOG_CHUNK) {
    const to = from + LOG_CHUNK - 1n > toBlock ? toBlock : from + LOG_CHUNK - 1n;
    try {
      const chunk = await client.getLogs({
        address,
        event: IDENTITY_MINTED_EVENT,
        fromBlock: from,
        toBlock: to,
      });
      allLogs.push(...chunk);
    } catch {
      /* skip chunk silently */
    }
  }
  return allLogs;
}

async function getLinkLogs(
  client: PublicClient,
  address: `0x${string}`,
  fromBlock: bigint,
  toBlock: bigint,
) {
  const allLogs = [];
  for (let from = fromBlock; from <= toBlock; from += LOG_CHUNK) {
    const to = from + LOG_CHUNK - 1n > toBlock ? toBlock : from + LOG_CHUNK - 1n;
    try {
      const chunk = await client.getLogs({
        address,
        event: WALLET_LINKED_EVENT,
        fromBlock: from,
        toBlock: to,
      });
      allLogs.push(...chunk);
    } catch {
      /* skip chunk silently */
    }
  }
  return allLogs;
}

/**
 * Discover all wallet addresses for a chain by scanning:
 * 1. IdentityMinted events (wallet minted their own identity)
 * 2. WalletLinked events (wallet linked to an existing identity)
 */
export async function getIdentityHolders(
  client: PublicClient,
  fromBlock: bigint,
  toBlock: bigint,
  chainId: number,
): Promise<`0x${string}`[]> {
  const identityAddress = SURGE_IDENTITY_ADDRESSES[chainId];
  if (!identityAddress) return [];

  const [mintLogs, linkLogs] = await Promise.all([
    getMintLogs(client, identityAddress, fromBlock, toBlock),
    getLinkLogs(client, identityAddress, fromBlock, toBlock),
  ]);

  const mintedWallets = mintLogs.map((l) => l.args.wallet).filter((a): a is `0x${string}` => !!a);

  const linkedWallets = linkLogs
    .map((l) => l.args.newWallet)
    .filter((a): a is `0x${string}` => !!a);

  return [...new Set([...mintedWallets, ...linkedWallets])];
}

// ── Scoring ───────────────────────────────────────────────────

export interface ScoringResult {
  wallet: `0x${string}`;
  points: number;
  reason: string;
}

export async function computeScores(
  client: PublicClient,
  wallets: `0x${string}`[],
  fromBlock: bigint,
  toBlock: bigint,
  chainId: number,
): Promise<ScoringResult[]> {
  const results: ScoringResult[] = [];
  const identityAddress = SURGE_IDENTITY_ADDRESSES[chainId];
  if (!identityAddress) return [];

  // Check for new identity mints and new linked wallets in this block range
  const [mintLogs, linkLogs] = await Promise.all([
    getMintLogs(client, identityAddress, fromBlock, toBlock),
    getLinkLogs(client, identityAddress, fromBlock, toBlock),
  ]);

  const newMinters = new Set(
    mintLogs
      .map((l) => l.args.wallet)
      .filter(Boolean)
      .map((a) => a!.toLowerCase()),
  );

  const newLinkers = new Set(
    linkLogs
      .map((l) => l.args.newWallet)
      .filter(Boolean)
      .map((a) => a!.toLowerCase()),
  );

  // Process in batches of 10 to avoid RPC rate limits
  const BATCH = 10;
  for (let i = 0; i < wallets.length; i += BATCH) {
    const batch = wallets.slice(i, i + BATCH);

    await Promise.all(
      batch.map(async (wallet) => {
        const walletLower = wallet.toLowerCase();

        // One-time identity creation bonus
        if (newMinters.has(walletLower)) {
          results.push({ wallet, points: 50, reason: "oracle.joined" });
        }

        // Wallet link bonus — rewarded for linking a new wallet
        if (newLinkers.has(walletLower)) {
          results.push({ wallet, points: 20, reason: "oracle.wallet_linked" });
        }

        // Transaction count delta between fromBlock and toBlock
        const [txBefore, txAfter] = await Promise.all([
          client.getTransactionCount({ address: wallet, blockNumber: fromBlock }),
          client.getTransactionCount({ address: wallet, blockNumber: toBlock }),
        ]);

        const newTxs = txAfter - txBefore;
        if (newTxs <= 0) return;

        // Activity presence bonus
        results.push({ wallet, points: 10, reason: "oracle.active" });

        // Volume tier bonus
        if (newTxs >= 20) results.push({ wallet, points: 25, reason: "oracle.txcount" });
        else if (newTxs >= 6) results.push({ wallet, points: 15, reason: "oracle.txcount" });
        else results.push({ wallet, points: 5, reason: "oracle.txcount" });
      }),
    );
  }

  return results;
}

// ── Reason encoding ───────────────────────────────────────────
// bytes32 reason: left-pad UTF-8 string with null bytes

export function encodeReason(reason: string): `0x${string}` {
  const bytes = Buffer.from(reason, "utf-8").slice(0, 32);
  const padded = Buffer.alloc(32);
  bytes.copy(padded, 0);
  return `0x${padded.toString("hex")}`;
}
