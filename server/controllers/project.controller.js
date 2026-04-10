import Project from "../models/project.model.js";
import { errorHandler } from "../utils/error.js";

// Create a new project (admin only)
export const createProject = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to create a project"));
    }

    if (!req.body.title || !req.body.description) {
        return next(errorHandler(400, "Please provide all required fields"));
    }

    // Generate slug from title (same pattern as post.controller.js)
    const slug = req.body.title
        .split(" ")
        .join("-")
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, "");

    const newProject = new Project({
        ...req.body,
        slug,
        userId: req.user.id,
    });

    try {
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (error) {
        next(error);
    }
};

// Get projects with optional filters (public)
export const getprojects = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === "asc" ? 1 : -1;

        const projects = await Project.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.projectId && { _id: req.query.projectId }),
            // Convert string "true"/"false" to boolean for featured filter
            ...(req.query.featured !== undefined && {
                featured: req.query.featured === "true",
            }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: "i" } },
                    { description: { $regex: req.query.searchTerm, $options: "i" } },
                ],
            }),
        })
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalProjects = await Project.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthProjects = await Project.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({ projects, totalProjects, lastMonthProjects });
    } catch (error) {
        next(error);
    }
};

// Delete a project (admin only)
export const deleteproject = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, "You do not have permission to delete this project"));
    }
    try {
        await Project.findByIdAndDelete(req.params.projectId);
        res.status(200).json("The project has been deleted");
    } catch (error) {
        next(error);
    }
};

// Update a project (admin only)
export const updateproject = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, "You do not have permission to update this project"));
    }

    try {
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.projectId,
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                    image: req.body.image,
                    techStack: req.body.techStack,
                    liveUrl: req.body.liveUrl,
                    repoUrl: req.body.repoUrl,
                    featured: req.body.featured,
                    category: req.body.category,
                },
            },
            { new: true }
        );
        res.status(200).json(updatedProject);
    } catch (error) {
        next(error);
    }
};
