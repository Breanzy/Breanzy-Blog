import Post from "@/models/post.model";
import Subscriber from "@/models/subscriber.model";
import { auditEvent } from "@/lib/audit";
import { sendNewsletter } from "@/utils/sendNewsletter";

/* Sends a post newsletter and records delivery state/audit events. */
export async function deliverPostNewsletter(post: any, actorId: string) {
    const subscribers = await Subscriber.find({}, "email unsubscribeToken");
    const newsletter = await sendNewsletter(post, subscribers);
    if (newsletter.delivered > 0) {
        await Post.findByIdAndUpdate(post._id, { $set: { newsletterSentAt: new Date() } });
    }
    if (newsletter.failed > 0) {
        auditEvent("newsletter.post_send", {
            actorId,
            targetId: String(post._id),
            status: "failure",
            detail: newsletter.errors.join(" | ").slice(0, 1000),
        });
    }
    return newsletter;
}
