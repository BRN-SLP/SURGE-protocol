import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { formatTimeRemaining } from "@/components/identity/manage/WalletCard";

describe("formatTimeRemaining", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const now = () => Math.floor(Date.now() / 1000);

  it("returns 'Timelock expired' when past deadline", () => {
    expect(formatTimeRemaining(now() - 1)).toBe("Timelock expired");
    expect(formatTimeRemaining(now() - 1000)).toBe("Timelock expired");
  });

  it("shows days and hours when more than 1 day remaining", () => {
    const twoDaysAndSix = now() + 2 * 86400 + 6 * 3600;
    expect(formatTimeRemaining(twoDaysAndSix)).toBe("2d 6h remaining");
  });

  it("shows only hours when less than 1 day remaining", () => {
    const fiveHours = now() + 5 * 3600;
    expect(formatTimeRemaining(fiveHours)).toBe("5h remaining");
  });

  it("shows 0h remaining just before expiry", () => {
    const almostExpired = now() + 30;
    expect(formatTimeRemaining(almostExpired)).toBe("0h remaining");
  });
});
