import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Version from '@/models/Version';

// GET version history for a document
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

        const versions = await Version.find({ documentId: id })
            .populate('editedBy', 'name email avatarColor')
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        return NextResponse.json({ versions });
    } catch (error: any) {
        console.error('Error fetching versions:', error);
        return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 });
    }
}
