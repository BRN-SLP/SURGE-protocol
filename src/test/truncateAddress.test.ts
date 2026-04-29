import { describe, it, expect } from "vitest";
import { truncateAddress } from "@/components/identity/manage/WalletCard";

describe("truncateAddress", () => {
  it("returns first 6 and last 4 characters with ellipsis", () => {
    expect(truncateAddress("0x1234567890abcdef1234567890abcdef12345678")).toBe("0x1234…5678");
  });

  it("handles short addresses without throwing", () => {
    const short = "0xABCDEF";
    const result = truncateAddress(short);
    expect(result).toContain("…");
  });

  it("handles checksummed addresses", () => {
    const addr = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    const result = truncateAddress(addr);
    expect(result.startsWith("0xd8dA")).toBe(true);
    expect(result.endsWith("6045")).toBe(true);
    expect(result).toContain("…");
  });
});
