"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import TiptapEditor from "@/components/TiptapEditor";
import { useMediaLifecycle } from "@/lib/useMediaLifecycle";

const inputCls = "w-full bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-600 rounded-lg px-3 py-2 text-sm";

export default function UpdatePostPage() {
    const media = useMediaLifecycle();
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [publishError, setPublishError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { postId } = useParams<{ postId: string }>();
    const { currentUser } = useSelector((state: any) => state.user);
    const router = useRouter();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/post/getposts?postId=${postId}`);
                const data = await res.json();
                if (!res.ok) { setPublishError(data.message); return; }
                setPublishError(null);
                setFormData(data.posts[0]);
            } catch (error: any) {
                console.log(error.message);
            }
        };
        fetchPost();
    }, [postId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        media.selectFile(e.target.files?.[0] ?? null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPublishError(null);
        setIsSubmitting(true);

        const originalImage: string = formData.image || "";
        let uploadedUrl: string | null = null;

        try {
            uploadedUrl = await media.uploadSelected();
        } catch {
            setPublishError("Image upload failed");
            setIsSubmitting(false);
            return;
        }

        const payload = { ...formData, ...(uploadedUrl ? { image: uploadedUrl } : {}) };

        try {
            const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) {
                // Update failed; clean up the image we just uploaded.
                await media.rollbackUpload(uploadedUrl);
                setPublishError(data.message);
                setIsSubmitting(false);
                return;
            }
            await media.cleanupReplaced(uploadedUrl, originalImage);
            router.push(`/blog/${data.slug}`);
        } catch {
            await media.rollbackUpload(uploadedUrl);
            setPublishError("Something went wrong");
            setIsSubmitting(false);
        }
    };

    // Show local preview if a new file is selected, otherwise show the existing saved image.
    const displayImage = media.previewUrl || formData.image || null;

    return (
        <div className="p-6 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-white text-3xl font-semibold text-center mb-8">Update Post</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1.5fr)_minmax(14rem,1fr)] gap-4">
                    <input
                        type="text"
                        placeholder="Title"
                        required
                        value={formData.title || ""}
                        className={`${inputCls} min-w-0`}
                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    />
                    <select
                        className={`${inputCls} min-w-0`}
                        value={formData.category || "uncategorized"}
                        onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    >
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
                    {media.file && <span className="shrink-0 text-xs text-blue-400">New image ready</span>}
                </div>

                {displayImage && (
                    <div className="relative w-full h-64 overflow-hidden rounded-xl border border-neutral-800">
                        <Image src={displayImage} alt="preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, 672px" />
                    </div>
                )}

                <TiptapEditor
                    placeholder="Write something..."
                    value={formData.content || ""}
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
                    {media.uploadProgress !== null ? (
                        <>
                            <span className="w-5 h-5 inline-block">
                                <CircularProgressbar
                                    value={media.uploadProgress}
                                    text={`${media.uploadProgress}%`}
                                    strokeWidth={8}
                                    styles={{ path: { stroke: "#fff" }, text: { fill: "#fff", fontSize: "2rem" } }}
                                />
                            </span>
                            Uploading image…
                        </>
                    ) : isSubmitting ? "Saving…" : "Update Post"}
                </motion.button>

                {publishError && <p className="text-red-400 text-sm">{publishError}</p>}
            </form>
        </div>
    );
}
