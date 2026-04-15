"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from "firebase/storage";
import { app } from "@/firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import QuillEditor from "@/components/QuillEditor";

const inputCls = "w-full bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-600 rounded-lg px-3 py-2 text-sm";

export default function UpdatePostPage() {
    const [file, setFile] = useState<File | null>(null);
    const [imageUploadProgress, setImageUploadProgress] = useState<string | null>(null);
    const [imageUploadError, setImageUploadError] = useState<string | null>(null);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [publishError, setPublishError] = useState<string | null>(null);
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

    const handleUploadImage = async () => {
        if (!file) { setImageUploadError("Please select an image"); return; }
        setImageUploadError(null);
        try {
            const storage = getStorage(app);
            const storageRef = ref(storage, new Date().getTime() + "-" + file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    setImageUploadProgress(((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0));
                },
                () => {
                    setImageUploadError("Image upload failed");
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        setImageUploadProgress(null);
                        setFormData((prev) => ({ ...prev, image: url }));
                    });
                }
            );
        } catch {
            setImageUploadError("Image upload failed");
            setImageUploadProgress(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) { setPublishError(data.message); return; }
            setPublishError(null);
            router.push(`/blog/${data.slug}`);
        } catch {
            setPublishError("Something went wrong");
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-white text-3xl font-semibold text-center mb-8">Update Post</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Title"
                        required
                        value={formData.title || ""}
                        className={`${inputCls} flex-1`}
                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    />
                    <select className={inputCls} value={formData.category || "uncategorized"} onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}>
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
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        className="text-sm text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-neutral-800 file:text-neutral-300 hover:file:bg-neutral-700 flex-1"
                    />
                    <motion.button
                        type="button"
                        onClick={handleUploadImage}
                        disabled={!!imageUploadProgress}
                        whileHover={!imageUploadProgress ? { scale: 1.03 } : {}}
                        whileTap={!imageUploadProgress ? { scale: 0.96 } : {}}
                        transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                        className="shrink-0 border border-neutral-700 hover:border-blue-600 text-neutral-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm px-4 py-1.5 rounded-lg transition-colors flex items-center gap-2"
                    >
                        {imageUploadProgress ? (
                            <span className="w-5 h-5 inline-block">
                                <CircularProgressbar
                                    value={Number(imageUploadProgress)}
                                    text={`${imageUploadProgress}%`}
                                    strokeWidth={8}
                                    styles={{ path: { stroke: "#3b82f6" }, text: { fill: "#fff", fontSize: "2rem" } }}
                                />
                            </span>
                        ) : "Upload Image"}
                    </motion.button>
                </div>

                {imageUploadError && <p className="text-red-400 text-sm">{imageUploadError}</p>}
                {formData.image && (
                    <div className="relative w-full h-64 overflow-hidden rounded-xl border border-neutral-800">
                        <Image src={formData.image} alt="upload preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, 672px" />
                    </div>
                )}

                <QuillEditor
                    theme="snow"
                    placeholder="Write something..."
                    className="h-72 mb-12"
                    value={formData.content || ""}
                    onChange={(value: string) => setFormData((prev) => ({ ...prev, content: value }))}
                />

                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.06, boxShadow: "0 0 20px rgba(37,99,235,0.4)" }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg transition-colors"
                >
                    Update Post
                </motion.button>

                {publishError && <p className="text-red-400 text-sm">{publishError}</p>}
            </form>
        </div>
    );
}
