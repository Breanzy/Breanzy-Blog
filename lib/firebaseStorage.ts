import { getStorage, ref, deleteObject, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "@/firebase";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/* Uploads a file to Firebase Storage and returns the public download URL. onProgress is called with 0–100. */
export function uploadFirebaseImage(
    file: File,
    onProgress?: (progress: number) => void
): Promise<string> {
    if (!ALLOWED_TYPES.includes(file.type)) {
        return Promise.reject(new Error("Only JPEG, PNG, WebP, and GIF images are allowed."));
    }
    if (file.size > MAX_SIZE_BYTES) {
        return Promise.reject(new Error("Image must be smaller than 5 MB."));
    }
    return new Promise((resolve, reject) => {
        const storage = getStorage(app);
        const storageRef = ref(storage, `${Date.now()}-${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                onProgress?.(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
            },
            reject,
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
            }
        );
    });
}

/* Deletes a file from Firebase Storage by its download URL. Silently ignores non-Firebase URLs. */
export async function deleteFirebaseImage(url: string): Promise<void> {
    if (!url || !url.includes("firebasestorage.googleapis.com")) return;
    try {
        const encoded = url.split("/o/")[1]?.split("?")[0];
        if (!encoded) return;
        const storage = getStorage(app);
        await deleteObject(ref(storage, decodeURIComponent(encoded)));
    } catch {
        // Silently ignore — an orphaned image is preferable to crashing
    }
}
