"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import Modal from "./Modal";
import TiptapEditor from "./TiptapEditor";
import { uploadFirebaseImage, deleteFirebaseImage } from "@/lib/firebaseStorage";

const emptyForm = {
    title: "",
    description: "",
    content: "",
    image: "",
    techStack: "",
    liveUrl: "",
    repoUrl: "",
    category: "uncategorized",
    featured: false,
};

const inputCls = "w-full bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-600 rounded-lg px-3 py-2 text-sm";

interface ProjectFormFieldsProps {
    formData: any;
    setFormData: (data: any) => void;
    formError: string | null;
    onFileSelect: (file: File | null) => void;
    localPreview: string | null;
    uploadProgress: number | null;
}

/* Shared form fields for add/edit project modals */
const ProjectFormFields = ({ formData, setFormData, formError, onFileSelect, localPreview, uploadProgress }: ProjectFormFieldsProps) => (
    <div className="flex flex-col gap-3">
        <input className={inputCls} placeholder="Title" required value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
        <textarea className={`${inputCls} resize-none`} placeholder="Description" required rows={3} value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        <div className="flex flex-col gap-1">
            <label className="text-neutral-400 text-xs">Content (full write-up — shown on the project page)</label>
            <TiptapEditor
                value={formData.content}
                onChange={(value: string) => setFormData({ ...formData, content: value })}
            />
        </div>

        <div className="flex gap-3 items-center border border-dashed border-neutral-700 rounded-xl p-3">
            <input
                type="file"
                accept="image/*"
                onChange={(e) => onFileSelect(e.target.files?.[0] ?? null)}
                className="text-sm text-neutral-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-neutral-800 file:text-neutral-300 hover:file:bg-neutral-700 flex-1"
            />
            {uploadProgress !== null
                ? <span className="shrink-0 text-xs text-blue-400">{uploadProgress}%</span>
                : localPreview && <span className="shrink-0 text-xs text-blue-400">New image ready</span>
            }
        </div>

        {/* Show local preview for newly selected file, or existing saved image */}
        {(localPreview || formData.image) && (
            <div className="relative w-full h-40 overflow-hidden rounded-lg border border-neutral-800">
                <Image src={localPreview || formData.image} alt="preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, 600px" />
            </div>
        )}

        <input className={inputCls} placeholder="Tech stack (comma-separated: React, Node.js, MongoDB)" value={formData.techStack}
            onChange={(e) => setFormData({ ...formData, techStack: e.target.value })} />
        <input className={inputCls} placeholder="Live URL" value={formData.liveUrl}
            onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })} />
        <input className={inputCls} placeholder="Repo URL" value={formData.repoUrl}
            onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })} />
        <select className={inputCls} value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
            <option value="uncategorized">Select a category</option>
            <option value="web">Web</option>
            <option value="mobile">Mobile</option>
            <option value="tool">Tool</option>
            <option value="other">Other</option>
        </select>
        <label className="flex items-center gap-3 text-sm text-neutral-400 cursor-pointer">
            <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 accent-blue-600"
            />
            Featured project
        </label>
        {formError && <p className="text-red-400 text-sm">{formError}</p>}
    </div>
);

export default function DashProjects() {
    const { currentUser } = useSelector((state: any) => state.user);
    const [projects, setProjects] = useState<any[]>([]);
    const [showMore, setShowMore] = useState(true);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectIdToDelete, setProjectIdToDelete] = useState("");

    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState(emptyForm);
    const [editProjectId, setEditProjectId] = useState("");
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [editPreview, setEditPreview] = useState<string | null>(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [addFormData, setAddFormData] = useState(emptyForm);
    const [addImageFile, setAddImageFile] = useState<File | null>(null);
    const [addPreview, setAddPreview] = useState<string | null>(null);

    const [formError, setFormError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch("/api/project/getprojects");
                const data = await res.json();
                if (res.ok) {
                    setProjects(data.projects);
                    if (data.projects.length < 9) setShowMore(false);
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (currentUser.isAdmin) fetchProjects();
    }, [currentUser._id]);

    const handleShowMore = async () => {
        try {
            const res = await fetch(`/api/project/getprojects?startIndex=${projects.length}`);
            const data = await res.json();
            if (res.ok) {
                setProjects((prev) => [...prev, ...data.projects]);
                if (data.projects.length < 9) setShowMore(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteProject = async () => {
        setShowDeleteModal(false);
        const project = projects.find((p) => p._id === projectIdToDelete);
        try {
            const res = await fetch(`/api/project/deleteproject/${projectIdToDelete}/${currentUser._id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) console.log(data.message);
            else {
                setProjects((prev) => prev.filter((p) => p._id !== projectIdToDelete));
                // Clean up image from Firebase Storage after successful deletion
                if (project?.image) await deleteFirebaseImage(project.image);
            }
        } catch (error: any) {
            console.log(error.message);
        }
    };

    const openEditModal = (project: any) => {
        setEditProjectId(project._id);
        setEditFormData({
            title: project.title,
            description: project.description,
            content: project.content || "",
            image: project.image || "",
            techStack: (project.techStack || []).join(", "),
            liveUrl: project.liveUrl || "",
            repoUrl: project.repoUrl || "",
            category: project.category,
            featured: project.featured,
        });
        setEditImageFile(null);
        if (editPreview) { URL.revokeObjectURL(editPreview); setEditPreview(null); }
        setFormError(null);
        setShowEditModal(true);
    };

    const handleEditFileSelect = (file: File | null) => {
        if (editPreview) URL.revokeObjectURL(editPreview);
        setEditImageFile(file);
        setEditPreview(file ? URL.createObjectURL(file) : null);
    };

    const handleAddFileSelect = (file: File | null) => {
        if (addPreview) URL.revokeObjectURL(addPreview);
        setAddImageFile(file);
        setAddPreview(file ? URL.createObjectURL(file) : null);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setIsSubmitting(true);

        const originalImage = projects.find((p) => p._id === editProjectId)?.image || "";
        let uploadedUrl: string | null = null;

        if (editImageFile) {
            try {
                uploadedUrl = await uploadFirebaseImage(editImageFile, setUploadProgress);
            } catch {
                setFormError("Image upload failed");
                setIsSubmitting(false);
                setUploadProgress(null);
                return;
            }
            setUploadProgress(null);
        }

        const payload = {
            ...editFormData,
            ...(uploadedUrl ? { image: uploadedUrl } : {}),
            techStack: editFormData.techStack.split(",").map((s: string) => s.trim()).filter(Boolean),
        };

        try {
            const res = await fetch(`/api/project/updateproject/${editProjectId}/${currentUser._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) {
                if (uploadedUrl) await deleteFirebaseImage(uploadedUrl);
                setFormError(data.message);
            } else {
                // Delete old image from storage if it was replaced
                if (uploadedUrl && originalImage) await deleteFirebaseImage(originalImage);
                setProjects((prev) => prev.map((p) => (p._id === editProjectId ? data : p)));
                setShowEditModal(false);
            }
        } catch {
            if (uploadedUrl) await deleteFirebaseImage(uploadedUrl);
            setFormError("Something went wrong.");
        }
        setIsSubmitting(false);
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setIsSubmitting(true);

        let uploadedUrl: string | null = null;

        if (addImageFile) {
            try {
                uploadedUrl = await uploadFirebaseImage(addImageFile, setUploadProgress);
            } catch {
                setFormError("Image upload failed");
                setIsSubmitting(false);
                setUploadProgress(null);
                return;
            }
            setUploadProgress(null);
        }

        const payload = {
            ...addFormData,
            ...(uploadedUrl ? { image: uploadedUrl } : {}),
            techStack: addFormData.techStack.split(",").map((s: string) => s.trim()).filter(Boolean),
        };

        try {
            const res = await fetch("/api/project/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) {
                if (uploadedUrl) await deleteFirebaseImage(uploadedUrl);
                setFormError(data.message);
            } else {
                setProjects((prev) => [data, ...prev]);
                setAddFormData(emptyForm);
                if (addPreview) { URL.revokeObjectURL(addPreview); setAddPreview(null); }
                setAddImageFile(null);
                setShowAddModal(false);
            }
        } catch {
            if (uploadedUrl) await deleteFirebaseImage(uploadedUrl);
            setFormError("Something went wrong.");
        }
        setIsSubmitting(false);
    };

    const thCls = "text-left text-neutral-500 font-medium px-4 py-3 text-xs uppercase tracking-wide";
    const tdCls = "px-4 py-3 text-neutral-300 text-sm";

    return (
        <div className="p-4 w-full">
            {currentUser.isAdmin && (
                <div className="mb-4">
                    <motion.button
                        onClick={() => { setAddFormData(emptyForm); setAddImageFile(null); if (addPreview) { URL.revokeObjectURL(addPreview); setAddPreview(null); } setFormError(null); setShowAddModal(true); }}
                        whileHover={{ scale: 1.06, boxShadow: "0 0 20px rgba(37,99,235,0.4)" }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        + Add Project
                    </motion.button>
                </div>
            )}

            {currentUser.isAdmin && projects.length > 0 ? (
                <>
                    <div className="overflow-x-auto rounded-xl border border-neutral-800 scrollbar scrollbar-track-neutral-900 scrollbar-thumb-neutral-700">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-800 bg-neutral-900">
                                    <th className={thCls}>Updated</th>
                                    <th className={thCls}>Image</th>
                                    <th className={thCls}>Title</th>
                                    <th className={thCls}>Category</th>
                                    <th className={thCls}>Tech Stack</th>
                                    <th className={thCls}>Featured</th>
                                    <th className={thCls}>Delete</th>
                                    <th className={thCls}>Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project) => (
                                    <tr key={project._id} className="border-b border-neutral-800 last:border-0 hover:bg-neutral-800/40 transition-colors">
                                        <td className={tdCls}>{new Date(project.updatedAt).toLocaleDateString()}</td>
                                        <td className={tdCls}>
                                            {project.image
                                                ? (
                                                    <div className="relative w-20 h-11 overflow-hidden rounded border border-neutral-700">
                                                        <Image src={project.image} alt={project.title} fill className="object-cover" sizes="80px" />
                                                    </div>
                                                )
                                                : <span className="text-neutral-600 text-xs">No image</span>
                                            }
                                        </td>
                                        <td className={`${tdCls} max-w-[160px]`}>
                                            <span className="text-white line-clamp-1">{project.title}</span>
                                        </td>
                                        <td className={tdCls}>{project.category}</td>
                                        <td className={`${tdCls} max-w-[160px]`}>
                                            <span className="line-clamp-1">{(project.techStack || []).join(", ") || "—"}</span>
                                        </td>
                                        <td className={tdCls}>
                                            <span className={project.featured ? "text-blue-400" : "text-neutral-600"}>
                                                {project.featured ? "Yes" : "No"}
                                            </span>
                                        </td>
                                        <td className={tdCls}>
                                            <button
                                                onClick={() => { setShowDeleteModal(true); setProjectIdToDelete(project._id); }}
                                                className="text-red-500 hover:text-red-400 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                        <td className={tdCls}>
                                            <button onClick={() => openEditModal(project)} className="text-blue-500 hover:text-blue-400 transition-colors">
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {showMore && (
                        <button onClick={handleShowMore} className="mt-4 w-full text-blue-500 hover:text-blue-400 text-sm py-3 transition-colors">
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <p className="text-neutral-500 text-sm">No projects yet. Add one above!</p>
            )}

            {/* Delete confirmation modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="text-center">
                    <HiOutlineExclamationCircle className="h-12 w-12 text-neutral-500 mx-auto mb-4" />
                    <p className="text-neutral-300 mb-6">Are you sure you want to delete this project?</p>
                    <div className="flex justify-center gap-3">
                        <motion.button onClick={handleDeleteProject} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring" as const, stiffness: 400, damping: 17 }} className="bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                            Yes, delete
                        </motion.button>
                        <motion.button onClick={() => setShowDeleteModal(false)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring" as const, stiffness: 400, damping: 17 }} className="border border-neutral-700 hover:border-neutral-600 text-neutral-300 text-sm px-4 py-2 rounded-lg transition-colors">
                            Cancel
                        </motion.button>
                    </div>
                </div>
            </Modal>

            {/* Edit project modal */}
            <Modal show={showEditModal} onClose={() => { setShowEditModal(false); if (editPreview) { URL.revokeObjectURL(editPreview); setEditPreview(null); } }} title="Edit Project">
                <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                    <ProjectFormFields
                        formData={editFormData}
                        setFormData={setEditFormData}
                        formError={formError}
                        onFileSelect={handleEditFileSelect}
                        localPreview={editPreview}
                        uploadProgress={isSubmitting ? uploadProgress : null}
                    />
                    <div className="flex justify-end gap-3 mt-2">
                        <motion.button type="button" onClick={() => { setShowEditModal(false); if (editPreview) { URL.revokeObjectURL(editPreview); setEditPreview(null); } }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring" as const, stiffness: 400, damping: 17 }} className="border border-neutral-700 hover:border-neutral-600 text-neutral-300 text-sm px-4 py-2 rounded-lg transition-colors">
                            Cancel
                        </motion.button>
                        <motion.button type="submit" disabled={isSubmitting} whileHover={!isSubmitting ? { scale: 1.06, boxShadow: "0 0 20px rgba(37,99,235,0.4)" } : {}} whileTap={!isSubmitting ? { scale: 0.96 } : {}} transition={{ type: "spring" as const, stiffness: 400, damping: 17 }} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                            {isSubmitting ? "Saving…" : "Save Changes"}
                        </motion.button>
                    </div>
                </form>
            </Modal>

            {/* Add project modal */}
            <Modal show={showAddModal} onClose={() => { setShowAddModal(false); if (addPreview) { URL.revokeObjectURL(addPreview); setAddPreview(null); } }} title="Add New Project">
                <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
                    <ProjectFormFields
                        formData={addFormData}
                        setFormData={setAddFormData}
                        formError={formError}
                        onFileSelect={handleAddFileSelect}
                        localPreview={addPreview}
                        uploadProgress={isSubmitting ? uploadProgress : null}
                    />
                    <div className="flex justify-end gap-3 mt-2">
                        <motion.button type="button" onClick={() => { setShowAddModal(false); if (addPreview) { URL.revokeObjectURL(addPreview); setAddPreview(null); } }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring" as const, stiffness: 400, damping: 17 }} className="border border-neutral-700 hover:border-neutral-600 text-neutral-300 text-sm px-4 py-2 rounded-lg transition-colors">
                            Cancel
                        </motion.button>
                        <motion.button type="submit" disabled={isSubmitting} whileHover={!isSubmitting ? { scale: 1.06, boxShadow: "0 0 20px rgba(37,99,235,0.4)" } : {}} whileTap={!isSubmitting ? { scale: 0.96 } : {}} transition={{ type: "spring" as const, stiffness: 400, damping: 17 }} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                            {isSubmitting ? "Saving…" : "Add Project"}
                        </motion.button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
