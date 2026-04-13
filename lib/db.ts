import mongoose from "mongoose";

/* Cache connection across serverless invocations on the same warm instance */
declare global {
    // eslint-disable-next-line no-var
    var _mongoConn: { conn: mongoose.Mongoose | null; promise: Promise<mongoose.Mongoose> | null } | undefined;
}

const cached = global._mongoConn ?? (global._mongoConn = { conn: null, promise: null });

export const connectDB = async () => {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGO!, { bufferCommands: false });
    }
    cached.conn = await cached.promise;
    return cached.conn;
};
