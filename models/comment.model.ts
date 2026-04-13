import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        content: { type: String, required: true },
        postId: { type: String, required: true },
        userId: { type: String, required: true },
        likes: { type: Array, default: [] },
        numberOfLikes: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Comment = (mongoose.models.Comment || mongoose.model("Comment", commentSchema)) as mongoose.Model<any>;
export default Comment;
