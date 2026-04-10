import crypto from "crypto";
import Subscriber from "../models/subscriber.model.js";

export const subscribe = async (req, res, next) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required." });

    try {
        const existing = await Subscriber.findOne({ email });
        if (existing) return res.status(200).json({ success: true, message: "You're already subscribed!" });

        const unsubscribeToken = crypto.randomBytes(32).toString("hex");
        await Subscriber.create({ email, unsubscribeToken });
        res.status(201).json({ success: true, message: "Subscribed! You'll get notified on new posts." });
    } catch (error) {
        next(error);
    }
};

/* One-click unsubscribe via link in email */
export const unsubscribe = async (req, res, next) => {
    const { token } = req.query;
    try {
        await Subscriber.findOneAndDelete({ unsubscribeToken: token });
        res.status(200).send(`<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Unsubscribed</title></head>
<body style="margin:0;padding:60px 24px;background:#0a0a0a;color:#e5e5e5;font-family:sans-serif;text-align:center;">
  <h2 style="color:#fff;">You've been unsubscribed.</h2>
  <p style="color:#737373;">You won't receive any more newsletters from Breanzy.</p>
  <a href="https://breanzy.com" style="color:#3b82f6;text-decoration:none;font-size:14px;">← Back to site</a>
</body>
</html>`);
    } catch (error) {
        next(error);
    }
};
