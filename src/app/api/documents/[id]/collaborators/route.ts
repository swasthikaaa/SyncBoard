import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import DocumentModel from '@/models/Document';
import User from '@/models/User';

// POST add collaborator to document
export async function POST(
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
        const { email } = await req.json();

        const document = await DocumentModel.findById(id);
        if (!document) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        if (document.owner.toString() !== userId) {
            return NextResponse.json({ error: 'Only the owner can add collaborators' }, { status: 403 });
        }

        const collaborator = await User.findOne({ email: email.toLowerCase() });
        if (!collaborator) {
            return NextResponse.json({ error: 'User not found with that email' }, { status: 404 });
        }

        if (collaborator._id.toString() === userId) {
            return NextResponse.json({ error: 'You cannot add yourself as a collaborator' }, { status: 400 });
        }

        const alreadyAdded = document.collaborators.some(
            (c: any) => c.toString() === collaborator._id.toString()
        );

        if (alreadyAdded) {
            return NextResponse.json({ error: 'User is already a collaborator' }, { status: 400 });
        }

        document.collaborators.push(collaborator._id);
        await document.save();

        const updated = await DocumentModel.findById(id)
            .populate('collaborators', 'name email avatarColor')
            .lean();

        return NextResponse.json({
            message: 'Collaborator added',
            collaborators: updated!.collaborators,
        });
    } catch (error: any) {
        console.error('Error adding collaborator:', error);
        return NextResponse.json({ error: 'Failed to add collaborator' }, { status: 500 });
    }
}
