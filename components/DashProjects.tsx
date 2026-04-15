"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from "firebase/storage";
import { app } from "@/firebase";
import Modal from "./Modal";

const emptyForm = {
    title: "",
    description: "",
    image: "",
    techStack: "",
    liveUrl: "",
    repoUrl: "",
    category: "uncategorized",
    featured: false,
};

const inputCls = "w-full bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-600 rounded-lg px-3 py-2 text-sm";

/* Shared form fields for add/edit project modals — manages its own image upload state */
const ProjectFormFields = ({ formData, setFormData, formError }: any) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUploadProgress, setImageUploadProgress] = useState<string | null>(null);
    const [imageUploadError, setImageUploadError] = useState<string | null>(null);

    const handleUploadImage = async () => {
        if (!imageFile) { setImageUploadError("Please select an image"); return; }
        setImageUploadError(null);
        try {
            const storage = getStorage(app);
            const storageRef = ref(storage, new Date().getTime() + "-" + imageFile.name);
            const uploadTask = uploadBytesResumable(storageRef, imageFile);
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
                        setFormData({ ...formData, image: url });
                    });
                }
            );
        } catch {
            setImageUploadError("Image upload failed");
            setImageUploadProgress(null);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <input className={inputCls} placeholder="Title" required value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            <textarea className={`${inputCls} resize-none`} placeholder="Description" required rows={3} value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

            <div className="flex gap-3 items-center border border-dashed border-neutral-700 rounded-xl p-3">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                    className="text-sm text-neutral-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-neutral-800 file:text-neutral-300 hover:file:bg-neutral-700 flex-1"
                />
                <motion.button
                    type="button"
                    onClick={handleUploadImage}
                    disabled={!!imageUploadProgress}
                    whileHover={!imageUploadProgress ? { scale: 1.03 } : {}}
                    whileTap={!imageUploadProgress ? { scale: 0.96 } : {}}
                    transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                    className="shrink-0 border border-neutral-700 hover:border-blue-600 text-neutral-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed text-xs px-3 py-1.5 rounded-lg transition-colors"
                >
                    {imageUploadProgress ? `${imageUploadProgress}%` : "Upload"}
                </motion.button>
            </div>
            {imageUploadError && <p className="text-red-400 text-xs">{imageUploadError}</p>}
            {formData.image && (
                <div className="relative w-full h-40 overflow-hidden rounded-lg border border-neutral-800">
                    <Image src={formData.image} alt="preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, 600px" />
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
};

export default function DashProjects() {
    const { currentUser } = useSelector((state: any) => state.user);
    const [projects, setProjects] = useState<any[]>([]);
    const [showMore, setShowMore] = useState(true);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectIdToDelete, setProjectIdToDelete] = useState("");

    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState(emptyForm);
    const [editProjectId, setEditProjectId] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);
    const [addFormData, setAddFormData] = useState(emptyForm);

    const [formError, setFormError] = useState<string | null>(null);

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
        try {
            const res = await fetch(`/api/project/deleteproject/${projectIdToDelete}/${currentUser._id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) console.log(data.message);
            else setProjects((prev) => prev.filter((p) => p._id !== projectIdToDelete));
        } catch (error: any) {
            console.log(error.message);
        }
    };

    const openEditModal = (project: any) => {
        setEditProjectId(project._id);
        setEditFormData({
            title: project.title,
            description: project.description,
            image: project.image || "",
            techStack: (project.techStack || []).join(", "),
            liveUrl: project.liveUrl || "",
            repoUrl: project.repoUrl || "",
            category: project.category,
            featured: project.featured,
        });
        setFormError(null);
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        try {
            const res = await fetch(`/api/project/updateproject/${editProjectId}/${currentUser._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...editFormData,
                    techStack: editFormData.techStack.split(",").map((s: string) => s.trim()).filter(Boolean),
                }),
            });
            const data = await res.json();
            if (!res.ok) setFormError(data.message);
            else {
                setProjects((prev) => prev.map((p) => (p._id === editProjectId ? data : p)));
                setShowEditModal(false);
            }
        } catch {
            setFormError("Something went wrong.");
        }
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        try {
            const res = await fetch("/api/project/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...addFormData,
                    techStack: addFormData.techStack.split(",").map((s: string) => s.trim()).filter(Boolean),
                }),
            });
            const data = await res.json();
            if (!res.ok) setFormError(data.message);
            else {
                setProjects((prev) => [data, ...prev]);
                setAddFormData(emptyForm);
                setShowAddModal(false);
            }
        } catch {
            setFormError("Something went wrong.");
        }
    };

    const thCls = "text-left text-neutral-500 font-medium px-4 py-3 text-xs uppercase tracking-wide";
    const tdCls = "px-4 py-3 text-neutral-300 text-sm";

    return (
        <div className="p-4 w-full">
            {currentUser.isAdmin && (
                <div className="mb-4">
                    <motion.button
                        onClick={() => { setAddFormData(emptyForm); setFormError(null); setShowAddModal(true); }}
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
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Project">
                <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                    <ProjectFormFields formData={editFormData} setFormData={setEditFormData} formError={formError} />
                    <div className="flex justify-end gap-3 mt-2">
                        <motion.button type="button" onClick={() => setShowEditModal(false)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring" as const, stiffness: 400, damping: 17 }} className="border border-neutral-700 hover:border-neutral-600 text-neutral-300 text-sm px-4 py-2 rounded-lg transition-colors">
                            Cancel
                        </motion.button>
                        <motion.button type="submit" whileHover={{ scale: 1.06, boxShadow: "0 0 20px rgba(37,99,235,0.4)" }} whileTap={{ scale: 0.96 }} transition={{ type: "spring" as const, stiffness: 400, damping: 17 }} className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                            Save Changes
                        </motion.button>
                    </div>
                </form>
            </Modal>

            {/* Add project modal */}
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Project">
                <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
                    <ProjectFormFields formData={addFormData} setFormData={setAddFormData} formError={formError} />
                    <div className="flex justify-end gap-3 mt-2">
                        <motion.button type="button" onClick={() => setShowAddModal(false)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring" as const, stiffness: 400, damping: 17 }} className="border border-neutral-700 hover:border-neutral-600 text-neutral-300 text-sm px-4 py-2 rounded-lg transition-colors">
                            Cancel
                        </motion.button>
                        <motion.button type="submit" whileHover={{ scale: 1.06, boxShadow: "0 0 20px rgba(37,99,235,0.4)" }} whileTap={{ scale: 0.96 }} transition={{ type: "spring" as const, stiffness: 400, damping: 17 }} className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                            Add Project
                        </motion.button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
