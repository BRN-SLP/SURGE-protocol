import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !email.includes("@") || !email.includes(".")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (getSupabaseAdmin() as any).from("waitlist").insert({ email });

  if (error) {
    if (error.code === "23505") {
      // unique violation — already signed up
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }

  await resend.emails.send({
    from: "SURGE Protocol <hello@surge-protocol.xyz>",
    to: email,
    subject: "You're on the SURGE early access list",
    html: `
      <div style="background:#0a0a0f;color:#f1f5f9;font-family:sans-serif;padding:40px;max-width:560px;margin:0 auto;border-radius:12px;">
        <p style="color:#6366f1;font-weight:700;letter-spacing:0.2em;font-size:12px;text-transform:uppercase;margin:0 0 24px;">SURGE PROTOCOL</p>
        <h1 style="font-size:28px;font-weight:800;margin:0 0 16px;line-height:1.2;">You're in.<br/>Early access confirmed.</h1>
        <p style="color:#94a3b8;font-size:16px;line-height:1.6;margin:0 0 24px;">
          As a founding member you'll receive a permanently boosted Identity Card score — locked at your join position, forever.
        </p>
        <div style="border:1px solid #1c1c27;border-radius:8px;padding:20px;margin:0 0 24px;">
          <p style="margin:0 0 8px;font-size:14px;color:#94a3b8;">Your founding perks:</p>
          <p style="margin:4px 0;font-size:14px;color:#f1f5f9;">&#10003;Founding member badge</p>
          <p style="margin:4px 0;font-size:14px;color:#f1f5f9;">&#10003;Score boost multiplier</p>
          <p style="margin:4px 0;font-size:14px;color:#f1f5f9;">&#10003;DAO governance weight</p>
          <p style="margin:4px 0;font-size:14px;color:#f1f5f9;">&#10003;Exclusive Drops access</p>
        </div>
        <p style="color:#64748b;font-size:12px;margin:0;">We'll notify you the moment early access opens. No spam. No noise. One email when we launch.</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
