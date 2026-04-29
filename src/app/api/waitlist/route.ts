import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase-server";

const resend = new Resend(process.env.RESEND_API_KEY);

const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

async function checkRateLimit(ip: string): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = getSupabaseAdmin() as any;
  const now = new Date();

  const { data } = await db.from("rate_limits").select("count, reset_at").eq("ip", ip).single();

  if (!data || new Date(data.reset_at) <= now) {
    await db.from("rate_limits").upsert({
      ip,
      count: 1,
      reset_at: new Date(Date.now() + RATE_WINDOW_MS).toISOString(),
    });
    return true;
  }

  if (data.count >= RATE_LIMIT) return false;

  await db
    .from("rate_limits")
    .update({ count: data.count + 1 })
    .eq("ip", ip);
  return true;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!(await checkRateLimit(ip))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: { email?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : null;

  if (!email || !email.includes("@") || !email.includes(".") || email.length > 254) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (getSupabaseAdmin() as any).from("waitlist").insert({ email });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }

  try {
    await resend.emails.send({
      from: "SURGE Protocol <hello@surge-protocol.xyz>",
      to: email,
      subject: "You're on the SURGE early access list",
      html: `
      <div style="background:#0a0a0f;color:#f1f5f9;font-family:sans-serif;padding:40px;max-width:560px;margin:0 auto;border-radius:12px;">
        <p style="color:#dc3333;font-weight:700;letter-spacing:0.2em;font-size:12px;text-transform:uppercase;margin:0 0 24px;">SURGE PROTOCOL</p>
        <h1 style="font-size:28px;font-weight:800;margin:0 0 16px;line-height:1.2;">You're in.<br/>Early access confirmed.</h1>
        <p style="color:#94a3b8;font-size:16px;line-height:1.6;margin:0 0 24px;">
          As a founding member you'll receive a permanently boosted Identity Card score — locked at your join position, forever.
        </p>
        <div style="border:1px solid #1c1c27;border-radius:8px;padding:20px;margin:0 0 24px;">
          <p style="margin:0 0 8px;font-size:14px;color:#94a3b8;">Your founding perks:</p>
          <p style="margin:4px 0;font-size:14px;color:#f1f5f9;">&#10003; Founding member badge</p>
          <p style="margin:4px 0;font-size:14px;color:#f1f5f9;">&#10003; Score boost multiplier</p>
          <p style="margin:4px 0;font-size:14px;color:#f1f5f9;">&#10003; DAO governance weight</p>
          <p style="margin:4px 0;font-size:14px;color:#f1f5f9;">&#10003; Exclusive Drops access</p>
        </div>
        <p style="color:#64748b;font-size:12px;margin:0;">We'll notify you the moment early access opens. No spam. No noise. One email when we launch.</p>
      </div>
    `,
    });
  } catch (err) {
    console.error("Resend error:", err);
  }

  return NextResponse.json({ ok: true });
}
