import mongoose, { Schema, Document as MongoDocument } from 'mongoose';

export interface IDocument extends MongoDocument {
    title: string;
    content: string;
    owner: mongoose.Types.ObjectId;
    collaborators: mongoose.Types.ObjectId[];
    emoji: string;
    isPublic: boolean;
    lastEditedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
    {
        title: { type: String, default: 'Untitled Document', trim: true },
        content: { type: String, default: '' },
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        collaborators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        emoji: { type: String, default: '📄' },
        isPublic: { type: Boolean, default: false },
        lastEditedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

DocumentSchema.index({ owner: 1 });
DocumentSchema.index({ collaborators: 1 });
DocumentSchema.index({ updatedAt: -1 });

export default mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);
