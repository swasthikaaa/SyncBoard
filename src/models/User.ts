import mongoose, { Schema, Document as MongoDocument } from 'mongoose';

export interface IUser extends MongoDocument {
    name: string;
    email: string;
    password: string;
    avatarColor: string;
    resetOTP?: string;
    resetOTPExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        password: { type: String, required: true },
        avatarColor: {
            type: String,
            default: () => {
                const colors = [
                    '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
                    '#ec4899', '#f43f5e', '#ef4444', '#f97316',
                    '#eab308', '#22c55e', '#14b8a6', '#06b6d4',
                    '#3b82f6', '#6366f1',
                ];
                return colors[Math.floor(Math.random() * colors.length)];
            },
        },
        resetOTP: { type: String },
        resetOTPExpires: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
