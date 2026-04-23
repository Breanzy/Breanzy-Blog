import { Resend } from "resend";

const SITE_URL = process.env.SITE_URL || "https://breanzy.com";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Breanzy Blog <onboarding@resend.dev>";
const BRAND_NAME = "Breanzy Blog";

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
                subject: `${BRAND_NAME}: ${post.title}`,
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
    const unsubUrl = `${SITE_URL}/api/subscriber/unsubscribe?token=${encodeURIComponent(token)}`;
    const logoUrl = `${SITE_URL}/logo.png`;
    const readTimeMinutes = getReadTimeMinutes(post.content || "");
    const imageHtml = post.image
        ? `<img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" style="display:block;width:100%;max-height:320px;object-fit:cover;border-radius:14px;margin:24px 0 28px;">`
        : "";
    const contentHtml = post.content
        ? `<div class="post-content">${post.content}</div>`
        : `<p style="color:#d4d4d8;font-size:15px;line-height:1.8;margin:0;">No article content was included in this newsletter.</p>`;

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #050507;
    }
    .container {
      max-width: 680px;
      margin: 0 auto;
      padding: 40px 24px 56px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 28px;
      text-decoration: none;
    }
    .brand-title {
      color: #ffffff;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .card {
      background: rgba(10, 10, 10, 0.72);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 28px;
    }
    .eyebrow {
      color: #60a5fa;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      margin: 0 0 10px;
    }
    .title {
      color: #ffffff;
      font-size: 30px;
      line-height: 1.2;
      font-weight: 800;
      margin: 0 0 12px;
    }
    .subtitle {
      color: #a1a1aa;
      font-size: 13px;
      margin: 0 0 22px;
    }
    .post-content {
      color: #e5e7eb;
      font-size: 15px;
      line-height: 1.8;
    }
    .post-content p {
      margin: 0 0 16px;
    }
    .post-content h1,
    .post-content h2,
    .post-content h3 {
      color: #ffffff;
      line-height: 1.25;
      margin: 1.4em 0 0.6em;
    }
    .post-content h1 {
      font-size: 24px;
    }
    .post-content h2 {
      font-size: 20px;
    }
    .post-content h3 {
      font-size: 17px;
    }
    .post-content ul,
    .post-content ol {
      margin: 0 0 16px 22px;
      padding: 0;
    }
    .post-content li {
      margin-bottom: 8px;
    }
    .post-content a {
      color: #60a5fa;
      text-decoration: underline;
    }
    .post-content blockquote {
      margin: 18px 0;
      padding-left: 16px;
      border-left: 3px solid #3b82f6;
      color: #a1a1aa;
    }
    .post-content code {
      background: #18181b;
      color: #93c5fd;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .post-content pre {
      background: #18181b;
      color: #e5e7eb;
      padding: 16px;
      border-radius: 12px;
      overflow-x: auto;
    }
    .footer {
      margin-top: 28px;
      padding-top: 22px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      color: #71717a;
      font-size: 12px;
      line-height: 1.6;
    }
    .footer a {
      color: #60a5fa;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <a href="${postUrl}" class="brand">
      <img src="${logoUrl}" alt="${BRAND_NAME} logo" width="40" height="40" style="display:block;border-radius:10px;">
      <span class="brand-title">${BRAND_NAME}</span>
    </a>
    <div class="card">
      <p class="eyebrow">${escapeHtml(post.category || "article")} | ${readTimeMinutes} min read</p>
      <h1 class="title">${escapeHtml(post.title)}</h1>
      <p class="subtitle">Full article delivered straight to your inbox.</p>
      ${imageHtml}
      ${contentHtml}
    </div>
    <div class="footer">
      You're receiving this because you subscribed to ${BRAND_NAME} updates.<br>
      <a href="${postUrl}">Open this post on the site</a> |
      <a href="${unsubUrl}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`;
}

function stripHtml(input: string) {
    return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getReadTimeMinutes(content: string) {
    const words = stripHtml(content).split(" ").filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
}

function escapeHtml(input: string) {
    return input
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}
