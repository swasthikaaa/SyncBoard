import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
        }

        const user = await User.findOne({
            email: email.toLowerCase(),
            resetOTP: otp,
            resetOTPExpires: { $gt: new Date() }
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
        }

        return NextResponse.json({ message: 'OTP verified successfully' });
    } catch (error: any) {
        console.error('Verify OTP error:', error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
