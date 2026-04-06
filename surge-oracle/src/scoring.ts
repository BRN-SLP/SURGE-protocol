import type { PublicClient } from "viem";
import { SURGE_IDENTITY_ADDRESS } from "./chains.js";

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

const IDENTITY_MINTED_ABI = [
  {
    type: "event",
    name: "IdentityMinted",
    inputs: [
      { name: "to", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "position", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
] as const;

// ── Wallet discovery ──────────────────────────────────────────

// Public RPCs limit eth_getLogs to 10k blocks per request.
const LOG_CHUNK = 9_000n;

async function getLogsInChunks(
  client: PublicClient,
  params: { address: `0x${string}`; event: (typeof IDENTITY_MINTED_ABI)[0] },
  fromBlock: bigint,
  toBlock: bigint,
) {
  const allLogs = [];
  for (let from = fromBlock; from <= toBlock; from += LOG_CHUNK) {
    const to = from + LOG_CHUNK - 1n > toBlock ? toBlock : from + LOG_CHUNK - 1n;
    try {
      const chunk = await client.getLogs({ ...params, fromBlock: from, toBlock: to });
      allLogs.push(...chunk);
    } catch {
      // skip chunk silently — best effort
    }
  }
  return allLogs;
}

export async function getIdentityHolders(
  client: PublicClient,
  fromBlock: bigint,
  toBlock: bigint,
): Promise<`0x${string}`[]> {
  const logs = await getLogsInChunks(
    client,
    { address: SURGE_IDENTITY_ADDRESS, event: IDENTITY_MINTED_ABI[0] },
    fromBlock,
    toBlock,
  );
  const addresses = logs
    .map((l) => l.args.to as `0x${string}` | undefined)
    .filter((a): a is `0x${string}` => !!a);
  return [...new Set(addresses)];
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
): Promise<ScoringResult[]> {
  const results: ScoringResult[] = [];

  // Check for new identity mints in this block range
  const mintLogs = await getLogsInChunks(
    client,
    { address: SURGE_IDENTITY_ADDRESS, event: IDENTITY_MINTED_ABI[0] },
    fromBlock,
    toBlock,
  );
  const newWallets = new Set(
    mintLogs
      .map((l) => l.args.to as string | undefined)
      .filter(Boolean)
      .map((a) => a!.toLowerCase()),
  );

  // Process in batches of 10 to avoid RPC rate limits
  const BATCH = 10;
  for (let i = 0; i < wallets.length; i += BATCH) {
    const batch = wallets.slice(i, i + BATCH);

    await Promise.all(
      batch.map(async (wallet) => {
        // One-time identity creation bonus
        if (newWallets.has(wallet.toLowerCase())) {
          results.push({ wallet, points: 50, reason: "oracle.joined" });
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
