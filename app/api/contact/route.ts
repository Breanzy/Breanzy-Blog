import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { escapeHtml } from "@/lib/html";
import { checkRateLimit, clientRateKey } from "@/lib/rateLimit";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Breanzy Blog <info@breanzy.com>";
const TO_EMAIL = "info@breanzy.com";

export async function POST(req: NextRequest) {
    if (!checkRateLimit(clientRateKey(req, "contact"), 3, 10 * 60 * 1000)) {
        return NextResponse.json({ success: false, message: "Too many requests. Please wait a few minutes." }, { status: 429 });
    }

    const { name, email, subject, message } = await req.json();
    if (!name || !email || !subject || !message) {
        return NextResponse.json({ success: false, message: "All fields are required." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ success: false, message: "Please enter a valid email address." }, { status: 400 });
    }

    const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        replyTo: email,
        subject: `[Contact] ${subject} — from ${name}`,
        html: buildTemplate(name, email, subject, message),
    });

    if (error) {
        return NextResponse.json({ success: false, message: "Failed to send message. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Message sent! I'll get back to you soon." });
}

function buildTemplate(name: string, email: string, subject: string, message: string) {
    return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#09090b;color:#e5e7eb;">
  <p style="color:#60a5fa;font-size:11px;text-transform:uppercase;letter-spacing:.12em;margin:0 0 8px;">New Contact Message</p>
  <h1 style="color:#fff;font-size:22px;margin:0 0 24px;">${escapeHtml(subject)}</h1>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
    <tr><td style="color:#71717a;font-size:13px;padding:6px 0;width:80px;">From</td><td style="color:#e5e7eb;font-size:13px;">${escapeHtml(name)}</td></tr>
    <tr><td style="color:#71717a;font-size:13px;padding:6px 0;">Email</td><td style="color:#60a5fa;font-size:13px;">${escapeHtml(email)}</td></tr>
    <tr><td style="color:#71717a;font-size:13px;padding:6px 0;">Subject</td><td style="color:#e5e7eb;font-size:13px;">${escapeHtml(subject)}</td></tr>
  </table>
  <div style="background:#18181b;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:20px;">
    <p style="color:#a1a1aa;font-size:12px;margin:0 0 10px;text-transform:uppercase;letter-spacing:.1em;">Message</p>
    <p style="color:#e5e7eb;font-size:15px;line-height:1.7;margin:0;white-space:pre-wrap;">${escapeHtml(message)}</p>
  </div>
  <p style="color:#3f3f46;font-size:12px;margin:24px 0 0;">Sent via breanzy.com contact form · Reply directly to this email to respond.</p>
</div>`;
}
