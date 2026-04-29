import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mocks (hoisted so they're available before vi.mock factory runs) ────────

const { mockInsert, mockFrom, mockSendEmail } = vi.hoisted(() => {
  const mockInsert = vi.fn();
  const mockFrom = vi.fn(() => ({ insert: mockInsert }));
  const mockSendEmail = vi.fn().mockResolvedValue({ data: {}, error: null });
  return { mockInsert, mockFrom, mockSendEmail };
});

vi.mock("@/lib/supabase-server", () => ({
  getSupabaseAdmin: () => ({ from: mockFrom }),
}));

vi.mock("resend", () => ({
  // Must use `function` keyword so vitest can call it with `new`
  Resend: vi.fn(function () {
    return { emails: { send: mockSendEmail } };
  }),
}));

// ── Import after mocks ─────────────────────────────────────────────────────

import { POST } from "@/app/api/waitlist/route";
import { NextRequest } from "next/server";

function makeRequest(body: unknown, ip = "1.2.3.4"): NextRequest {
  return new NextRequest("http://localhost/api/waitlist", {
    method: "POST",
    headers: { "x-forwarded-for": ip, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/waitlist", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInsert.mockResolvedValue({ error: null });
  });

  it("returns 200 for a valid email", async () => {
    const res = await POST(makeRequest({ email: "test@example.com" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true });
    expect(mockFrom).toHaveBeenCalledWith("waitlist");
    expect(mockInsert).toHaveBeenCalledWith({ email: "test@example.com" });
  });

  it("normalises email to lowercase and trims whitespace", async () => {
    await POST(makeRequest({ email: "  UPPER@EXAMPLE.COM  " }));
    expect(mockInsert).toHaveBeenCalledWith({ email: "upper@example.com" });
  });

  it("returns 200 for a duplicate email (unique violation)", async () => {
    mockInsert.mockResolvedValue({ error: { code: "23505" } });
    const res = await POST(makeRequest({ email: "dup@example.com" }, "9.9.9.1"));
    expect(res.status).toBe(200);
  });

  it("returns 400 for missing email", async () => {
    const res = await POST(makeRequest({}, "9.9.9.2"));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid email (no @)", async () => {
    const res = await POST(makeRequest({ email: "notanemail" }, "9.9.9.3"));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid JSON body", async () => {
    const req = new NextRequest("http://localhost/api/waitlist", {
      method: "POST",
      headers: { "x-forwarded-for": "9.9.9.4", "content-type": "application/json" },
      body: "not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 500 when Supabase returns an unknown error", async () => {
    mockInsert.mockResolvedValue({ error: { code: "99999", message: "db error" } });
    const res = await POST(makeRequest({ email: "err@example.com" }, "9.9.9.5"));
    expect(res.status).toBe(500);
  });

  it("sends a confirmation email on success", async () => {
    await POST(makeRequest({ email: "welcome@example.com" }, "9.9.9.6"));
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: "welcome@example.com" }),
    );
  });

  it("returns 429 after exceeding rate limit", async () => {
    const ip = "5.5.5.5";
    // First 3 requests should succeed (rate limit is 3)
    await POST(makeRequest({ email: "a@a.com" }, ip));
    await POST(makeRequest({ email: "b@b.com" }, ip));
    await POST(makeRequest({ email: "c@c.com" }, ip));
    // 4th should be rate-limited
    const res = await POST(makeRequest({ email: "d@d.com" }, ip));
    expect(res.status).toBe(429);
  });
});
