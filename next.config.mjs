import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
        config.resolve.alias["@"] = __dirname;
        return config;
    },
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "firebasestorage.googleapis.com" },
            { protocol: "https", hostname: "lh3.googleusercontent.com" },
            { protocol: "https", hostname: "*.googleusercontent.com" },
        ],
    },
    experimental: {
        serverComponentsExternalPackages: ["mongoose"],
    },
};

export default nextConfig;
