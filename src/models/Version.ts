import mongoose, { Schema, Document as MongoDocument } from 'mongoose';

export interface IVersion extends MongoDocument {
    documentId: mongoose.Types.ObjectId;
    content: string;
    title: string;
    editedBy: mongoose.Types.ObjectId;
    createdAt: Date;
}

const VersionSchema = new Schema<IVersion>(
    {
        documentId: { type: Schema.Types.ObjectId, ref: 'Document', required: true, index: true },
        content: { type: String, required: true },
        title: { type: String, required: true },
        editedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

VersionSchema.index({ documentId: 1, createdAt: -1 });

export default mongoose.models.Version || mongoose.model<IVersion>('Version', VersionSchema);
