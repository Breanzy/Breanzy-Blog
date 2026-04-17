/**
 * Firebase Storage orphan cleanup script
 *
 * Lists every file in the Firebase Storage bucket, compares against all
 * image URLs stored in MongoDB (posts, projects, users), and deletes any
 * file that is no longer referenced.
 *
 * Setup (one time):
 *   1. Firebase Console → Project Settings → Service Accounts → Generate new private key
 *      Save the downloaded JSON file somewhere safe (never commit it).
 *   2. npm install firebase-admin --save-dev
 *   3. Add to .env.local (or export in your shell before running):
 *        FIREBASE_SERVICE_ACCOUNT_PATH=/absolute/path/to/serviceAccount.json
 *        MONGODB_URI=mongodb+srv://...
 *        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
 *
 * Usage:
 *   node scripts/cleanup-storage.mjs            # dry run — shows what would be deleted
 *   node scripts/cleanup-storage.mjs --delete   # actually deletes orphaned files
 */

import { readFileSync } from "fs";
import { createRequire } from "module";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Load .env.local from the project root
config({ path: resolve(__dirname, "../.env.local") });

const DRY_RUN = !process.argv.includes("--delete");

// ─── Validate env ────────────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;
const STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const SA_PATH = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
const SA_JSON = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!MONGODB_URI) { console.error("Missing MONGODB_URI env var"); process.exit(1); }
if (!STORAGE_BUCKET) { console.error("Missing NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET env var"); process.exit(1); }
if (!SA_PATH && !SA_JSON) {
    console.error(
        "Missing Firebase service account.\n" +
        "Set FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/serviceAccount.json\n" +
        "OR set FIREBASE_SERVICE_ACCOUNT to the raw JSON string."
    );
    process.exit(1);
}

// ─── Imports (dynamic so we can validate env first) ──────────────────────────
const require = createRequire(import.meta.url);
let admin, mongoose;
try {
    admin = require("firebase-admin");
} catch {
    console.error(
        "firebase-admin is not installed.\n" +
        "Run: npm install firebase-admin --save-dev"
    );
    process.exit(1);
}
try {
    mongoose = require("mongoose");
} catch {
    console.error("mongoose not found — run npm install");
    process.exit(1);
}

// ─── Init Firebase Admin ─────────────────────────────────────────────────────
const serviceAccount = SA_PATH
    ? JSON.parse(readFileSync(SA_PATH, "utf8"))
    : JSON.parse(SA_JSON);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Extract the storage file path from a Firebase Storage download URL */
function extractPath(url) {
    if (!url || !url.includes("firebasestorage.googleapis.com")) return null;
    try {
        const encoded = url.split("/o/")[1]?.split("?")[0];
        return encoded ? decodeURIComponent(encoded) : null;
    } catch {
        return null;
    }
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
    console.log(`\n${DRY_RUN ? "🔍 DRY RUN — nothing will be deleted. Pass --delete to actually remove files." : "🗑️  DELETE MODE — orphaned files will be removed."}\n`);

    // 1. Connect to MongoDB and collect all referenced image URLs
    console.log("Connecting to MongoDB…");
    await mongoose.connect(MONGODB_URI);

    const db = mongoose.connection.db;
    const [posts, projects, users] = await Promise.all([
        db.collection("posts").find({}, { projection: { image: 1 } }).toArray(),
        db.collection("projects").find({}, { projection: { image: 1 } }).toArray(),
        db.collection("users").find({}, { projection: { profilePicture: 1 } }).toArray(),
    ]);

    const allUrls = [
        ...posts.map((p) => p.image),
        ...projects.map((p) => p.image),
        ...users.map((u) => u.profilePicture),
    ].filter(Boolean);

    const usedPaths = new Set(allUrls.map(extractPath).filter(Boolean));
    console.log(`Found ${usedPaths.size} Firebase Storage paths referenced in MongoDB.\n`);

    // 2. List all files in the bucket
    console.log("Listing all files in Firebase Storage bucket…");
    const [files] = await bucket.getFiles();
    console.log(`Found ${files.length} total files in bucket.\n`);

    // 3. Find and delete orphans
    const orphans = files.filter((f) => !usedPaths.has(f.name));

    if (orphans.length === 0) {
        console.log("✅ No orphaned files found. Storage is clean.");
    } else {
        console.log(`Found ${orphans.length} orphaned file(s):\n`);
        for (const file of orphans) {
            console.log(`  ${DRY_RUN ? "[would delete]" : "[deleting]"} ${file.name}`);
            if (!DRY_RUN) {
                await file.delete();
            }
        }
        if (DRY_RUN) {
            console.log(`\nRun with --delete to remove these ${orphans.length} file(s).`);
        } else {
            console.log(`\n✅ Deleted ${orphans.length} orphaned file(s).`);
        }
    }

    await mongoose.disconnect();
    process.exit(0);
}

main().catch((err) => {
    console.error("Script failed:", err.message);
    process.exit(1);
});
