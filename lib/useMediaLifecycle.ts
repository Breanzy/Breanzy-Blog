"use client";

import { useEffect, useState } from "react";
import { deleteFirebaseImage, uploadFirebaseImage } from "@/lib/firebaseStorage";

/* Manages browser media selection, preview, upload, rollback, and replacement cleanup. */
export function useMediaLifecycle() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);

    /* Replaces the selected browser file and keeps the preview URL lifecycle bounded. */
    const selectFile = (selected: File | null) => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setFile(selected);
        setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
    };

    /* Uploads the currently selected file and reports Firebase progress to the caller. */
    const uploadSelected = async () => {
        if (!file) return null;
        try {
            return await uploadFirebaseImage(file, setUploadProgress);
        } finally {
            setUploadProgress(null);
        }
    };

    /* Deletes a newly uploaded object when the surrounding write fails. */
    const rollbackUpload = async (uploadedUrl: string | null) => {
        if (uploadedUrl) await deleteFirebaseImage(uploadedUrl);
    };

    /* Deletes the previous object only after a replacement upload has been persisted. */
    const cleanupReplaced = async (uploadedUrl: string | null, originalUrl: string) => {
        if (uploadedUrl && originalUrl) await deleteFirebaseImage(originalUrl);
    };

    /* Clears local media state after a successful write or abandoned selection. */
    const reset = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setFile(null);
        setPreviewUrl(null);
        setUploadProgress(null);
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    return { file, previewUrl, uploadProgress, selectFile, uploadSelected, rollbackUpload, cleanupReplaced, reset };
}
