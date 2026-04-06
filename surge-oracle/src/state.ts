import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const STATE_FILE = join(process.cwd(), "oracle-state.json");

export interface OracleState {
  lastProcessedBlock: Record<string, number>;
  knownHolders: Record<string, string[]>; // chainShortName → wallet addresses
  lastRunAt: string;
}

export function loadState(): OracleState {
  try {
    const s = JSON.parse(readFileSync(STATE_FILE, "utf-8")) as Partial<OracleState>;
    return {
      lastProcessedBlock: s.lastProcessedBlock ?? {},
      knownHolders: s.knownHolders ?? {},
      lastRunAt: s.lastRunAt ?? new Date(0).toISOString(),
    };
  } catch {
    return { lastProcessedBlock: {}, knownHolders: {}, lastRunAt: new Date(0).toISOString() };
  }
}

export function saveState(state: OracleState): void {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}
