"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
    updateStart, updateSuccess, updateFailure,
    deleteUserStart, deleteUserSuccess, deleteUserFailure,
    signoutSuccess,
} from "@/redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Link from "next/link";
import Modal from "./Modal";
import { uploadFirebaseImage, deleteFirebaseImage } from "@/lib/firebaseStorage";

const inputCls = "w-full bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-600 rounded-lg px-3 py-2 text-sm";

export default function DashProfile() {
    const { currentUser, error, loading } = useSelector((state: any) => state.user);
    const dispatch = useDispatch();
    const filePickerRef = useRef<HTMLInputElement>(null);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [localPreview, setLocalPreview] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [imageFileUploadError, setImageFileUploadError] = useState<string | null>(null);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [updateUserSuccess, setUpdateUserSuccess] = useState<string | null>(null);
    const [updateUserError, setUpdateUserError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Revoke the blob preview URL when component unmounts
    useEffect(() => {
        return () => { if (localPreview) URL.revokeObjectURL(localPreview); };
    }, [localPreview]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // Revoke previous local preview before creating a new one
        if (localPreview) URL.revokeObjectURL(localPreview);
        setImageFile(file);
        setLocalPreview(URL.createObjectURL(file));
        setImageFileUploadError(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        if (Object.keys(formData).length === 0 && !imageFile) {
            setUpdateUserError("No changes were made");
            return;
        }

        const originalPic: string = currentUser.profilePicture || "";
        let uploadedUrl: string | null = null;

        // Upload the new profile picture if one was selected
        if (imageFile) {
            setImageFileUploadError(null);
            try {
                uploadedUrl = await uploadFirebaseImage(imageFile, setUploadProgress);
            } catch {
                setImageFileUploadError("Could not upload image (max 20MB)");
                setUploadProgress(null);
                return;
            }
            setUploadProgress(null);
        }

        const payload = { ...formData, ...(uploadedUrl ? { profilePicture: uploadedUrl } : {}) };

        try {
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) {
                // Update failed — delete the image we just uploaded
                if (uploadedUrl) await deleteFirebaseImage(uploadedUrl);
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
            } else {
                // Update succeeded with a new profile pic — delete the old one
                if (uploadedUrl && originalPic) await deleteFirebaseImage(originalPic);
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("Profile updated successfully");
                setImageFile(null);
                if (localPreview) { URL.revokeObjectURL(localPreview); setLocalPreview(null); }
            }
        } catch (error: any) {
            if (uploadedUrl) await deleteFirebaseImage(uploadedUrl);
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message);
        }
    };

    const handleDeleteUser = async () => {
        setShowModal(false);
        const picToDelete = currentUser.profilePicture || "";
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) {
                dispatch(deleteUserFailure(data.message));
            } else {
                // Account gone — clean up profile picture from Firebase Storage
                await deleteFirebaseImage(picToDelete);
                dispatch(deleteUserSuccess(data));
            }
        } catch (error: any) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    const handleSignout = async () => {
        try {
            const res = await fetch("/api/user/signout", { method: "POST" });
            const data = await res.json();
            if (res.ok) dispatch(signoutSuccess());
            else console.log(data.message);
        } catch (error) {
            console.log(error);
        }
    };

    const displayPic = localPreview || currentUser.profilePicture;

    return (
        <div className="max-w-lg mx-auto px-4 py-8 w-full">
            <h1 className="text-white text-2xl font-semibold mb-8">Profile</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />

                <div
                    className="relative w-28 h-28 self-center cursor-pointer rounded-full overflow-hidden border border-neutral-800 hover:border-blue-600 transition-colors"
                    onClick={() => filePickerRef.current?.click()}
                >
                    {uploadProgress !== null && (
                        <CircularProgressbar
                            value={uploadProgress}
                            text={`${uploadProgress}%`}
                            strokeWidth={4}
                            styles={{
                                root: { position: "absolute", inset: 0, width: "100%", height: "100%" },
                                path: { stroke: "#3b82f6" },
                                text: { fill: "#fff", fontSize: "1.5rem" },
                            }}
                        />
                    )}
                    <img
                        src={displayPic}
                        alt="avatar"
                        className={`w-full h-full object-cover ${uploadProgress !== null && uploadProgress < 100 ? "opacity-50" : ""}`}
                    />
                </div>

                {imageFile && uploadProgress === null && (
                    <p className="text-blue-400 text-xs text-center">New photo selected — will upload on Save</p>
                )}

                {imageFileUploadError && (
                    <p className="text-red-400 text-sm text-center">{imageFileUploadError}</p>
                )}

                <input id="username" type="text" placeholder="Username" defaultValue={currentUser.username} onChange={handleChange} className={inputCls} />
                <input id="email" type="email" placeholder="Email" defaultValue={currentUser.email} onChange={handleChange} className={inputCls} />
                <input id="password" type="password" placeholder="New password" onChange={handleChange} className={inputCls} />

                <button
                    type="submit"
                    disabled={loading || uploadProgress !== null}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors"
                >
                    {uploadProgress !== null ? `Uploading… ${uploadProgress}%` : loading ? "Updating..." : "Update Profile"}
                </button>

                {currentUser.isAdmin && (
                    <Link href="/create-post">
                        <button type="button" className="w-full border border-neutral-700 hover:border-blue-600 text-neutral-300 hover:text-white py-2 rounded-lg transition-colors text-sm">
                            + Create a Post
                        </button>
                    </Link>
                )}
            </form>

            {updateUserSuccess && <p className="mt-4 text-green-400 text-sm">{updateUserSuccess}</p>}
            {(updateUserError || error) && <p className="mt-4 text-red-400 text-sm">{updateUserError || error}</p>}

            <div className="mt-6 flex justify-between text-sm">
                <button onClick={() => setShowModal(true)} className="text-red-500 hover:text-red-400 transition-colors">
                    Delete Account
                </button>
                <button onClick={handleSignout} className="text-neutral-400 hover:text-white transition-colors">
                    Sign Out
                </button>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="text-center">
                    <HiOutlineExclamationCircle className="h-12 w-12 text-neutral-500 mx-auto mb-4" />
                    <p className="text-neutral-300 mb-6">Are you sure you want to delete your account? This cannot be undone.</p>
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={handleDeleteUser}
                            className="bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                        >
                            Yes, delete
                        </button>
                        <button
                            onClick={() => setShowModal(false)}
                            className="border border-neutral-700 hover:border-neutral-600 text-neutral-300 text-sm px-4 py-2 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
