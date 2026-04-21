"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import TiptapEditor from "@/components/TiptapEditor";
import { uploadFirebaseImage, deleteFirebaseImage } from "@/lib/firebaseStorage";

const inputCls = "w-full bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-600 rounded-lg px-3 py-2 text-sm";

export default function CreatePostPage() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [publishError, setPublishError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    // Revoke the blob URL when a new file is selected or component unmounts
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] ?? null;
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setFile(selected);
        setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
    };

    useEffect(() => {
        return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
    }, [previewUrl]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPublishError(null);
        setIsSubmitting(true);

        let uploadedUrl: string | null = null;

        // Upload the image first if a file was selected
        if (file) {
            try {
                uploadedUrl = await uploadFirebaseImage(file, setUploadProgress);
            } catch {
                setPublishError("Image upload failed");
                setIsSubmitting(false);
                setUploadProgress(null);
                return;
            }
            setUploadProgress(null);
        }

        const payload = { ...formData, ...(uploadedUrl ? { image: uploadedUrl } : {}) };

        try {
            const res = await fetch("/api/post/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) {
                // Post creation failed — clean up the image we just uploaded
                if (uploadedUrl) await deleteFirebaseImage(uploadedUrl);
                setPublishError(data.message);
                setIsSubmitting(false);
                return;
            }
            router.push(`/blog/${data.slug}`);
        } catch {
            if (uploadedUrl) await deleteFirebaseImage(uploadedUrl);
            setPublishError("Something went wrong");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-white text-3xl font-semibold text-center mb-8">Create a Post</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Title"
                        required
                        className={`${inputCls} flex-1`}
                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    />
                    <select className={inputCls} onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}>
                        <option value="uncategorized">Select a category</option>
                        <option value="javascript">Javascript</option>
                        <option value="reactjs">React.js</option>
                        <option value="nextjs">Next.js</option>
                    </select>
                </div>

                <div className="flex gap-3 items-center border border-dashed border-neutral-700 rounded-xl p-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="text-sm text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-neutral-800 file:text-neutral-300 hover:file:bg-neutral-700 flex-1"
                    />
                    {file && <span className="shrink-0 text-xs text-blue-400">Ready to upload</span>}
                </div>

                {previewUrl && (
                    <div className="relative w-full h-64 overflow-hidden rounded-xl border border-neutral-800">
                        <Image src={previewUrl} alt="upload preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, 672px" />
                    </div>
                )}

                <TiptapEditor
                    placeholder="Write something..."
                    onChange={(value: string) => setFormData((prev) => ({ ...prev, content: value }))}
                />

                <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.06, boxShadow: "0 0 20px rgba(37,99,235,0.4)" } : {}}
                    whileTap={!isSubmitting ? { scale: 0.96 } : {}}
                    transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    {uploadProgress !== null ? (
                        <>
                            <span className="w-5 h-5 inline-block">
                                <CircularProgressbar
                                    value={uploadProgress}
                                    text={`${uploadProgress}%`}
                                    strokeWidth={8}
                                    styles={{ path: { stroke: "#fff" }, text: { fill: "#fff", fontSize: "2rem" } }}
                                />
                            </span>
                            Uploading image…
                        </>
                    ) : isSubmitting ? "Publishing…" : "Publish"}
                </motion.button>

                {publishError && <p className="text-red-400 text-sm">{publishError}</p>}
            </form>
        </div>
    );
}
