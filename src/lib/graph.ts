import { GraphQLClient } from "graphql-request";
import { SUBGRAPH_CHAINS, type ChainConfig } from "@/lib/chains";

const clientCache = new Map<string, GraphQLClient>();

export function getGraphClient(chain: ChainConfig & { subgraphUrl: string }): GraphQLClient {
  if (!clientCache.has(chain.key)) {
    clientCache.set(
      chain.key,
      new GraphQLClient(chain.subgraphUrl, {
        requestMiddleware: (req) => ({
          ...req,
          signal: AbortSignal.timeout(10_000), // 10s timeout per query
        }),
      }),
    );
  }
  return clientCache.get(chain.key)!;
}

// Backward-compat: Base Sepolia client used by any callers not yet migrated.
export const graphClient = getGraphClient(SUBGRAPH_CHAINS[0]);
