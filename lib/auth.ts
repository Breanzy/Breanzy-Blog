import { createRemoteJWKSet, jwtVerify } from "jose";

const firebaseJwks = createRemoteJWKSet(
    new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

type FirebaseUser = {
    email: string;
    name: string;
    picture: string;
};

/* Verifies a Firebase Auth ID token and returns the trusted user identity. */
export async function verifyFirebaseIdToken(idToken: string): Promise<FirebaseUser> {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) {
        throw new Error("Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID");
    }

    const { payload } = await jwtVerify(idToken, firebaseJwks, {
        issuer: `https://securetoken.google.com/${projectId}`,
        audience: projectId,
    });

    if (payload.firebase && typeof payload.firebase === "object") {
        const provider = (payload.firebase as { sign_in_provider?: unknown }).sign_in_provider;
        if (provider !== "google.com") {
            throw new Error("Unsupported auth provider");
        }
    }

    if (payload.email_verified !== true || typeof payload.email !== "string") {
        throw new Error("Google email must be verified");
    }

    return {
        email: payload.email.toLowerCase(),
        name: typeof payload.name === "string" && payload.name.trim() ? payload.name : payload.email.split("@")[0],
        picture: typeof payload.picture === "string" ? payload.picture : "",
    };
}
