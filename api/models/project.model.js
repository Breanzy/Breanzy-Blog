import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: "",
        },
        techStack: {
            type: [String],
            default: [],
        },
        liveUrl: {
            type: String,
            default: "",
        },
        repoUrl: {
            type: String,
            default: "",
        },
        featured: {
            type: Boolean,
            default: false,
        },
        category: {
            type: String,
            default: "uncategorized",
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
