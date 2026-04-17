import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        content: { type: String, required: true },
        title: { type: String, required: true },
        image: {
            type: String,
            default: "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
        },
        category: { type: String, default: "uncategorized" },
        slug: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

// Text index on title for fast full-text search
postSchema.index({ title: "text" });

const Post = (mongoose.models.Post || mongoose.model("Post", postSchema)) as mongoose.Model<any>;
export default Post;
