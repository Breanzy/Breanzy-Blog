import { Resend } from "resend";

const SITE_URL = process.env.SITE_URL || "https://breanzy.com";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Breanzy Newsletter <onboarding@resend.dev>";

type NewsletterResult = {
    attempted: number;
    delivered: number;
    failed: number;
    errors: string[];
};

/* Send a new-post notification to all subscribers via Resend */
export const sendNewsletter = async (post: any, subscribers: any[]) => {
    if (!subscribers.length) {
        return { attempted: 0, delivered: 0, failed: 0, errors: [] } satisfies NewsletterResult;
    }

    if (!process.env.RESEND_API_KEY) {
        return {
            attempted: subscribers.length,
            delivered: 0,
            failed: subscribers.length,
            errors: ["Missing RESEND_API_KEY"],
        } satisfies NewsletterResult;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const deliveries = await Promise.allSettled(
        subscribers.map(async (sub) => {
            const { error } = await resend.emails.send({
                from: FROM_EMAIL,
                to: sub.email,
                subject: `New post: ${post.title}`,
                html: buildTemplate(post, sub.unsubscribeToken),
            });

            if (error) {
                throw new Error(`${sub.email}: ${error.message}`);
            }

            return sub.email;
        })
    );

    const errors = deliveries.flatMap((result) => {
        if (result.status === "fulfilled") return [];
        return [result.reason instanceof Error ? result.reason.message : String(result.reason)];
    });

    return {
        attempted: subscribers.length,
        delivered: deliveries.length - errors.length,
        failed: errors.length,
        errors,
    } satisfies NewsletterResult;
};

function buildTemplate(post: any, token: string) {
    const postUrl = `${SITE_URL}/blog/${post.slug}`;
    const unsubUrl = `${SITE_URL}/api/subscriber/unsubscribe?token=${token}`;
    const imageHtml = post.image
        ? `<img src="${post.image}" alt="${post.title}" style="width:100%;max-height:280px;object-fit:cover;border-radius:8px;margin-bottom:24px;">`
        : "";

    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;">
  <div style="max-width:580px;margin:0 auto;padding:40px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <div style="margin-bottom:32px;">
      <span style="color:#fff;font-size:22px;font-weight:700;">Brean<span style="color:#3b82f6;">zy</span></span>
    </div>
    ${imageHtml}
    <p style="color:#9ca3af;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px;">${post.category || "article"}</p>
    <h1 style="color:#fff;font-size:22px;font-weight:700;line-height:1.3;margin:0 0 12px;">${post.title}</h1>
    <a href="${postUrl}" style="display:inline-block;margin-top:16px;background:#2563eb;color:#fff;text-decoration:none;padding:10px 22px;border-radius:8px;font-size:14px;font-weight:500;">
      Read article →
    </a>
    <hr style="border:none;border-top:1px solid #262626;margin:40px 0 24px;">
    <p style="color:#525252;font-size:12px;line-height:1.6;margin:0;">
      You're receiving this because you subscribed to Breanzy updates.<br>
      <a href="${unsubUrl}" style="color:#3b82f6;text-decoration:none;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`;
}
