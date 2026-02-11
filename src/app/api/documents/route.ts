import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import DocumentModel from '@/models/Document';

// GET all documents for current user
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const userId = (session.user as any).id;

        const documents = await DocumentModel.find({
            $or: [{ owner: userId }, { collaborators: userId }],
        })
            .select('title content owner collaborators createdAt updatedAt lastEditedBy emoji isPublic')
            .populate('owner', 'name email avatarColor')
            .populate('lastEditedBy', 'name email')
            .sort({ updatedAt: -1 })
            .lean();

        return NextResponse.json({ documents });
    } catch (error: any) {
        console.error('Error fetching documents:', error);
        return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
    }
}

// POST create new document
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const userId = (session.user as any).id;
        const body = await req.json().catch(() => ({}));

        const document = await DocumentModel.create({
            title: body.title || 'Untitled Document',
            content: body.content || '',
            emoji: body.emoji || '📄',
            owner: userId,
            lastEditedBy: userId,
        });

        const populated = await DocumentModel.findById(document._id)
            .populate('owner', 'name email avatarColor')
            .lean();

        return NextResponse.json({ document: populated }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating document:', error);
        return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
    }
}
