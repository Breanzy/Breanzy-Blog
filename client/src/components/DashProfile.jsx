import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
    updateStart, updateSuccess, updateFailure,
    deleteUserStart, deleteUserSuccess, deleteUserFailure,
    signoutSuccess,
} from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import Modal from "./Modal";

const inputCls = "w-full bg-neutral-950 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-600 rounded-lg px-3 py-2 text-sm";

export default function DashProfile() {
    const { currentUser, error, loading } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const filePickerRef = useRef();

    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Trigger upload whenever a new image file is selected
    useEffect(() => {
        if (imageFile) uploadImage();
    }, [imageFile]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };

    const uploadImage = async () => {
        setImageFileUploading(true);
        setImageFileUploadError(null);
        const storage = getStorage(app);
        const storageRef = ref(storage, new Date().getTime() + imageFile.name);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0));
            },
            () => {
                setImageFileUploadError("Could not upload image (max 20MB)");
                setImageFileUploadProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                setImageFileUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setImageFileUrl(url);
                    setFormData({ ...formData, profilePicture: url });
                    setImageFileUploading(false);
                });
            }
        );
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        if (Object.keys(formData).length === 0) {
            setUpdateUserError("No changes were made");
            return;
        }
        if (imageFileUploading) {
            setUpdateUserError("Please wait for the image to finish uploading");
            return;
        }
        try {
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
            } else {
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("Profile updated successfully");
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message);
        }
    };

    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) dispatch(deleteUserFailure(data.message));
            else dispatch(deleteUserSuccess(data));
        } catch (error) {
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

    return (
        <div className="max-w-lg mx-auto px-4 py-8 w-full">
            <h1 className="text-white text-2xl font-semibold mb-8">Profile</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Hidden file input */}
                <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />

                {/* Avatar with upload progress overlay */}
                <div
                    className="relative w-28 h-28 self-center cursor-pointer rounded-full overflow-hidden border border-neutral-800 hover:border-blue-600 transition-colors"
                    onClick={() => filePickerRef.current.click()}
                >
                    {imageFileUploadProgress && (
                        <CircularProgressbar
                            value={imageFileUploadProgress || 0}
                            text={`${imageFileUploadProgress}%`}
                            strokeWidth={4}
                            styles={{
                                root: { position: "absolute", inset: 0, width: "100%", height: "100%" },
                                path: { stroke: "#3b82f6" },
                                text: { fill: "#fff", fontSize: "1.5rem" },
                            }}
                        />
                    )}
                    <img
                        src={imageFileUrl || currentUser.profilePicture}
                        alt="avatar"
                        className={`w-full h-full object-cover ${imageFileUploadProgress && imageFileUploadProgress < 100 ? "opacity-50" : ""}`}
                    />
                </div>

                {imageFileUploadError && (
                    <p className="text-red-400 text-sm text-center">{imageFileUploadError}</p>
                )}

                <input id="username" type="text" placeholder="Username" defaultValue={currentUser.username} onChange={handleChange} className={inputCls} />
                <input id="email" type="email" placeholder="Email" defaultValue={currentUser.email} onChange={handleChange} className={inputCls} />
                <input id="password" type="password" placeholder="New password" onChange={handleChange} className={inputCls} />

                <button
                    type="submit"
                    disabled={loading || imageFileUploading}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition-colors"
                >
                    {loading ? "Updating..." : "Update Profile"}
                </button>

                {currentUser.isAdmin && (
                    <Link to="/create-post">
                        <button type="button" className="w-full border border-neutral-700 hover:border-blue-600 text-neutral-300 hover:text-white py-2 rounded-lg transition-colors text-sm">
                            + Create a Post
                        </button>
                    </Link>
                )}
            </form>

            {/* Feedback messages */}
            {updateUserSuccess && <p className="mt-4 text-green-400 text-sm">{updateUserSuccess}</p>}
            {(updateUserError || error) && <p className="mt-4 text-red-400 text-sm">{updateUserError || error}</p>}

            {/* Danger zone */}
            <div className="mt-6 flex justify-between text-sm">
                <button onClick={() => setShowModal(true)} className="text-red-500 hover:text-red-400 transition-colors">
                    Delete Account
                </button>
                <button onClick={handleSignout} className="text-neutral-400 hover:text-white transition-colors">
                    Sign Out
                </button>
            </div>

            {/* Delete confirmation modal */}
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
