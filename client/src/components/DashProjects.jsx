import { Button, Modal, Table, TextInput, Textarea, Select, ToggleSwitch } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";

// Initial state for a blank project form
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

export default function DashProjects() {
    const { currentUser } = useSelector((state) => state.user);
    const [projects, setProjects] = useState([]);
    const [showMore, setShowMore] = useState(true);

    // Delete modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectIdToDelete, setProjectIdToDelete] = useState("");

    // Edit modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState(emptyForm);
    const [editProjectId, setEditProjectId] = useState("");

    // Add modal state
    const [showAddModal, setShowAddModal] = useState(false);
    const [addFormData, setAddFormData] = useState(emptyForm);

    const [formError, setFormError] = useState(null);

    // Fetch all projects on mount
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

    // Load the next page of projects
    const handleShowMore = async () => {
        const startIndex = projects.length;
        try {
            const res = await fetch(`/api/project/getprojects?startIndex=${startIndex}`);
            const data = await res.json();
            if (res.ok) {
                setProjects((prev) => [...prev, ...data.projects]);
                if (data.projects.length < 9) setShowMore(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Delete a project after confirmation
    const handleDeleteProject = async () => {
        setShowDeleteModal(false);
        try {
            const res = await fetch(
                `/api/project/deleteproject/${projectIdToDelete}/${currentUser._id}`,
                { method: "DELETE" }
            );
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setProjects((prev) => prev.filter((p) => p._id !== projectIdToDelete));
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    // Open the edit modal pre-populated with the selected project's data
    const openEditModal = (project) => {
        setEditProjectId(project._id);
        setEditFormData({
            title: project.title,
            description: project.description,
            image: project.image || "",
            // Join array back to comma-separated string for editing
            techStack: (project.techStack || []).join(", "),
            liveUrl: project.liveUrl || "",
            repoUrl: project.repoUrl || "",
            category: project.category,
            featured: project.featured,
        });
        setFormError(null);
        setShowEditModal(true);
    };

    // Submit the edit form
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        try {
            const res = await fetch(
                `/api/project/updateproject/${editProjectId}/${currentUser._id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...editFormData,
                        // Split comma-separated string back to array before saving
                        techStack: editFormData.techStack
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                    }),
                }
            );
            const data = await res.json();
            if (!res.ok) {
                setFormError(data.message);
            } else {
                setProjects((prev) =>
                    prev.map((p) => (p._id === editProjectId ? data : p))
                );
                setShowEditModal(false);
            }
        } catch (error) {
            setFormError("Something went wrong.");
        }
    };

    // Submit the add form
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        try {
            const res = await fetch("/api/project/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...addFormData,
                    techStack: addFormData.techStack
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setFormError(data.message);
            } else {
                setProjects((prev) => [data, ...prev]);
                setAddFormData(emptyForm);
                setShowAddModal(false);
            }
        } catch (error) {
            setFormError("Something went wrong.");
        }
    };

    // Shared form fields used by both add and edit modals
    const ProjectFormFields = ({ formData, setFormData }) => (
        <div className="flex flex-col gap-3">
            <TextInput
                placeholder="Title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Textarea
                placeholder="Description"
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <TextInput
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
            <TextInput
                placeholder="Tech stack (comma-separated: React, Node.js, MongoDB)"
                value={formData.techStack}
                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
            />
            <TextInput
                placeholder="Live URL"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
            />
            <TextInput
                placeholder="Repo URL"
                value={formData.repoUrl}
                onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
            />
            <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
                <option value="uncategorized">Select a category</option>
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
                <option value="tool">Tool</option>
                <option value="other">Other</option>
            </Select>
            <ToggleSwitch
                label="Featured"
                checked={formData.featured}
                onChange={(val) => setFormData({ ...formData, featured: val })}
            />
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
        </div>
    );

    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 w-full">
            {/* Add project button */}
            {currentUser.isAdmin && (
                <div className="mb-4">
                    <Button
                        gradientDuoTone="purpleToPink"
                        onClick={() => {
                            setAddFormData(emptyForm);
                            setFormError(null);
                            setShowAddModal(true);
                        }}
                    >
                        + Add Project
                    </Button>
                </div>
            )}

            {currentUser.isAdmin && projects.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Date updated</Table.HeadCell>
                            <Table.HeadCell>Image</Table.HeadCell>
                            <Table.HeadCell>Title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>Tech Stack</Table.HeadCell>
                            <Table.HeadCell>Featured</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                            <Table.HeadCell>Edit</Table.HeadCell>
                        </Table.Head>
                        {projects.map((project) => (
                            <Table.Body className="divide-y" key={project._id}>
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>
                                        {new Date(project.updatedAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {project.image ? (
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="w-20 h-10 object-cover bg-gray-500"
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-xs">No image</span>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {project.title}
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>{project.category}</Table.Cell>
                                    <Table.Cell>
                                        {(project.techStack || []).join(", ") || "—"}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {project.featured ? "Yes" : "No"}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span
                                            onClick={() => {
                                                setShowDeleteModal(true);
                                                setProjectIdToDelete(project._id);
                                            }}
                                            className="font-medium text-red-500 hover:underline cursor-pointer"
                                        >
                                            Delete
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span
                                            onClick={() => openEditModal(project)}
                                            className="text-teal-500 hover:underline cursor-pointer"
                                        >
                                            Edit
                                        </span>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className="w-full text-teal-500 self-center text-sm py-7"
                        >
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <p>No projects yet. Add one above!</p>
            )}

            {/* Delete confirmation modal */}
            <Modal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                popup
                size="md"
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this project?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDeleteProject}>
                                Yes, I'm sure
                            </Button>
                            <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Edit project modal */}
            <Modal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                size="lg"
            >
                <Modal.Header>Edit Project</Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                        <ProjectFormFields
                            formData={editFormData}
                            setFormData={setEditFormData}
                        />
                        <div className="flex justify-end gap-3">
                            <Button color="gray" onClick={() => setShowEditModal(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" gradientDuoTone="purpleToPink">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            {/* Add project modal */}
            <Modal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                size="lg"
            >
                <Modal.Header>Add New Project</Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
                        <ProjectFormFields
                            formData={addFormData}
                            setFormData={setAddFormData}
                        />
                        <div className="flex justify-end gap-3">
                            <Button color="gray" onClick={() => setShowAddModal(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" gradientDuoTone="purpleToPink">
                                Add Project
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
