import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        unsubscribeToken: { type: String, required: true },
    },
    { timestamps: true }
);

const Subscriber = (mongoose.models.Subscriber || mongoose.model("Subscriber", subscriberSchema)) as mongoose.Model<any>;
export default Subscriber;
