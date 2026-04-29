import { describe, it, expect } from "vitest";
import { computeCompromiseFlags, TIMELOCK_SECONDS } from "@/hooks/useCompromiseRequests";

describe("computeCompromiseFlags", () => {
  const requestedAt = 1_000_000; // arbitrary unix timestamp

  it("canCancel=true and canFinalize=false before timelock ends", () => {
    const now = requestedAt + TIMELOCK_SECONDS - 1;
    const { canCancel, canFinalize, timelockEnd } = computeCompromiseFlags(requestedAt, now);
    expect(timelockEnd).toBe(requestedAt + TIMELOCK_SECONDS);
    expect(canCancel).toBe(true);
    expect(canFinalize).toBe(false);
  });

  it("canCancel=false and canFinalize=true exactly at timelock end", () => {
    const now = requestedAt + TIMELOCK_SECONDS;
    const { canCancel, canFinalize } = computeCompromiseFlags(requestedAt, now);
    expect(canCancel).toBe(false);
    expect(canFinalize).toBe(true);
  });

  it("canCancel=false and canFinalize=true well after timelock", () => {
    const now = requestedAt + TIMELOCK_SECONDS + 86400;
    const { canCancel, canFinalize } = computeCompromiseFlags(requestedAt, now);
    expect(canCancel).toBe(false);
    expect(canFinalize).toBe(true);
  });

  it("canCancel=true at requestedAt (just submitted)", () => {
    const { canCancel, canFinalize } = computeCompromiseFlags(requestedAt, requestedAt);
    expect(canCancel).toBe(true);
    expect(canFinalize).toBe(false);
  });

  it("timelockEnd is exactly 30 days after requestedAt", () => {
    const { timelockEnd } = computeCompromiseFlags(requestedAt, requestedAt);
    expect(timelockEnd - requestedAt).toBe(30 * 24 * 60 * 60);
  });
});
