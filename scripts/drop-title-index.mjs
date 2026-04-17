/**
 * One-time migration: drop the legacy unique index on posts.title
 *
 * When the schema had `title: { unique: true }`, Mongoose created a unique
 * index in MongoDB. Removing `unique: true` from the schema stops NEW indexes
 * from being created, but does NOT drop the existing one. This script does
 * that cleanup so duplicate titles are no longer rejected by MongoDB.
 *
 * Run once:
 *   node scripts/drop-title-index.mjs
 *
 * Safe to re-run — prints a message if the index is already gone.
 */

import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });

const require = createRequire(import.meta.url);
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI in .env.local");
    process.exit(1);
}

await mongoose.connect(MONGODB_URI);
const db = mongoose.connection.db;

try {
    await db.collection("posts").dropIndex("title_1");
    console.log("✅  Dropped unique index on posts.title — titles can now be reused.");
} catch (err) {
    if (err.codeName === "IndexNotFound") {
        console.log("ℹ️   Index title_1 not found — already dropped or never existed.");
    } else {
        console.error("Failed to drop index:", err.message);
        process.exit(1);
    }
}

await mongoose.disconnect();
