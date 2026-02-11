import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPusherServer } from '@/lib/pusher-server';

// POST broadcast real-time events (cursor, typing, presence)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { channelName, eventName, data } = await req.json();

        if (!channelName || !eventName || !data) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        try {
            const pusher = getPusherServer();
            await pusher.trigger(channelName, eventName, {
                ...data,
                userId: (session.user as any).id,
                userName: session.user.name,
                avatarColor: (session.user as any).avatarColor,
            });
        } catch (pusherError) {
            console.warn('Pusher broadcast failed (service may not be configured):', pusherError);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error broadcasting event:', error);
        return NextResponse.json({ error: 'Failed to broadcast event' }, { status: 500 });
    }
}
