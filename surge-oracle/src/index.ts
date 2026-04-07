import { createPublicClient, createWalletClient, http, type Chain } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { ORACLE_CHAINS, SURGE_SCORE_ADDRESSES } from "./chains.js";
import { getIdentityHolders, computeScores, encodeReason, SURGE_SCORE_ABI } from "./scoring.js";
import { loadState, saveState } from "./state.js";

const ORACLE_PRIVATE_KEY = process.env.ORACLE_PRIVATE_KEY as `0x${string}` | undefined;

async function main() {
  if (!ORACLE_PRIVATE_KEY) {
    throw new Error("ORACLE_PRIVATE_KEY environment variable is required");
  }

  const account = privateKeyToAccount(ORACLE_PRIVATE_KEY);
  const state = loadState();

  console.log(`\nSURGE Oracle — ${new Date().toISOString()}`);
  console.log(`Oracle wallet: ${account.address}`);
  console.log(`Processing ${ORACLE_CHAINS.length} chains\n`);

  for (const chain of ORACLE_CHAINS) {
    console.log(`── ${chain.name} (${chain.id}) ──`);

    const viemChain: Chain = {
      id: chain.id,
      name: chain.name,
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: { default: { http: [chain.rpc] } },
    };

    const publicClient = createPublicClient({
      chain: viemChain,
      transport: http(chain.rpc, { timeout: 30_000 }),
    });

    const walletClient = createWalletClient({
      chain: viemChain,
      transport: http(chain.rpc, { timeout: 30_000 }),
      account,
    });

    let latestBlock: bigint;
    try {
      latestBlock = await publicClient.getBlockNumber();
    } catch (err) {
      console.error(`  RPC unreachable, skipping. (${err})`);
      continue;
    }

    const fromBlock = BigInt(state.lastProcessedBlock[chain.shortName] ?? chain.deployBlock);

    if (fromBlock >= latestBlock) {
      console.log(`  No new blocks (latest=${latestBlock}). Skipping.\n`);
      continue;
    }

    console.log(`  Blocks ${fromBlock} → ${latestBlock}`);

    // Find NEW identity mints since last run and add to known holders
    let newHolders: `0x${string}`[] = [];
    try {
      newHolders = await getIdentityHolders(publicClient, fromBlock, latestBlock, chain.id);
    } catch (err) {
      console.error(`  Failed to fetch new identity holders: ${err}`);
    }

    // Merge with known holders (persistent across runs)
    const existingHolders = new Set<string>(state.knownHolders[chain.shortName] ?? []);
    for (const w of newHolders) existingHolders.add(w.toLowerCase());
    state.knownHolders[chain.shortName] = [...existingHolders];
    const wallets = [...existingHolders] as `0x${string}`[];

    console.log(`  Identity holders: ${wallets.length} (${newHolders.length} new)`);

    if (wallets.length === 0) {
      state.lastProcessedBlock[chain.shortName] = Number(latestBlock);
      console.log();
      continue;
    }

    // Compute score deltas
    let scores;
    try {
      scores = await computeScores(publicClient, wallets, fromBlock, latestBlock, chain.id);
    } catch (err) {
      console.error(`  Failed to compute scores: ${err}`);
      continue;
    }

    console.log(`  Score events: ${scores.length}`);

    // Submit each addScore call on-chain
    let submitted = 0;
    for (const { wallet, points, reason } of scores) {
      try {
        const scoreAddress = SURGE_SCORE_ADDRESSES[chain.id];
        if (!scoreAddress) continue;
        const hash = await walletClient.writeContract({
          address: scoreAddress,
          abi: SURGE_SCORE_ABI,
          functionName: "addScore",
          args: [wallet, BigInt(points), encodeReason(reason)],
        });
        console.log(`  addScore(${wallet.slice(0, 8)}…, ${points}, "${reason}") → ${hash}`);
        submitted++;
        // Small delay to avoid nonce collisions
        await new Promise((r) => setTimeout(r, 1500));
      } catch (err) {
        console.error(`  addScore failed for ${wallet}: ${err}`);
      }
    }

    console.log(`  Submitted: ${submitted}/${scores.length}`);
    state.lastProcessedBlock[chain.shortName] = Number(latestBlock);
    console.log();
  }

  state.lastRunAt = new Date().toISOString();
  saveState(state);
  console.log("Oracle run complete. State saved.");
}

main().catch((err) => {
  console.error("\nFatal error:", err);
  process.exit(1);
});
