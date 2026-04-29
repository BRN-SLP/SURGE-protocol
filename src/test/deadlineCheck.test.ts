import { describe, it, expect } from "vitest";
import { isDeadlineExpired } from "@/hooks/useMultiSigAction";

describe("isDeadlineExpired", () => {
  const deadline = BigInt(1_000_000);

  it("returns false when now is before deadline", () => {
    expect(isDeadlineExpired(deadline, 999_999)).toBe(false);
  });

  it("returns true when now equals deadline", () => {
    expect(isDeadlineExpired(deadline, 1_000_000)).toBe(true);
  });

  it("returns true when now is after deadline", () => {
    expect(isDeadlineExpired(deadline, 1_000_001)).toBe(true);
  });

  it("returns false for a future deadline (1 hour ahead)", () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const futureDeadline = BigInt(nowSeconds + 3600);
    expect(isDeadlineExpired(futureDeadline)).toBe(false);
  });

  it("returns true for a past deadline (1 hour ago)", () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const pastDeadline = BigInt(nowSeconds - 3600);
    expect(isDeadlineExpired(pastDeadline)).toBe(true);
  });
});
