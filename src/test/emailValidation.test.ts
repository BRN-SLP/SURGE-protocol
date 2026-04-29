import { describe, it, expect } from "vitest";

// Mirrors the validation logic from src/app/api/waitlist/route.ts
function isValidEmail(email: unknown): email is string {
  if (typeof email !== "string") return false;
  const trimmed = email.trim().toLowerCase();
  return (
    trimmed.length > 0 && trimmed.includes("@") && trimmed.includes(".") && trimmed.length <= 254
  );
}

describe("waitlist email validation", () => {
  it("accepts valid emails", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("user+tag@sub.domain.io")).toBe(true);
    expect(isValidEmail("  user@example.com  ")).toBe(true); // trims
  });

  it("rejects non-string values", () => {
    expect(isValidEmail(null)).toBe(false);
    expect(isValidEmail(undefined)).toBe(false);
    expect(isValidEmail(42)).toBe(false);
    expect(isValidEmail({})).toBe(false);
  });

  it("rejects emails without @", () => {
    expect(isValidEmail("userexample.com")).toBe(false);
  });

  it("rejects emails without dot", () => {
    expect(isValidEmail("user@example")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("   ")).toBe(false);
  });

  it("accepts email of exactly 254 characters", () => {
    const exact = "a".repeat(250) + "@b.c"; // 254 chars
    expect(isValidEmail(exact)).toBe(true);
  });

  it("rejects emails over 254 characters", () => {
    const long = "a".repeat(251) + "@b.c"; // 255 chars
    expect(isValidEmail(long)).toBe(false);
  });
});
