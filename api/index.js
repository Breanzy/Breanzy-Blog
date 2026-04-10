import app from "../server/app.js";

// Listen on local dev — Vercel handles the HTTP server in production
if (process.env.NODE_ENV !== "production") {
    app.listen(3000, () => console.log("Server running on port 3000"));
}

export default app;
