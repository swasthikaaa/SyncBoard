import PusherClient from 'pusher-js';

let pusherClient: PusherClient | null = null;

export function getPusherClient(): PusherClient {
    if (!pusherClient) {
        pusherClient = new PusherClient(
            process.env.NEXT_PUBLIC_PUSHER_KEY || 'demo-key',
            {
                cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2',
                forceTLS: true,
            }
        );
    }
    return pusherClient;
}
