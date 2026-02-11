import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import DocumentModel from '@/models/Document';
import User from '@/models/User';
import Version from '@/models/Version';
import { getPusherServer } from '@/lib/pusher-server';
import mongoose from 'mongoose';

// GET single document
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;
        const userId = (session.user as any).id;

        // Ensure id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid document ID' }, { status: 400 });
        }

        const document = await DocumentModel.findById(id)
            .populate('owner', 'name email avatarColor')
            .populate('collaborators', 'name email avatarColor')
            .populate('lastEditedBy', 'name email')
            .lean();

        if (!document) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        const isOwner = document.owner._id.toString() === userId;
        const isCollaborator = document.collaborators?.some(
            (c: any) => c._id.toString() === userId
        );

        if (!isOwner && !isCollaborator && !document.isPublic) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        return NextResponse.json({ document });
    } catch (error: any) {
        console.error('Error fetching document:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

// PUT update document
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        console.log('PUT request received');
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;
        const userId = (session.user as any).id;
        const body = await req.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid document ID' }, { status: 400 });
        }

        console.log('Fetching document to update:', id);
        const document = await DocumentModel.findById(id);
        if (!document) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        // --- VERSIONING (Wrapped in try/catch to ensure it doesn't break primary save) ---
        try {
            if (body.content && body.content !== document.content) {
                const lastVersion = await Version.findOne({ documentId: id })
                    .sort({ createdAt: -1 })
                    .lean();

                const fiveMinutes = 5 * 60 * 1000;
                const shouldSaveVersion = !lastVersion ||
                    (Date.now() - new Date(lastVersion.createdAt).getTime() > fiveMinutes);

                if (shouldSaveVersion) {
                    await Version.create({
                        documentId: id,
                        content: document.content || '',
                        title: document.title || 'Untitled',
                        editedBy: userId,
                    });
                }
            }
        } catch (versionError) {
            console.error('Version capture failed (non-blocking):', versionError);
        }

        // --- PRIMARY SAVE ---
        const updateData: any = {
            lastEditedBy: userId,
            title: body.title,
            content: body.content,
            emoji: body.emoji,
            isPublic: body.isPublic,
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        console.log('Updating document in MongoDB...');
        const updated = await DocumentModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        )
            .select('title content owner collaborators emoji isPublic updatedAt lastEditedBy')
            .populate('owner', 'name email avatarColor')
            .populate('collaborators', 'name email avatarColor')
            .populate('lastEditedBy', 'name email')
            .lean();

        if (!updated) {
            throw new Error('Update returned null');
        }

        // --- PUSHER BROADCAST (Non-blocking) ---
        try {
            getPusherServer().trigger(`document-${id}`, 'document-updated', {
                documentId: id,
                updates: updateData,
                updatedBy: { id: userId, name: session.user.name },
            }).catch(e => console.warn('Pusher hidden fail:', e.message));
        } catch (e) {
            // Silently ignore pusher init errors
        }

        console.log('Update successful');
        return NextResponse.json({ document: updated });

    } catch (error: any) {
        console.error('CRITICAL UPDATE ERROR:', error);
        return NextResponse.json({
            error: 'Server Error',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}

// DELETE document
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;
        const userId = (session.user as any).id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const document = await DocumentModel.findById(id);
        if (!document) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        if (document.owner.toString() !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await DocumentModel.findByIdAndDelete(id);
        await Version.deleteMany({ documentId: id });

        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error: any) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
