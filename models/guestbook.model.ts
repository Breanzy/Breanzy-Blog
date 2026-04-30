import mongoose from "mongoose";

const guestbookSchema = new mongoose.Schema(
    {
        content: { type: String, required: true, maxlength: 240 },
        userId: { type: String, required: true },
        username: { type: String, required: true },
        profilePicture: { type: String, default: "" },
    },
    { timestamps: true }
);

const Guestbook = (mongoose.models.Guestbook || mongoose.model("Guestbook", guestbookSchema)) as mongoose.Model<any>;
export default Guestbook;
